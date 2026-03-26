import React from 'react';
import { useAuth } from '../Context/AuthContext';
import {
  Avatar,
  Button,
  Flex,
  Box,
  Text,
  Heading,
  IconButton,
  DropdownMenu,
  Badge,
} from '@radix-ui/themes';
import { DotsVerticalIcon, PlusIcon } from '@radix-ui/react-icons';

// function stringToColor(string) {
//   let hash = 0;
//   for (let i = 0; i < string.length; i += 1) {
//     hash = string.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   const color = `hsl(${hash % 360}, 60%, 80%)`;
//   return color;
// }

function UsersList({ users, showModal, setShowModal }) {
  const { user } = useAuth();
  const isCurrentUserAdmin = users?.some(
    u => u.userId === user?.id && u.userRole === 'Admin',
  );
  console.log('Is current user admin?', isCurrentUserAdmin);
  console.log(users);
  return (
    <Flex
      direction={'column'}
      gap={'1'}
      height={'100vh'}
      ml={'10px'}
      mr={'10px'}
    >
      {/* --- HEADER: Заголовок и Кнопка --- */}
      <Flex justify={'between'} align={'center'} mb={'8px'}>
        <Box>
          <Heading as={'h2'} size={'7'} weight={'bold'}>
            Team Members
          </Heading>
          <Text size={'2'} color={'gray'}>
            Manage who has access to this group
          </Text>
        </Box>
        <Button
          variant={'group'}
          onClick={() => setShowModal(showModal === 'users' ? false : 'users')}
        >
          <PlusIcon />
          Add Member
        </Button>
      </Flex>

      <Flex gap={'4'}>
        {users ? (
          users.map(user => (
            // <div
            //   key={index}
            //   className="relative bg-white border border-gray-200 rounded-xl flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-200 group user-card"
            // >
            //   {isCurrentUserAdmin && (
            //     <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-gray-100">
            //       <VerticalDotsIcon width="16" height="16" />
            //     </button>
            //   )}
            //   <Avatar
            //     fallback={user.userName[0].toUpperCase()}
            //     src={`http://localhost:5292/${user.avatarUrl}`}
            //   />
            //
            //   <div className="flex flex-col gap-1 items-center w-full">
            //     <div className="font-bold text-lg text-gray-800 truncate w-full">
            //       {user.userName}
            //     </div>
            //
            //     {user.userRole === 'Admin' ? (
            //       <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-200">
            //         <CrownIcon width="14" height="14" fill="#ca8a04" /> Admin
            //       </div>
            //     ) : (
            //       <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">
            //         Member
            //       </div>
            //     )}
            //   </div>
            // </div>
            <Flex
              position={'relative'}
              direction={'column'}
              justify={'center'}
              align={'center'}
              width={'200px'}
              height={'200px'}
              style={{
                border: '1px solid var(--slate-4)',
                borderRadius: '0.5rem',
                boxShadow: '3px 3px 10px var(--slate-4)',
              }}
            >
              <Box position={'absolute'} top={'3'} right={'3'}>
                {isCurrentUserAdmin && (
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <IconButton size={'1'} variant={'ghost'}>
                        <DotsVerticalIcon />
                      </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content side={'right'}>
                      <DropdownMenu.Item>View profile</DropdownMenu.Item>
                      <DropdownMenu.Item color={'red'}>
                        Remove from group
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                )}
              </Box>
              <Flex
                direction={'column'}
                justify={'between'}
                pt={'4'}
                pb={'4'}
                height={'100%'}
              >
                <Avatar
                  size={'5'}
                  fallback={user.userName[0].toUpperCase()}
                  src={`http://localhost:5292/${user.avatarUrl}`}
                />
                <Flex
                  direction={'column'}
                  gap={'1'}
                  align={'center'}
                  width={'100%'}
                >
                  <Box>
                    <Text>{user.userName}</Text>
                  </Box>
                  <Badge
                    size={'2'}
                    variant={'outline'}
                    color={user.userRole === 'Admin' ? 'red' : 'cyan'}
                  >
                    {user.userRole}
                  </Badge>
                </Flex>
              </Flex>
            </Flex>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-10">
            No users found.
          </div>
        )}
      </Flex>
      <div className="border h-96 mt-6 rounded-xl bg-gray-50 p-4 text-gray-500">
        Activity Log (Placeholder)
      </div>
    </Flex>
  );
}
export default UsersList;
