import './workingSpace.css';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
import { useEffect, useState } from 'react';
import Button from '../ButtonComponent/Button.jsx';
import GroupModal from '../GroupComponent/GroupModal.jsx';
import CreateKanbanTable from './CreateKanbanTable.jsx';
import SideMenu from './SideMenu.jsx';
import UsersList from './UsersList.jsx';
import WorkingSpaceChat from './WorkingSpaceChat.jsx';
import WorkingSpaceSettings from './WorkingSpaceSettings.jsx';
import WorkingSpaceMyTasks from './WorkingSpaceMyTasks.jsx';
import WorkingSpaceDashboards from './WorkingSpaceDashboards.jsx';
import { HubConnectionState } from '@microsoft/signalr';
import { useSignalR } from '../Context/SignalRContext.jsx';

export default function WorkingSpace() {
  const { groupId } = useParams();
  const { connection } = useSignalR();
  const { user } = useAuth();
  const [kanbanTables, setKanbanTables] = useState(null);
  const [users, setUsers] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [KanbanTableName, setKanbanTableName] = useState('');
  const [friendName, setFriendName] = useState('');

  const [activeTab, setActiveTab] = useState('dashboards');
  const menuItems = [
    { id: 'dashboards', label: 'Boards' },
    { id: 'users', label: 'Users' },
    { id: 'chat', label: 'Chat' },
    { id: 'settings', label: 'Settings' },
    { id: 'myTasks', label: 'My Tasks' },
  ];

  console.log('WorkingSpace Connection ID:', connection?.connectionId);

  useEffect(() => {
    if (!connection || !groupId) return;

    if (connection.state === HubConnectionState.Connected) {
      connection
        .invoke('JoinGroup', groupId)
        .catch(error => console.error('failed to join group', error));
    }

    return () => {
      // if (connection.state === HubConnectionState.Connected) {
      //   connection
      //     .invoke('LeaveGroup', groupId)
      //     .catch(err => console.error('Failed to leave group', err));
      // }
    };
  }, [connection, groupId]);

  const handleCreateKanbanTable = async e => {
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
    fetchTables();
    setShowModal(false);
  };

  const handleAddUserToGroup = async e => {
    e.preventDefault();
    const response = await fetch(
      'http://localhost:5292/api/Group/AddUserToGroup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          groupId: groupId,
          friendName: friendName,
        }),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to add user to group\n' + response.status);
    }
    fetchUsers();
    setShowModal(false);
  };

  const fetchTables = async () => {
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
  const fetchUsers = async () => {
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
      throw new Error('Failed to fetch Users', response.status);
    }
    const data = await response.json();
    setUsers(data);
  };
  useEffect(() => {
    fetchTables();
    fetchUsers();
  }, []);

  return (
    <div className="flex">
      <div className="workingSpace">
        {activeTab === 'dashboards' && (
          <WorkingSpaceDashboards
            kanbanTables={kanbanTables}
            setShowModal={setShowModal}
          />
        )}
        {activeTab === 'users' && (
          <UsersList setShowModal={setShowModal} users={users} />
        )}
        {activeTab === 'chat' && <WorkingSpaceChat />}
        {activeTab === 'settings' && <WorkingSpaceSettings />}
        {activeTab === 'myTasks' && <WorkingSpaceMyTasks />}
      </div>
      <div className="menu-space border">
        <div className="menu-list">
          <SideMenu
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            menuItems={menuItems}
          />
        </div>
      </div>
      {showModal && (
        <CreateKanbanTable
          KanbanTableName={KanbanTableName}
          handleCreateKanbanTable={handleCreateKanbanTable}
          setKanbanTableName={setKanbanTableName}
          showModal={showModal}
          setShowModal={setShowModal}
          handleAddUserToGroup={handleAddUserToGroup}
          friendName={friendName}
          setFriendName={setFriendName}
        />
      )}
    </div>
  );
}
