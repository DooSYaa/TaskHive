import { useParams } from 'react-router-dom';
import Button from '../ButtonComponent/Button';
import VerticalDotsIcon from '../../assets/VerticalDotsIcon.jsx';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../Context/AuthContext.jsx';

function WorkingSpaceDashboards({
  setKanbanTables,
  kanbanTables,
  showModal,
  setShowModal,
}) {
  const { user } = useAuth();
  const { groupId } = useParams();
  const [kanbanMenu, setKanbanMenu] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const handleDeleteKanbanTable = async kanbanId => {
    try {
      const response = await fetch(
        'http://localhost:5292/api/Kanban/DeleteKanbanTable',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            groupId: groupId,
            kanbanId: kanbanId,
          }),
        },
      );
      if (!response.ok)
        throw new Error('Error deleting table', response.status);

      const data = await response.json();
      console.log(data);
      setKanbanTables(prev => prev.filter(x => x.id !== kanbanId));
    } catch (error) {
      console.error('Error', error);
    }
  };
  return (
    <div>
      <div className="dashboard-grid">
        <div
          className="create-dashboard-card"
          onClick={() =>
            setShowModal(showModal === 'kanban' ? false : 'kanban')
          }
        >
          <span className="plus-icon">+</span>
          <span className="font-semibold">Create new dashboard</span>
        </div>
        {kanbanTables && kanbanTables.length > 0
          ? kanbanTables.map(kanban => {
              const isOpen = kanbanMenu === kanban.id;
              const isHovered = hoveredCard === kanban.id;
              return (
                <Link
                  style={{ textDecoration: 'none' }}
                  to={`/group/${groupId}/${kanban.id}`}
                  key={kanban.id}
                  className="kanbanTablesList"
                  onMouseEnter={() => setHoveredCard(kanban.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className="absolute top-2 left-1"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      setKanbanMenu(isOpen ? null : kanban.id);
                    }}
                    style={{ visibility: isHovered ? 'visible' : 'hidden' }}
                  >
                    <VerticalDotsIcon />
                  </div>
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="">{kanban.kanbanTableName}</div>
                  </div>
                  {isOpen && (
                    <div
                      className="
                        absolute
                        top-1
                        right-15
                        w-40
                        rounded-md
                        border
                        bg-white
                        shadow-lg
                        z-50"
                    >
                      <div
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                        onClick={e => e.preventDefault()}
                      >
                        Переименовать
                      </div>
                      <div
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                        onClick={e => {
                          e.preventDefault();
                          handleDeleteKanbanTable(kanban.id);
                        }}
                      >
                        Удалить
                      </div>
                    </div>
                  )}
                </Link>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default WorkingSpaceDashboards;
