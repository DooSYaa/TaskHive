import './home.css';
import ChatIcon from '../../assets/ChatIcon.jsx';
import FriendsIcon from '../../assets/FriendsIcon.jsx';
import TaskWidget from './TaskWidget';
import GroupModal from '../GroupComponent/GroupModal.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
import { useState, useEffect } from 'react';
import { GrTask } from 'react-icons/gr';
import Button from '../ButtonComponent/Button.jsx';
import VerticalDotsIcon from '../../assets/VerticalDotsIcon.jsx';
import RecentBoards from './RecentBoards.jsx';

function Home() {
  const [groupData, setGroupData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const { user } = useAuth();
  const fetchData = async () => {
    try {
      const response = await fetch(
        'http://localhost:5292/api/Group/getMyGroups',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(`Error occurred: ${response.status}`);
      }
      const data = await response.json();
      setGroupData(data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch(
      'http://localhost:5292/api/Group/CreateGroup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          groupName: groupName,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`Error occurred: ${response.status}`);
    }
    fetchData();
    setShowModal(false);
  };
  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  return (
    <div className="home-page">
      {/* --- SIDEBAR --- */}
      <div className="sidebar">
        <div className="mb-6 px-4">
          {/* Сюда можно добавить Логотип приложения */}
          <h2 className="text-xl font-bold text-blue-600">TaskHive</h2>
        </div>

        <Link className="menu-item" to="/friends">
          <FriendsIcon />
          <span>Friends</span>
        </Link>

        <Link className="menu-item" to="/chat">
          <ChatIcon />
          <span>Chat</span>
        </Link>

        <Link className="menu-item" to="/myTasks">
          <GrTask />
          <span>MyTasks</span>
        </Link>
        {/* Сюда можно добавить кнопку Settings или Logout */}
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="main-content">
        {/* Секция приветствия (Опционально) */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Hello, {user?.userName}!
          </h1>
          <p className="text-gray-500">Here is what's happening today.</p>
        </div>

        {/* Секция ГРУПП */}
        <section>
          <h2 className="section-title">Your Groups</h2>

          <div className="groups-grid">
            {/* 1. Карточка создания новой группы (Всегда первая) */}
            <div
              className="create-group-card"
              onClick={() => setShowModal(true)}
            >
              <span className="plus-icon">+</span>
              <span className="font-semibold">Create New Group</span>
            </div>

            {/* 2. Список групп с сервера */}
            {groupData &&
              groupData.map(group => (
                <Link
                  to={`/group/${group.id}`}
                  key={group.id}
                  className="group-card"
                >
                  <div className="group-info">
                    <h3 className="group-name">{group.name}</h3>
                  </div>

                  <div className="group-footer">
                    <span>Open workspace →</span>
                  </div>
                </Link>
              ))}
          </div>
        </section>

        {/* Секция ДОСОК (Заготовка) */}
        <section className="mt-8">
          <h2 className="section-title">Your Tables</h2>
          <RecentBoards />
        </section>
      </div>
      <div className="right-column flex flex-col gap-6">
        <TaskWidget />
        <div className="widget-container bg-blue-50 border-blue-100">
          <h3 className="text-blue-800 font-bold mb-2">💡 Tip of the day</h3>
          <p className="text-sm text-blue-600">
            Drag and drop tasks to update their status quickly!
          </p>
        </div>
      </div>
      {showModal && (
        <GroupModal
          groupName={groupName}
          setGroupName={setGroupName}
          setShowModal={setShowModal}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default Home;
