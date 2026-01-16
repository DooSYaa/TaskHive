import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../Context/AuthContext';
import Button from '../ButtonComponent/Button';
import BigTaskCard from '../WorkingSpaceComponent/BigTaskCard';

function MyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState();
  const [sortType, setSortType] = useState('dateAsc');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions = [
    { label: '📅 Deadline (Oldest first)', value: 'dateAsc' },
    { label: '📅 Deadline (Newest first)', value: 'dateDesc' },
    { label: '🔥 Priority (High -> Low)', value: 'priorityDesc' },
    { label: '📋 By board name (A-Z)', value: 'boardAsc' },
  ];
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'http://localhost:5292/api/Kanban/GetMyTasks',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        },
      );
      if (!response.ok) throw new Error('Error fetch data' + response.status);
      const data = await response.json();
      console.log(data);
      setTasks(data);
    };
    fetchData();
  }, [user?.token]);
  const sortedTasks = useMemo(() => {
    if (!tasks) return [];

    const sorted = [...tasks];

    switch (sortType) {
      case 'dateAsc':
        return sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

      case 'dateDesc':
        return sorted.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

      case 'priorityDesc':
        return sorted.sort((a, b) => b.priority - a.priority);

      case 'boardAsc':
        return sorted.sort((a, b) => a.tableName.localeCompare(b.tableName));
      default:
        return sorted;
    }
  }, [tasks, sortType]);
  const currentLabel = sortOptions.find(o => o.value === sortType)?.label;
  return (
    <div>
      <div className="tasks-control-panel">
        <div className="relative">
          <Button
            variant="sorting"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="sort-button"
          >
            Sort by: {currentLabel} ▼
          </Button>

          {isSortOpen && (
            <div className="sort-dropdown-menu">
              {sortOptions.map(option => (
                <div
                  key={option.value}
                  className={`sort-option ${sortType === option.value ? 'active' : ''}`}
                  onClick={() => {
                    setSortType(option.value);
                    setIsSortOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}

          {isSortOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsSortOpen(false)}
            ></div>
          )}
        </div>
      </div>
      <div className="tasks-container">
        <h1 className="tasks-header">My Tasks</h1>
        <div className="tasks-grid">
          {sortedTasks?.map(task => (
            <BigTaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyTasks;
