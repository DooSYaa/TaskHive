import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext.jsx';
import {
  Popover,
  Button,
  Flex,
  Text,
  Avatar,
  ScrollArea,
} from '@radix-ui/themes';
import { Command } from 'cmdk';

function Users({
  setSelectedUser,
  groupId,
  kanbanId,
  cardId,
  onAssignUser,
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (!user || !user.token || !groupId) return;
    let isMounted = true;
    const fetchUsers = async () => {
      try {
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
          throw new Error(`Error loading users: ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setUsers(data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, [groupId, user?.token]);

  const handleBind = async selectedUser => {
    console.log('localSelectedUser:', selectedUser);
    if (selectedUser) {
      try {
        const response = await fetch(
          'http://localhost:5292/api/kanban-tables/UpdateTaskAssignedUser',
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              groupId: groupId,
              kanbanId: kanbanId,
              cardId: cardId,
              assignedUserId: selectedUser.userId,
            }),
          },
        );
        if (!response.ok)
          throw new Error(`Error update data: ${response.status}`);
        onAssignUser(selectedUser);
        setActivePanel(null);
      } catch (error) {
        console.error('Error setting user:', error);
      }
      setSelectedUser(selectedUser);
      setActivePanel(null);
    } else {
      alert('Пожалуйста, выберите пользователя из списка.');
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button variant="soft">Assign User</Button>
      </Popover.Trigger>

      <Popover.Content style={{ zIndex: '9999' }} align="center" sideOffset={5}>
        <Command>
          <Flex gap={'1'} direction={'column'}>
            <Text align={'center'}>Members</Text>
            <Command.Input placeholder="Search member..." />
          </Flex>
          <Command.List>
            <Command.Empty>No users found.</Command.Empty>
            <Command.Group>
              <ScrollArea
                scrollbars={'vertical'}
                style={{ maxHeight: '200px' }}
              >
                <Flex pl={'1'} pr={'3'} direction={'column'}>
                  {users.map(user => (
                    <Command.Item
                      key={user.userId}
                      onSelect={() => {
                        handleBind(user);
                      }}
                    >
                      <Flex gap={'2'} align={'center'} p={'2'}>
                        <Avatar size={'2'} fallback={user.userName[0]} />
                        <Text>{user.userName}</Text>
                      </Flex>
                    </Command.Item>
                  ))}
                </Flex>
              </ScrollArea>
            </Command.Group>
          </Command.List>
        </Command>
      </Popover.Content>
    </Popover.Root>
  );
}
export default Users;
