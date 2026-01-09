import { useState } from 'react';
import { useAuth } from '../Context/AuthContext';

function Priority({
  priority,
  setPriority,
  onPriorityUpdate,
  groupId,
  kanbanId,
  cardId,
}) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const PRIORITIES = [
    { label: 'Low', value: 0, color: '#22c55e' },
    { label: 'Medium', value: 1, color: '#eab308' },
    { label: 'High', value: 2, color: '#ef4444' },
    { label: 'Urgent', value: 3, color: '#000000' },
  ];
  console.log(cardId);
  const selectedOption =
    PRIORITIES.find(x => x.value === priority) || PRIORITIES[0];
  const handleSelect = async newItem => {
    console.log('-------------------');
    console.log(groupId);
    console.log(kanbanId);
    console.log(cardId);
    console.log(newItem);
    setIsOpen(false);
    if (newItem.value === priority) return;
    if (setPriority) setPriority(newItem.value);

    try {
      const response = await fetch(
        'http://localhost:5292/api/Kanban/UpdateTaskPriority',
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
            priority: newItem.value,
          }),
        },
      );
      if (!response.ok) throw new Error('failed to update priority');
      if (onPriorityUpdate) {
        onPriorityUpdate(newItem.value);
        console.log('priority updated!');
      }
    } catch (error) {
      console.error('Error changing priority:', error);
    }
  };
  return (
    <div className="relative w-40">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border border-gray-300 rounded px-3 py-1.5 cursor-pointer bg-white flex items-center justify-between shadow-sm hover:border-blue-400 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: selectedOption.color }}
          ></div>
          <span className="text-sm text-gray-700 font-medium">
            {selectedOption.label}
          </span>
        </div>

        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 overflow-hidden">
          {PRIORITIES.map(option => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: option.color }}
              ></div>
              <span className="text-sm text-gray-700">{option.label}</span>

              {option.value === selectedOption.value && (
                <span className="ml-auto text-blue-600 text-xs">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Priority;
