import './group.css';
import GroupModal from './GroupModal.jsx';
import Button from '../ButtonComponent/Button.jsx';
import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext.jsx';
import { Link } from 'react-router-dom';

export default function Group() {
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupData, setGroupData] = useState(null);
  const { user } = useAuth();
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
  const fetchData = async () => {
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
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="flex flex-1 flex-col">
      <div className="create-group-container">
        <Button variant={'group'} onClick={() => setShowModal(true)}>
          Create group
        </Button>
      </div>

      <div className="group-list">
        {groupData
          ? groupData.map(group => (
              <Link
                className="group-block-name"
                to={`/group/${group.id}`}
                key={group.id}
              >
                <div className="group-block">
                  <h2>{group.name}</h2>
                </div>
              </Link>
            ))
          : null}
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
