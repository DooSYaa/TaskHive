import React from 'react';
import './UsersList.css';
import Button from '../ButtonComponent/Button';
import Avatar from '@mui/material/Avatar';
import CrownIcon from '../../assets/CrownIcon';
import VerticalDotsIcon from '../../assets/VerticalDotsIcon';
import { useAuth } from '../Context/AuthContext';

function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 60%, 80%)`;
  return color;
}

function UsersList({ users, showModal, setShowModal }) {
  const { user } = useAuth();
  const isCurrentUserAdmin = users?.some(
    u => u.userId === user.id && u.userRole === 'Admin',
  );
  console.log('Is current user admin?', isCurrentUserAdmin);

  return (
    <div
      className="flex flex-col gap-6 h-full"
      style={{ marginLeft: '10px', marginRight: '10px' }}
    >
      {/* --- HEADER: Заголовок и Кнопка --- */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Team Members</h2>
          <p className="text-sm text-gray-500">
            Manage who has access to this group
          </p>
        </div>
        <Button
          variant={'group'}
          onClick={() => setShowModal(showModal === 'users' ? false : 'users')}
        >
          + Add Member
        </Button>
      </div>

      <div className="grid-mesh">
        {users ? (
          users.map((user, index) => (
            <div
              key={index}
              className="relative bg-white border border-gray-200 rounded-xl flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-200 group user-card"
            >
              {isCurrentUserAdmin && (
                <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-gray-100">
                  <VerticalDotsIcon width="16" height="16" />
                </button>
              )}
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: 32,
                  bgcolor: stringToColor(user.userName),
                  color: '#374151',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  border: '4px solid white', // Белая обводка
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {user.userName.charAt(0).toUpperCase()}
              </Avatar>

              <div className="flex flex-col gap-1 items-center w-full">
                <div className="font-bold text-lg text-gray-800 truncate w-full">
                  {user.userName}
                </div>

                {user.userRole === 'Admin' ? (
                  <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-200">
                    <CrownIcon width="14" height="14" fill="#ca8a04" /> Admin
                  </div>
                ) : (
                  <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">
                    Member
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-10">
            No users found.
          </div>
        )}
      </div>
      <div className="border h-96 mt-6 rounded-xl bg-gray-50 p-4 text-gray-500">
        Activity Log (Placeholder)
      </div>
    </div>
  );
}

export default UsersList;
