import { Draggable } from '@hello-pangea/dnd';
import { useState } from 'react';
import {
  DropdownMenu,
  Button,
  Badge,
  Box,
  Flex,
  Avatar,
  IconButton,
} from '@radix-ui/themes';
import { CalendarIcon, DotsVerticalIcon } from '@radix-ui/react-icons';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
export default function TaskCard({ card, handleDeleteCard, index, onClick }) {
  const { user } = useAuth();
  const { groupId } = useParams();
  const { kanbanId } = useParams();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [cardMenu, setCardMenu] = useState(null);
  const priorityColors = ['#22c55e', '#eab308', '#ef4444', '#000000'];

  const handleRemoveCard = async cardId => {
    try {
      const response = await fetch(
        `http://localhost:5292/api/kanban-tables/DeleteKanbanCard?GroupId=${groupId}&KanbanId=${kanbanId}&CardId=${cardId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            groupId: groupId,
            kanbanId: kanbanId,
            cardId: cardId,
          }),
        },
      );
      if (!response.ok) throw new Error('Something wrong', response.status);
      handleDeleteCard(cardId);
    } catch (error) {
      console.error('Error deleting', error);
    }
  };
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="main-kanban-card"
          style={{
            color: 'black',
            userSelect: 'none',
            padding: '8px',
            marginBottom: '8px',
            cursor: snapshot.isDragging ? 'grabbing' : 'pointer',
            background: snapshot.isDragging ? '#E3E3E3' : '#fff',
            borderRadius: '6px',
            boxShadow: snapshot.isDragging
              ? '0 4px 8px rgba(0,0,0,0.2)'
              : '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'transform 0.15s ease, background 0.2s ease',
            ...provided.draggableProps.style,
          }}
          onMouseEnter={() => setHoveredCard(card.id)}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={onClick}
        >
          <div className="flex justify-end h-auto">
            <div
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: priorityColors[card.priority || 0],
                margin: '3px',
              }}
            ></div>
          </div>
          <Flex align={'center'} justify={'between'}>
            <h4 className="wrap-break-word overflow-hidden">{card.title}</h4>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger
                style={{
                  visibility: hoveredCard === card.id ? 'visible' : 'hidden',
                }}
              >
                <IconButton
                  variant={'surface'}
                  size={'1'}
                  onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCardMenu(cardMenu === card.id ? null : card.id);
                  }}
                >
                  <DotsVerticalIcon />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Rename</DropdownMenu.Item>
                <DropdownMenu.Item
                  color="red"
                  onClick={() => handleRemoveCard(card.id)}
                >
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
          <Flex gap={'1'} wrap={'wrap'}>
            {card.marks?.map(mark => (
              <Badge variant={'surface'} color={`${mark.hexColor}`}>
                {mark.markName}
              </Badge>
            ))}
          </Flex>
          <Flex justify={'between'}>
            <Flex gap={'1'} className="text-[12px]" align={'center'}>
              {card.assignedUser && (
                <>
                  <Avatar
                    size={'1'}
                    fallback={`${card.assignedUser.userName[0]}`}
                    radius={'full'}
                  />
                  <div className="h-5">{card.assignedUser.userName}</div>
                </>
              )}
            </Flex>
            <Box className="text-[12px]">
              {card.dueDate && (
                <Flex gap={'1'}>
                  <CalendarIcon />
                  {new Date(card.dueDate).toLocaleDateString('pl-PL')}
                </Flex>
              )}
            </Box>
          </Flex>
        </div>
      )}
    </Draggable>
  );
}
