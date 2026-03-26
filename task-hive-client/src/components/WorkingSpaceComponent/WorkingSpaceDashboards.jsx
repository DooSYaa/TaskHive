import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../Context/AuthContext.jsx';
import {
  Box,
  Text,
  DropdownMenu,
  Flex,
  Grid,
  IconButton,
} from '@radix-ui/themes';
import { DotsVerticalIcon } from '@radix-ui/react-icons';

function WorkingSpaceDashboards({
  setKanbanTables,
  kanbanTables,
  showModal,
  setShowModal,
}) {
  const { user } = useAuth();
  const { groupId } = useParams();
  const [hoveredCard, setHoveredCard] = useState(null);
  const handleDeleteKanbanTable = async kanbanId => {
    try {
      const response = await fetch(
        'http://localhost:5292/api/Kanban/DeleteKanbanTable',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            groupId: groupId,
            kanbanId: kanbanId,
          }),
        },
      );
      if (!response.ok)
        throw new Error('Error deleting table', response.status);

      const data = await response.json();
      console.log(data);
      setKanbanTables(prev => prev.filter(x => x.id !== kanbanId));
    } catch (error) {
      console.error('Error', error);
    }
  };
  return (
    <Grid
      columns={'repeat(auto-fill, 15rem)'}
      rows={'repeat(2, 120px)'}
      gap={'4'}
      p={'4'}
    >
      <Flex
        direction={'column'}
        align={'center'}
        justify={'center'}
        className="create-dashboard-card"
        onClick={() => setShowModal(showModal === 'kanban' ? false : 'kanban')}
      >
        <span className="plus-icon">+</span>
        <span className="font-semibold">Create new dashboard</span>
      </Flex>
      {kanbanTables && kanbanTables.length > 0
        ? kanbanTables.map(kanban => {
            const isHovered = hoveredCard === kanban.id;
            return (
              <Link
                style={{ textDecoration: 'none' }}
                to={`/group/${groupId}/${kanban.id}`}
                key={kanban.id}
                className="kanbanTablesList"
                onMouseEnter={() => setHoveredCard(kanban.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Box position={'absolute'} top={'1'} right={'1'}>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                      style={{ visibility: isHovered ? 'visible' : 'hidden' }}
                    >
                      <IconButton
                        variant={'surface'}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <DotsVerticalIcon />
                      </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item onClick={e => e.preventDefault()}>
                        Rename
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        color="red"
                        onClick={e => {
                          e.preventDefault();
                          handleDeleteKanbanTable(kanban.id);
                        }}
                      >
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Box>
                <Flex
                  justify={'center'}
                  align={'center'}
                  width={'100%'}
                  height={'100%'}
                >
                  <Text>{kanban.kanbanTableName}</Text>
                </Flex>
              </Link>
            );
          })
        : null}
    </Grid>
  );
}

export default WorkingSpaceDashboards;
