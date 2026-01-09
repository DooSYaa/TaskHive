import { Calendar } from 'primereact/calendar';
import { useState } from 'react';
import 'primereact/resources/themes/lara-light-blue/theme.css';

import Button from '../ButtonComponent/Button';
import { useAuth } from '../Context/AuthContext';

function CalendarComponent({
  date,
  setDate,
  onDateUpdate,
  setActivePanel,
  groupId,
  kanbanId,
  cardId,
}) {
  const { user } = useAuth();
  const [localDate, setLocalDate] = useState(date ? new Date(date) : null);
  console.log(localDate);
  const handleSave = async () => {
    try {
      const response = await fetch(
        'http://localhost:5292/api/Kanban/UpdateTaskDate',
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
            dueDateTime: localDate,
          }),
        },
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      // setDate(JSON.stringify(localDate));
      onDateUpdate(localDate);
      setActivePanel(null);
    } catch (error) {
      console.error('Error save date:', error);
    }
  };

  const handleCancel = () => {
    setActivePanel(null);
  };

  return (
    <div
      className="absolute top-10 right-72 w-72 h-auto p-5 
                 bg-white rounded-lg shadow-2xl border border-gray-200 z-50"
    >
      <div className="mb-4 pb-2 border-b border-gray-300">
        <h3 className="text-lg font-semibold text-gray-800">Term</h3>
      </div>
      <div className="flex flex-col items-start w-full mb-6">
        <label
          htmlFor="end-term-date"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Выберите дату окончания:
        </label>
        <div className="w-full">
          <Calendar
            id="end-term-date"
            value={localDate}
            onChange={e => setLocalDate(e.value)}
            dateFormat="dd.mm.yy"
            className="p-inputtext w-full text-base h-10 
                       bg-white text-gray-800 border border-gray-300 
                       rounded-md focus:border-blue-500 focus:ring-blue-500"
            showIcon={true}
          />
        </div>
      </div>
      <div className="w-full flex justify-between gap-3 pt-4 border-t border-gray-300">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}

export default CalendarComponent;
