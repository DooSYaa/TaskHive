import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './RecentBoards.css';

// SVG Иконка "Колонки"
const KanbanIcon = () => (
  <svg className="board-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h4v16H4V4zm6 0h4v16h-4V4zm6 0h4v16h-4V4z" />
  </svg>
);

export default function RecentBoards() {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Цвета для полосок (чтобы было красиво)
  const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
  ];
  const getRandomColor = id => colors[String(id).charCodeAt(0) % colors.length];

  useEffect(() => {
    // В реальном проекте тут должен быть fetch('api/Kanban/GetMyBoards')
    // Пока сделаем фейковые данные для демонстрации дизайна
    const fetchBoards = async () => {
      try {
        // Эмуляция запроса
        // const res = await fetch(...)
        const response = await fetch(
          'http://localhost:5292/api/Kanban/GetMyBoards',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error('Failed to fetch Boards', response.status);
        }
        const data = await response.json();
        console.log('Fetched boards for RecentBoards:', data);
        setBoards(data);
        // ДЕМО ДАННЫЕ (замени потом на реальный fetch)
        // const mockData = [
        //   {
        //     id: 'k1',
        //     name: 'Frontend Tasks',
        //     groupId: 'g1',
        //     groupName: 'Web Development',
        //   },
        //   {
        //     id: 'k2',
        //     name: 'Marketing Plan',
        //     groupId: 'g2',
        //     groupName: 'Marketing',
        //   },
        //   {
        //     id: 'k3',
        //     name: 'Backend API',
        //     groupId: 'g1',
        //     groupName: 'Web Development',
        //   },
        //   {
        //     id: 'k4',
        //     name: 'Design System',
        //     groupId: 'g3',
        //     groupName: 'Design Team',
        //   },
        // ];
        // setBoards(mockData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [user]);

  if (loading) return <div>Loading boards...</div>;

  return (
    <div className="boards-grid">
      {boards.map(board => (
        <Link
          to={`/group/${board.groupId}/${board.id}`}
          key={board.id}
          className="board-card"
          style={{ borderLeftColor: getRandomColor(board.id) }}
        >
          <div className="board-context">
            <KanbanIcon />
            {board.groupName}
          </div>
          <div className="board-title">{board.kanbanTableName}</div>
        </Link>
      ))}
    </div>
  );
}
