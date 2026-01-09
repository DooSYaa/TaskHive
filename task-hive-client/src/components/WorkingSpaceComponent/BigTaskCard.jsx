import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BigTaskCard.css';
function BigTaskCard({ task }) {
  const navigate = useNavigate();
  const priorityColors = ['#22c55e', '#eab308', '#ef4444', '#000000'];
  const priorityLabels = ['Low', 'Medium', 'High', 'Urgent'];
  const isOverdue = new Date(task.dueDate) < new Date();
  return (
    <div className="big-task-card">
      <div className="card-header">
        <div className="flex items-center justify-center gap-1">
          <span className="board-name">{task.tableName}</span>
          <div className="status-badge">{task.statusName}</div>
        </div>
        <div className="priority-badge">
          <div
            className="priority-dot"
            style={{ background: priorityColors[task.priority] }}
          ></div>
          <span className="priority-text">{priorityLabels[task.priority]}</span>
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{task.title}</h3>
        <p className="card-description">
          {task.description || 'Нет описания...'}
        </p>
      </div>
      <div className="card-footer">
        <div className="marks-container">
          {task.marks.map(mark => (
            <div
              key={mark.id}
              className="mark-item"
              style={{ backgroundColor: mark.hexColor }}
            >
              {mark.markName}
            </div>
          ))}
        </div>
        <div className="date-container">
          <div className="date-label">Deadline</div>
          <div className={`date-value ${isOverdue ? 'overdue' : ''}`}>
            {new Date(task.dueDate).toLocaleDateString('pl-PL')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BigTaskCard;
