import './workingSpace.css';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
import { useEffect, useState } from 'react';
import Button from '../ButtonComponent/Button.jsx';
import GroupModal from '../GroupComponent/GroupModal.jsx';
import CreateKanbanTable from './CreateKanbanTable.jsx';

export default function WorkingSpace() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const [kanbanTables, setKanbanTables] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [KanbanTableName, setKanbanTableName] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch(
      'http://localhost:5292/api/Kanban/CreateKanbanTable',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          kanbanTableName: KanbanTableName,
          groupId: groupId,
        }),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to create KanbanTable\n' + response.status);
    }
    fetchData();
    setShowModal(false);
  };

  const fetchData = async () => {
    const response = await fetch(
      `http://localhost:5292/api/Kanban/GetKanbanTables?groupId=${groupId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to fetch Kanban', response.status);
    }
    const data = await response.json();
    setKanbanTables(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex border border-black">
      <div className="workingSpace">
        <div className="createKanbanContainer">
          <Button variant={'group'} onClick={() => setShowModal(true)}>
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
      <div className="menu-space">
        <div className="menu-list">
          <ul className="flex flex-col gap-3 border w-full">
            <li className="border w-full">
              <Button>Boards</Button>
            </li>
            <li>
              <Button>Chat</Button>
            </li>
            <li>
              <Button>Users</Button>
            </li>
            <li>
              <Button>Settings</Button>
            </li>
            <li>
              <Button>My tasks</Button>
            </li>
          </ul>
        </div>
      </div>

      {showModal && (
        <CreateKanbanTable
          KanbanTableName={KanbanTableName}
          setKanbanTableName={setKanbanTableName}
          setShowModal={setShowModal}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
