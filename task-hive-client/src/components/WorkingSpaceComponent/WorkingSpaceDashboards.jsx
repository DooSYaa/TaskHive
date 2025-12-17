import { useParams } from 'react-router-dom';
import Button from '../ButtonComponent/Button';
import { Link } from 'react-router-dom';

function WorkingSpaceDashboards({ kanbanTables, showModal, setShowModal }) {
  const { groupId } = useParams();

  return (
    <div>
      <div className="createKanbanContainer">
        <Button
          variant={'group'}
          onClick={() =>
            setShowModal(showModal === 'kanban' ? false : 'kanban')
          }
        >
          Create kanban
        </Button>
      </div>
      {kanbanTables
        ? kanbanTables.map(kanban => (
            <Link
              style={{ textDecoration: 'none' }}
              to={`/group/${groupId}/${kanban.id}`}
              key={kanban.id}
            >
              <div className="kanbanTablesList">{kanban.kanbanTableName}</div>
            </Link>
          ))
        : null}
    </div>
  );
}

export default WorkingSpaceDashboards;
