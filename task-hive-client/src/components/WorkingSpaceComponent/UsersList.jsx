import React from 'react';
import Button from '../ButtonComponent/Button';
function UsersList({ users, showModal, setShowModal }) {
  return (
    <div>
      <div className="createKanbanContainer">
        <Button
          variant={'group'}
          onClick={() => setShowModal(showModal === 'users' ? false : 'users')}
        >
          Add users
        </Button>
      </div>
      {users
        ? users.map((user, index) => <div key={index}>{user.userRole}</div>)
        : null}
    </div>
  );
}

export default UsersList;
