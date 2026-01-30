import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import {
  DropdownMenu,
  Theme,
  Button,
  Text,
  Flex,
  TextField,
  ScrollArea,
  Box,
  Grid,
} from '@radix-ui/themes';
import {
  MinusCircledIcon,
  PlusCircledIcon,
  PlusIcon,
  TrashIcon,
} from '@radix-ui/react-icons';

const COLORS = [
  'yellow',
  'amber',
  'orange',
  'tomato',
  'red',
  'ruby',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'iris',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'jade',
  'green',
  'grass',
  'lime',
];

function Mark({
  setActivePanel,
  activeMarksIds = [],
  onToggleMark,
  groupId,
  kanbanId,
  cardId,
}) {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newMarkName, setNewMarkName] = useState('');
  const [marks, setMarks] = useState([]);
  const [color, setColor] = useState('');
  const fetchMarks = async () => {
    const response = await fetch(
      `http://localhost:5292/api/Kanban/GetMarks?GroupId=${groupId}&KanbanId=${kanbanId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      },
    );
    if (!response.ok) throw new Error(`Error loading marks ${response.status}`);
    const data = await response.json();
    setMarks(data);
  };
  useEffect(() => {
    fetchMarks();
  }, [groupId, kanbanId, user]);
  const handleCreateTaskMark = async () => {
    const response = await fetch(
      'http://localhost:5292/api/Kanban/CreateTaskMark',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          markName: newMarkName,
          hexColor: '',
          groupId: groupId,
          kanbanId: kanbanId,
        }),
      },
    );
    if (!response.ok)
      throw new Error(`Error creating new mark: ${response.status}`);
    const data = await response.json();
    setMarks(prev => [...prev, data]);
    setNewMarkName('');
    setIsCreating(false);
    setDisplayColorPicker(false);
  };
  const handleUpdateTaskMarks = async (markId, action) => {
    if (action === 'update') {
      const response = await fetch(
        'http://localhost:5292/api/Kanban/UpdateTaskMarks',
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
            markId: markId,
          }),
        },
      );
      if (!response.ok)
        throw new Error(`Error updating marks: ${await response.text()}`);
      const data = await response.json();
      onToggleMark(data);
    }
    if (action === 'remove') {
      const response = await fetch(
        'http://localhost:5292/api/Kanban/RemoveTaskMarks',
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
            markId: markId,
          }),
        },
      );
      if (!response.ok)
        throw new Error(`Error updating marks: ${await response.text()}`);
      const data = await response.json();
      onToggleMark(data);
    }
  };
  return (
    <Theme>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft">Marks</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          style={{ zIndex: '9999' }}
          align={'center'}
          onCloseAutoFocus={() => setIsCreating(false)}
        >
          {isCreating ? (
            <Flex
              direction={'column'}
              width={'300px'}
              align={'center'}
              gap={'2'}
            >
              <Text>Create mark</Text>
              <Box width={'80%'}>
                <TextField.Root placeholder="Enter the mark name" />
              </Box>
              <Box>
                <Text>Select color</Text>
              </Box>
              <Grid
                columns={'5'}
                rows={'5'}
                gap={'2'}
                style={{ zIndex: '9999' }}
              >
                {COLORS.map(colorName => (
                  <Box
                    display={'block'}
                    key={colorName}
                    width={'30px'}
                    height={'30px'}
                    onClick={() => setColor(colorName)}
                    style={{
                      backgroundColor: `var(--${colorName}-9)`,
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-1)',
                      outline:
                        color === colorName
                          ? '2px solid var(--gray-12)'
                          : 'none',
                      outlineOffset: '1px',
                    }}
                  ></Box>
                ))}
              </Grid>
              <Flex gap={'2'}>
                <Button>Create</Button>
                <Button onClick={() => setIsCreating(false)}>Cancel</Button>
              </Flex>
            </Flex>
          ) : (
            <>
              <DropdownMenu.Label>
                <Text>Current marks</Text>
              </DropdownMenu.Label>
              <ScrollArea scrollbars={'vertical'} style={{ height: 350 }}>
                {marks.map(mark => {
                  const isAssigned = (activeMarksIds || []).some(
                    am => am.id === mark.id,
                  );
                  return (
                    <Flex align={'center'} gap={'2'} p={'1'} width={'300px'}>
                      <Button
                        size={'1'}
                        variant="ghost"
                        onClick={() =>
                          handleUpdateTaskMarks(
                            mark.id,
                            isAssigned ? 'remove' : 'update',
                          )
                        }
                      >
                        {isAssigned ? (
                          <MinusCircledIcon />
                        ) : (
                          <PlusCircledIcon />
                        )}
                      </Button>
                      <Flex
                        flexGrow={'1'}
                        align={'center'}
                        justify={'center'}
                        style={{
                          backgroundColor: mark.hexColor,
                          borderRadius: 'var(--radius-2)',
                          height: '28px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      >
                        {mark.markName}
                      </Flex>
                      <Flex gap={'1'}>
                        <Button size={'1'} variant="ghost" color="red">
                          <TrashIcon />
                        </Button>
                      </Flex>
                    </Flex>
                  );
                })}
              </ScrollArea>
              <DropdownMenu.Separator />
              <Button onClick={() => setIsCreating(true)}>
                <Text>Create mark</Text>
                <PlusIcon />
              </Button>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Theme>
  );
}
export default Mark;
