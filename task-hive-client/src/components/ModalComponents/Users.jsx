import { useState, useEffect } from 'react';
import Button from '../ButtonComponent/Button.jsx';
import { AutoComplete } from 'primereact/autocomplete';
// Стили лучше импортировать в App.js или main.jsx, но можно оставить и здесь
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';

function Users({ setActivePanel, setSelectedUser }) {
  // Храним объект пользователя, а не просто строку
  const [localSelectedUser, setLocalSelectedUser] = useState(null);
  const [users, setUsers] = useState([]); // Список загруженный с API
  const [filteredUsers, setFilteredUsers] = useState([]); // Список для автокомплита

  // Имитация загрузки данных с твоего C# API (GET /api/users)
  useEffect(() => {
    // В реальности здесь будет axios.get('/api/users')
    const fetchUsers = async () => {
      // Пример данных, которые придут из MySQL
      const mockDbData = [
        { id: 1, username: 'DooSyaa', avatar: 'D' },
        { id: 2, username: 'eurosting73', avatar: 'E' },
        { id: 3, username: 'rozmarin41', avatar: 'R' },
        { id: 4, username: 'BonnZaiiTree', avatar: 'B' },
        { id: 5, username: 'BonnZaiiTwo', avatar: 'B' },
        { id: 6, username: 'CraftHunter', avatar: 'C' },
      ];
      setUsers(mockDbData);
    };
    fetchUsers();
  }, []);

  const search = event => {
    // Поиск выполняется на клиенте (если юзеров < 1000)
    // Если юзеров много, нужно делать запрос к API внутри этого метода
    const query = event.query.toLowerCase();

    if (!query.trim().length) {
      setFilteredUsers([...users]);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().startsWith(query),
      );
      setFilteredUsers(filtered);
    }
  };

  const handleBind = () => {
    if (localSelectedUser) {
      console.log('Привязываем пользователя ID:', localSelectedUser.id);
      // Вызываем функцию родителя, чтобы передать данные
      setSelectedUser(localSelectedUser);
      setActivePanel(null);
    } else {
      alert('Пожалуйста, выберите пользователя из списка.');
    }
  };

  // Шаблон элемента выпадающего списка
  const itemTemplate = item => {
    return (
      <div className="flex items-center gap-2 p-2 hover:bg-gray-100 transition duration-150 cursor-pointer">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
          {item.avatar}
        </div>
        <span className="text-gray-800 font-medium">{item.username}</span>
      </div>
    );
  };

  return (
    // Используем z-50 и shadow-2xl для эффекта "поверх всего"
    <div className="absolute top-12 right-52 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-5 animate-fade-in-down">
      {/* Заголовок */}
      <div className="mb-5 pb-3 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">Выбор Исполнителя</h3>
        <p className="text-xs text-gray-500 mt-1">
          Назначьте ответственного за задачу
        </p>
      </div>

      {/* Поле ввода */}
      <div className="mb-6">
        <label
          htmlFor="user-autocomplete"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Поиск пользователя
        </label>

        <AutoComplete
          id="user-autocomplete"
          value={localSelectedUser}
          suggestions={filteredUsers}
          completeMethod={search}
          field="username" // Важно: указываем какое поле объекта показывать в инпуте
          onChange={e => setLocalSelectedUser(e.value)}
          placeholder="Начните вводить имя..."
          itemTemplate={itemTemplate}
          dropdown
          forceSelection // Запрещает вводить текст, которого нет в списке
          className="w-full"
          inputClassName="w-full p-inputtext h-10 pl-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-800"
          panelClassName="bg-white shadow-lg border border-gray-200 rounded-lg mt-1 overflow-hidden"
        />
      </div>

      {/* Кнопки */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        {/* Кнопка Отмены - серая/прозрачная */}
        <div onClick={() => setActivePanel(null)}>
          <Button className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition">
            Cancel
          </Button>
        </div>

        {/* Кнопка Действия - синяя/акцентная */}
        <div onClick={handleBind}>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm shadow-md transition disabled:opacity-50"
            disabled={!localSelectedUser}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Users;
