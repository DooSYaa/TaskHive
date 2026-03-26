import TaskCard from './TaskCard.jsx';
import KanbanInput from './KanbanInput.jsx';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Button, DropdownMenu, Flex, IconButton } from '@radix-ui/themes';
import TaskModal from './TaskModal.jsx';

export default function KanbanBlock({
  column,
  index,
  onCardCreated,
  onCardDeleted,
}) {
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [columnMenu, setColumnMenu] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [isExpandedCard, setIsExpandedCard] = useState(false);
  const [card, setCard] = useState(null);
  const [date, setDate] = useState(null);
  const [priority, setPriority] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeMarkIds, setActiveMarkIds] = useState([]);

  const [description, setDescription] = useState(card?.description || '');
  const [isEditing, setIsEditing] = useState(!card?.description);

  const handleSave = newMarkdown => {
    setDescription(newMarkdown);
    setIsEditing(false);
  };
  const handleCancel = () => {
    if (description) {
      setIsEditing(false);
    }
  };
  const handlePriorityUpdate = newPriorityValue => {
    setPriority(newPriorityValue);
    setCard(prev => ({ ...prev, priority: newPriorityValue }));
    if (column && column.cards) {
      const cardInOriginalArray = column.cards.find(c => c.id === card.id);
      if (cardInOriginalArray) {
        cardInOriginalArray.priority = newPriorityValue;
      }
    }
  };
  const handleToggleMark = mark => {
    const currentMarks = [...activeMarkIds];
    const exists = currentMarks.some(m => m.id === mark.id);

    let newMarksList;
    if (exists) {
      newMarksList = currentMarks.filter(m => m.id !== mark.id);
    } else {
      newMarksList = [...currentMarks, mark];
    }

    setActiveMarkIds(newMarksList);

    setCard(prev => ({ ...prev, marks: newMarksList }));
    if (column && column.cards) {
      const cardInOriginalArray = column.cards.find(c => c.id === card.id);
      if (cardInOriginalArray) {
        cardInOriginalArray.marks = newMarksList;
      }
    }
  };
  const handleAssignUser = user => {
    setSelectedUser(user);
    setCard(prev => ({
      ...prev,
      assignedUser: {
        id: user.userId,
        userName: user.userName,
      },
    }));
    if (column && column.cards) {
      const cardsInOriginalArray = column.cards.find(c => c.id === card.id);
      if (cardsInOriginalArray) {
        cardsInOriginalArray.assignedUser = {
          id: user.userId,
          userName: user.userName,
        };
      }
    }
  };
  const handleDate = date => {
    const dateString = date ? date.toISOString() : null;
    setDate(dateString);
    setCard(prev => ({ ...prev, dueDate: dateString }));
    if (column && column.cards) {
      const cardInOriginalArray = column.cards.find(c => c.id === card.id);
      if (cardInOriginalArray) {
        cardInOriginalArray.dueDate = dateString;
      }
    }
  };

  const handleCardCreatedLocal = newCard => {
    onCardCreated(newCard);
    setShowInput(false);
  };
  const handleDeleteCardLocal = cardId => {
    onCardDeleted(cardId);
  };
  useEffect(() => {
    if (card) {
      setActiveMarkIds(card.marks || []);
      setDate(card.dueDate);
      setPriority(card.priority !== undefined ? card.priority : 0);
      if (card.assignedUser) {
        setSelectedUser({
          id: card.assignedUser.id,
          userName: card.assignedUser.userName,
        });
      } else {
        setSelectedUser(null);
      }
    } else {
      setActiveMarkIds([]);
      setDate(null);
      setPriority(0);
      setSelectedUser(null);
    }
  }, [card]);
  useEffect;
  return (
    <div>
      <Draggable draggableId={column.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="main-kanban-column"
            style={{
              border: snapshot.isDragging
                ? '1px dashed #0D92F4'
                : '1px dashed #fff',
              ...provided.draggableProps.style,
            }}
          >
            <Flex direction={'column'} gap={'1'} className="x">
              <Flex
                justify={'between'}
                align={'center'}
                height={'4vh'}
                style={{ cursor: snapshot.isDragging ? 'grabbing' : 'pointer' }}
                {...provided.dragHandleProps}
                className="kanban-column-title"
                pl={'8px'}
                pr={'8px'}
                onMouseEnter={() => setHoveredColumn(column.id)}
                onMouseLeave={() => setHoveredColumn(null)}
              >
                <h2>{column.statusName}</h2>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger
                    style={{
                      visibility:
                        hoveredColumn === column.id ? 'visible' : 'hidden',
                    }}
                  >
                    <IconButton
                      variant={'surface'}
                      size={'1'}
                      onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setColumnMenu(
                          columnMenu === column.id ? null : column.id,
                        );
                      }}
                    >
                      <DotsVerticalIcon />
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content variant={'soft'} color={'indigo'}>
                    <DropdownMenu.Item>Rename</DropdownMenu.Item>
                    <DropdownMenu.Item color="red">Delete</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Flex>
              <Droppable droppableId={column.id} type="task">
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="droppable-kanban-column"
                  >
                    {column.cards?.map((card, index) => (
                      <TaskCard
                        key={card.id}
                        card={card}
                        handleDeleteCard={handleDeleteCardLocal}
                        index={index}
                        onClick={() => {
                          setIsExpandedCard(true);
                          setCard(card);
                        }}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              {showInput && (
                <KanbanInput
                  onCancel={() => setShowInput(false)}
                  type="card"
                  kanbanColumnId={column.id}
                  onCardCreated={handleCardCreatedLocal}
                />
              )}
              {!showInput && (
                <Button
                  style={{ margin: '5px' }}
                  variant="surface"
                  onClick={() => {
                    setShowInput(true);
                  }}
                >
                  add card
                </Button>
              )}
            </Flex>{' '}
          </div>
        )}
      </Draggable>
      <TaskModal
        card={card}
        isExpandedCard={isExpandedCard}
        setIsExpandedCard={setIsExpandedCard}
        date={date}
        onDateUpdate={handleDate}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        onAssignUser={handleAssignUser}
        activeMarkIds={activeMarkIds}
        onToggleMark={handleToggleMark}
        priority={priority}
        setPriority={setPriority}
        onPriorityUpdate={handlePriorityUpdate}
      />
    </div>
  );
}
