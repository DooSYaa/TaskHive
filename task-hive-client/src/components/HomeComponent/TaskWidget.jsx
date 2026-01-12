import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './TaskWidget.css';

export default function TaskWidget() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const priorityColors = ['#22c55e', '#eab308', '#ef4444', '#000000'];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          'http://localhost:5292/api/Kanban/GetMyTasks',
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched tasks for widget:', data);
          // Сортируем: сначала срочные (по дате), потом по приоритету
          // Берем только первые 4 задачи для виджета
          const sorted = data
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 4);
          setTasks(sorted);
        }
      } catch (e) {
        console.error('Widget load error', e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchTasks();
  }, [user]);

  const goToTask = task => {
    navigate(`/group/${task.groupId}/${task.kanbanId}`);
  };

  const isUrgent = dateStr => {
    if (!dateStr) return false;
    return (
      new Date(dateStr) < new Date(new Date().setDate(new Date().getDate() + 1))
    ); // Если дедлайн сегодня или завтра
  };

  if (loading) return <div className="widget-container">Loading...</div>;

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3 className="widget-title">🔥 My Focus</h3>
      </div>

      <div className="widget-task-list">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div
              key={task.id}
              className="widget-task-row"
              onClick={() => goToTask(task)}
            >
              <div className="task-row-left">
                {/* Цветная полоска приоритета */}
                <div
                  className="priority-strip"
                  style={{ background: priorityColors[task.priority || 0] }}
                ></div>

                <div className="task-info">
                  <h4>{task.title}</h4>
                  <div className="task-context">
                    {task.tableName} • {task.statusName}
                  </div>
                </div>
              </div>

              {task.dueDate && (
                <div
                  className={`task-date ${isUrgent(task.dueDate) ? 'urgent' : ''}`}
                >
                  {new Date(task.dueDate).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                  })}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">🎉 No urgent tasks. Good job!</div>
        )}
      </div>
    </div>
  );
}
