import { Day, DayPicker } from 'react-day-picker';
import { useState } from 'react';
import { format, isValid, parse } from 'date-fns';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Popover,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useAuth } from '../Context/AuthContext';
import 'react-day-picker/style.css';

function CalendarComponent({
  date,
  onDateUpdate,
  groupId,
  kanbanId,
  cardId,
}) {
  const { user } = useAuth();
  const [range, setRange] = useState({
    from: date ? new Date(date) : new Date(),
    to: undefined,
  });
  const [fromInput, setFromInput] = useState(
    date ? format(new Date(date), 'dd/MM/yyyy') : '',
  );
  const [toInput, setToInput] = useState('');
  const [month, setMonth] = useState(range.from || new Date());
  const [enableRange, setEnableRange] = useState(false);

  const handleRangeSelect = newRange => {
    setRange(newRange || { from: undefined, to: undefined });
    if (newRange?.from) setFromInput(format(newRange.from, 'dd/MM/yyyy'));
    if (newRange?.to) setToInput(format(newRange.to, 'dd/MM/yyyy'));
  };
  const handleTextChange = (value, field) => {
    if (field === 'from') setFromInput(value);
    else setToInput(value);

    const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
    if (isValid(parsedDate)) {
      setMonth(parsedDate);
      setRange(prev => ({ ...prev, [field]: parsedDate }));
    }
  };

  const handleSave = async () => {
    console.log('Saving date:', range.from);
    const dateStr = format(range.from, "yyyy-MM-dd'T'HH:mm:ss");
    try {
      const response = await fetch(
        'http://localhost:5292/api/kanban-tables/UpdateTaskDate',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            groupId: groupId,
            kanbanId: kanbanId,
            cardId: cardId,
            dueDateTime: dateStr,
          }),
        },
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      // setDate(JSON.stringify(localDate));
      onDateUpdate(range.from);
    } catch (error) {
      console.error('Error save date:', error);
    }
  };
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant={'soft'}>Select date</Button>
      </Popover.Trigger>
      <Popover.Content align={'center'} style={{ zIndex: '9999' }}>
        <Flex direction={'column'}>
          <DayPicker
            mode={enableRange ? 'range' : 'single'}
            selected={enableRange ? range : range.from}
            onSelect={
              enableRange
                ? handleRangeSelect
                : d => handleRangeSelect({ from: d })
            }
            month={month}
            onMonthChange={setMonth}
            showOutsideDays
          />
          <Box my={'2'}>
            <Text weight={'medium'}>Date:</Text>
            <Flex direction={'column'} width={'250px'} gap={'2'}>
              <TextField.Root
                placeholder="From: dd/MM/yyyy"
                value={fromInput}
                onChange={e => handleTextChange(e.target.value, 'from')}
              />
              {/* <Flex direction={'column'}>
                <Flex gap={'2'} align={'center'} m={'1'}>
                  <Checkbox onCheckedChange={setEnableRange} />
                  Enable range
                </Flex>
                <TextField.Root
                  placeholder="dd/MM/yyyy"
                  value={enableRange ? toInput : ''}
                  onChange={e => handleTextChange(e.target.value, 'to')}
                  disabled={!enableRange}
                />
              </Flex> */}
            </Flex>
          </Box>
          <Flex gap={'2'}>
            <Popover.Close>
              <Button onClick={handleSave}>Save</Button>
            </Popover.Close>
            <Popover.Close>
              <Button>Cancel</Button>
            </Popover.Close>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}

export default CalendarComponent;
