import React from 'react';
import Button from '../ButtonComponent/Button';

import Avatar from '@mui/material/Avatar';
import CrownIcon from '../../assets/CrownIcon';
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
      <div className="border flex gap-6">
        {users
          ? users.map((user, index) => (
              <div
                key={index}
                className="border h-96 w-3xs flex flex-col items-center"
              >
                <div>
                  <Avatar
                    sx={{ width: '200px', height: '200px', fontSize: '100px' }}
                  >
                    D
                  </Avatar>
                </div>
                <div className="flex flex-col items-center">
                  <div>{user.userName}</div>
                  <div>
                    {user.userRole}
                    {/* {user.userRole === 'Admin' ? <CrownIcon /> : user.userRole} */}
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
      <div className="border h-96">Activity</div>
    </div>
  );
}

export default UsersList;
