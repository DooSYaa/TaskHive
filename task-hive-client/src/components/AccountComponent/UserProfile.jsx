import './account.model.css';
import { useAuth } from '../Context/AuthContext';
import { useEffect, useState } from 'react';
import { Box, Flex, Avatar, Text, Button, Dialog } from '@radix-ui/themes';

export default function UserProfile({ isUserProfileOpen, onClose }) {
  const [avatar, setAvatar] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      try {
        const fetchUserData = async () => {
          const response = await fetch(
            `http://localhost:5292/api/Account/get-user?userId=${user.id}`,
          );
          const userData = await response.json();
          console.log('Fetched user data:', userData);
          setAvatar(userData.avatarUrl);
        };
        fetchUserData();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  }, [user]);

  return (
    <Dialog.Root open={isUserProfileOpen} onOpenChange={onClose}>
      <Dialog.Content minHeight={'300px'}>
        <Flex direction="column">
          <Flex direction="column">
            <Avatar
              src={`http://localhost:5292/${avatar}`}
              fallback={user.userName[0]}
              size={'8'}
            />
            <Text>
              {user.firstName} {user.lastName}
            </Text>
          </Flex>
          {user.userName}
          {user.email}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
// <Flex
//   justify={'center'}
//   style={{ border: '1px solid black' }}
//   height={'93vh'}
// >
//   <Flex
//     mt={'2'}
//     justify={'center'}
//     style={{ border: '1px solid blue' }}
//     width={'800px'}
//     height={'200px'}
//     gap={'5'}
//   >
//     <Box style={{ border: '1px solid black' }}>
//       <Avatar
//         size={'8'}
//         radius={'full'}
//         src={`http://localhost:5292/${avatar}`}
//         alt="User Avatar"
//       />
//     </Box>
//     <Flex direction={'column'} style={{ border: '1px solid black' }}>
//       <Text weight={'bold'}>{user.userName}</Text>
//       <Flex>
//         <Text size={'2'}>
//           {user.firstName} {user.lastName}
//         </Text>
//       </Flex>
//     </Flex>
//   </Flex>
//   <Dialog.Root open>
//     <Dialog.Content>
//       <Dialog.Title>Change Avatar</Dialog.Title>
//     </Dialog.Content>
//   </Dialog.Root>
// </Flex>
