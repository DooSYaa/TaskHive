import { useParams } from 'react-router-dom';
import Button from '../ButtonComponent/Button';
import { Link } from 'react-router-dom';

function WorkingSpaceDashboards({ kanbanTables, showModal, setShowModal }) {
  const { groupId } = useParams();

  return (
    <div>
      {kanbanTables && kanbanTables.length > 0 ? (
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
          {kanbanTables.map(kanban => (
            <Link
              style={{ textDecoration: 'none' }}
              to={`/group/${groupId}/${kanban.id}`}
              key={kanban.id}
            >
              <div className="kanbanTablesList">{kanban.kanbanTableName}</div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default WorkingSpaceDashboards;
