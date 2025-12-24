import { Calendar } from 'primereact/calendar';
import { useState } from 'react';
// Важно: если мы используем светлый дизайн Tailwind, лучше импортировать светлую тему PrimeReact.
// Используем нейтральную светлую тему PrimeReact (например, lara-light-blue)
import 'primereact/resources/themes/lara-light-blue/theme.css';

import Button from '../ButtonComponent/Button';

function CalendarComponent({ date, setDate, setActivePanel }) {
  const [localDate, setLocalDate] = useState(date ? new Date(date) : null);

  const handleSave = () => {
    console.log('save clicked');
    setDate(localDate); // Обновляем черновик родителя
    setActivePanel(null); // Закрываем окно
  };

  // 3. Функция отмены (просто закрываем, ничего не меняя в родителе)
  const handleCancel = () => {
    setActivePanel(null);
  };

  return (
    // 1. Контейнер: Сохранены оригинальные top/right. Узкий формат w-72.
    // Фон изменен на белый/светлый, рамки и тени настроены для светлой темы.
    <div
      className="absolute top-10 right-72 w-72 h-auto p-5 
                 bg-white rounded-lg shadow-2xl border border-gray-200 z-50"
    >
      {/* 2. Заголовок */}
      <div className="mb-4 pb-2 border-b border-gray-300">
        <h3 className="text-lg font-semibold text-gray-800">Term</h3>
      </div>

      {/* 3. Выбор даты */}
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
