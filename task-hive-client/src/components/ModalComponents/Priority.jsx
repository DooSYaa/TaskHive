import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';

function Priority({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selcetedPriority, setSelectedPriority] = useState(null);
  const PRIORITIES = [
    { label: 'Low', value: 'low', color: '#22c55e' }, // Зеленый (Tailwind green-500)
    { label: 'Medium', value: 'medium', color: '#eab308' }, // Желтый (Tailwind yellow-500)
    { label: 'High', value: 'high', color: '#ef4444' },
    { label: 'Urgent', value: 'urgent', color: '#000000' },
  ];
  const selectedOption =
    PRIORITIES.find(x => x.value === value) || PRIORITIES[0];
  const handleSelect = PriorityValue => {
    onChange(PriorityValue);
    setIsOpen(false);
  };
  return (
    <div className="relative w-40">
      {' '}
      {/* relative нужен для позиционирования выпадающего списка */}
      {/* --- КНОПКА ОТКРЫТИЯ --- */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border border-gray-300 rounded px-3 py-1.5 cursor-pointer bg-white flex items-center justify-between shadow-sm hover:border-blue-400 transition-colors"
      >
        <div className="flex items-center gap-2">
          {/* Цветная точка */}
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: selectedOption.color }}
          ></div>
          <span className="text-sm text-gray-700 font-medium">
            {selectedOption.label}
          </span>
        </div>

        {/* Стрелочка */}
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
      {/* --- ВЫПАДАЮЩИЙ СПИСОК --- */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 overflow-hidden">
          {PRIORITIES.map(option => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: option.color }}
              ></div>
              <span className="text-sm text-gray-700">{option.label}</span>

              {/* Галочка, если выбран этот пункт */}
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
