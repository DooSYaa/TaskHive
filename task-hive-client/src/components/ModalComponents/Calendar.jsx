// import { Calendar } from 'primereact/calendar';
// import 'primereact/resources/themes/lara-dark-blue/theme.css';
// import Button from '../ButtonComponent/Button';
// function CalendarComponent({ date, setDate, setActivePanel }) {
//   console.log(date);
//   return (
//     <div className="absolute top-10 right-72 h-80 w-96 bg-gray-500">
//       <div>Term</div>
//       <div className="flex flex-col items-start border border-amber-800 w-full">
//         <div>
//           <p>Select end term</p>
//           <div className="p-calendar">
//             <Calendar
//               value={date}
//               onChange={e => setDate(e.value)}
//               dateFormat="dd/mm/yy"
//               className="p-inputtext h-8"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col justify-start items-start border border-amber-200">
//         <div className="w-full flex flex-row justify-center gap-1 border border-emerald-300 ">
//           <Button onClick={() => setActivePanel(null)}>Save</Button>
//           <Button onClick={() => setActivePanel(null)}>Cancel</Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CalendarComponent;

import React from 'react';
import { Calendar } from 'primereact/calendar';
// Важно: если мы используем светлый дизайн Tailwind, лучше импортировать светлую тему PrimeReact.
// Используем нейтральную светлую тему PrimeReact (например, lara-light-blue)
import 'primereact/resources/themes/lara-light-blue/theme.css';

import Button from '../ButtonComponent/Button';

function CalendarComponent({ date, setDate, setActivePanel }) {
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

        {/* PrimeReact Calendar - Стилизация инпута */}
        <div className="w-full">
          <Calendar
            id="end-term-date"
            value={date}
            onChange={e => setDate(e.value)}
            dateFormat="dd/mm/yy"
            // Классы для светлой темы: белый фон инпута, темный текст, светлая рамка.
            className="p-inputtext w-full text-base h-10 
                       bg-white text-gray-800 border border-gray-300 
                       rounded-md focus:border-blue-500 focus:ring-blue-500"
            showIcon={true}
          />
        </div>
      </div>

      {/* 4. Кнопки действий */}
      <div className="w-full flex justify-between gap-3 pt-4 border-t border-gray-300">
        <Button onClick={() => setActivePanel(null)}>Отмена</Button>

        <Button onClick={() => setActivePanel(null)}>Сохранить</Button>
      </div>
    </div>
  );
}

export default CalendarComponent;
