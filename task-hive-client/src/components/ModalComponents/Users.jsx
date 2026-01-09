import { useState, useEffect } from 'react';
import Button from '../ButtonComponent/Button.jsx';
import { AutoComplete } from 'primereact/autocomplete';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { useAuth } from '../Context/AuthContext.jsx';

function Users({
  setActivePanel,
  setSelectedUser,
  groupId,
  kanbanId,
  cardId,
  onAssignUser,
}) {
  const { user } = useAuth();
  const [localSelectedUser, setLocalSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  useEffect(() => {
    if (!user || !user.token || !groupId) return;
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:5292/api/Group/GetGroupUsers?groupId=${groupId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Error loading users: ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setUsers(data);
          setFilteredUsers(data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, [groupId, user?.token]);
  const search = event => {
    const query = event.query.toLowerCase();

    if (!query.trim().length) {
      setFilteredUsers([...users]);
    } else {
      const filtered = users.filter(user =>
        user.userName.toLowerCase().startsWith(query),
      );
      setFilteredUsers(filtered);
    }
  };

  const handleBind = async () => {
    if (localSelectedUser) {
      try {
        const response = await fetch(
          'http://localhost:5292/api/Kanban/UpdateTaskAssignedUser',
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
              assignedUserId: localSelectedUser.userId,
            }),
          },
        );
        if (!response.ok)
          throw new Error(`Error update data: ${response.status}`);
        onAssignUser(localSelectedUser);
        setActivePanel(null);
      } catch (error) {
        console.error('Error setting user:', error);
      }
      setSelectedUser(localSelectedUser);
      setActivePanel(null);
    } else {
      alert('Пожалуйста, выберите пользователя из списка.');
    }
  };

  const itemTemplate = item => {
    return (
      <div className="flex items-center gap-2 p-2 hover:bg-gray-100 transition duration-150 cursor-pointer">
        {/* <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
          {item.avatar}
        </div> */}
        <span className="text-gray-800 font-medium">{item.userName}</span>
      </div>
    );
  };

  return (
    <div className="absolute top-12 right-52 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-5 animate-fade-in-down">
      <div className="mb-5 pb-3 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">Выбор Исполнителя</h3>
        <p className="text-xs text-gray-500 mt-1">
          Назначьте ответственного за задачу
        </p>
      </div>
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
          field="userName"
          onChange={e => setLocalSelectedUser(e.value)}
          placeholder="Начните вводить имя..."
          itemTemplate={itemTemplate}
          dropdown
          forceSelection
          className="w-full"
          inputClassName="w-full p-inputtext h-10 pl-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-800"
          panelClassName="bg-white shadow-lg border border-gray-200 rounded-lg mt-1 overflow-hidden"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <div>
          <Button
            onClick={() => setActivePanel(null)}
            className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition"
          >
            Cancel
          </Button>
        </div>
        <div>
          <Button
            onClick={handleBind}
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
