import TaskCard from './TaskCard.jsx';
import KanbanInput from './KanbanInput.jsx';
import Users from '../ModalComponents/Users.jsx';
import CalendarComponent from '../ModalComponents/Calendar.jsx';
import { CalendarIcon, Cross1Icon, PersonIcon } from '@radix-ui/react-icons';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Mark from '../ModalComponents/Mark.jsx';
import { useAuth } from '../Context/AuthContext.jsx';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import DescriptionEditor from '../ModalComponents/DescriptionEditor.jsx';
import Priority from '../ModalComponents/Priority.jsx';
import { useParams } from 'react-router-dom';
import { Button, Theme, TextArea, DropdownMenu } from '@radix-ui/themes';
function Modal({ isExpandedCard, setIsExpandedCard, onClose, children }) {
  useEffect(() => {
    const handleKey = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  if (!isExpandedCard) return null;

  return createPortal(
    <Theme accentColor="cyan">
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className=" flex flex-col w-[80%] rounded-2xl bg-white">
          <div className="flex justify-end items-center modal-header rounded-t-2xl h-12">
            <Button variant="surface" onClick={() => setIsExpandedCard(false)}>
              <Cross1Icon />
            </Button>
          </div>
          <div className="modal-content">{children}</div>
        </div>
      </div>
    </Theme>,
    document.body,
  );
}
export default function KanbanBlock({ column, index, onCardCreated }) {
  const [showInput, setShowInput] = useState(false);
  const [isExpandedCard, setIsExpandedCard] = useState(false);
  const [card, setCard] = useState(null);
  const [activePanel, setActivePanel] = useState(null);
  const [date, setDate] = useState(null);
  const [priority, setPriority] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeMarkIds, setActiveMarkIds] = useState([]);
  //SignalR
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { groupId } = useParams();
  const { kanbanId } = useParams();
  const [description, setDescription] = useState(card?.description || '');
  const [isEditing, setIsEditing] = useState(!card?.description);

  const handleSave = newMarkdown => {
    setDescription(newMarkdown);
    setIsEditing(false);
    console.log('sending to server', newMarkdown);
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
  const sendComment = async () => {
    if (!connection || !message.trim() || !card) return;

    try {
      await connection.invoke('SendComment', card.id, user.userName, message);
      console.log('message was sended');
      setMessage('');
    } catch (error) {
      console.error('Error send comment:', error);
    }
  };

  const handleCardCreatedLocal = newCard => {
    onCardCreated(newCard);
    setShowInput(false);
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
            <div className="x">
              <div
                {...provided.dragHandleProps}
                className="kanban-column-title"
              >
                <h2>{column.statusName}</h2>
              </div>
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
              <div>
                <Button
                  variant="kanban"
                  onClick={() => {
                    setShowInput(true);
                  }}
                >
                  add card
                </Button>
              </div>
            </div>
          </div>
        )}
      </Draggable>
      <Modal
        setIsExpandedCard={setIsExpandedCard}
        isExpandedCard={isExpandedCard}
        onClose={() => {
          setIsExpandedCard(false);
          setCard(null);
          setActivePanel(null);
        }}
      >
        <div className="title-container">
          <div className="flex flex-col justify-center w-[80%]">
            <h2 className="modal-title">{card ? card.title : null}</h2>
          </div>
          <div className="relative flex gap-3 text-center justify-center">
            {/* <Button
              variant="actions"
              onClick={() =>
                setActivePanel(activePanel === 'date' ? null : 'date')
              }
            >
              <div className="flex flex-row gap-1.5">
                <CalendarIcon />
                Select date
              </div>
            </Button> */}
            <Button
              variant="soft"
              color="cyan"
              onClick={() =>
                setActivePanel(activePanel === 'date' ? null : 'date')
              }
            >
              <CalendarIcon />
              Select date
            </Button>
            <Button
              color="cyan"
              variant="soft"
              onClick={() =>
                setActivePanel(activePanel === 'users' ? null : 'users')
              }
            >
              <div className="flex flex-row gap-1.5">
                <PersonIcon />
                {/* <AddUserIcon /> */}
                Add user
              </div>
            </Button>
            {/* <Button
              color="cyan"
              variant="soft"
              onClick={() =>
                setActivePanel(activePanel === 'marks' ? null : 'marks')
              }
            >
              Marks
            </Button> */}
            <Mark
              setActivePanel={setActivePanel}
              onToggleMark={handleToggleMark}
              activeMarksIds={activeMarkIds}
              groupId={groupId}
              kanbanId={kanbanId}
              cardId={card?.id}
            />
            <Priority
              priority={priority}
              setPriority={setPriority}
              onPriorityUpdate={handlePriorityUpdate}
              groupId={groupId}
              kanbanId={kanbanId}
              cardId={card ? card.id : null}
            />
            {activePanel === 'date' && (
              <CalendarComponent
                date={date}
                setDate={setDate}
                onDateUpdate={handleDate}
                setActivePanel={setActivePanel}
                groupId={groupId}
                kanbanId={kanbanId}
                cardId={card.id}
              />
            )}
            {activePanel === 'users' && (
              <Users
                setActivePanel={setActivePanel}
                setSelectedUser={setSelectedUser}
                groupId={groupId}
                kanbanId={kanbanId}
                cardId={card.id}
                onAssignUser={handleAssignUser}
              />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div>
              {date !== null && (
                <div
                  className=" flex flex-col gap-2"
                  style={{ padding: '5px' }}
                >
                  <div className="text-[16px] font-bold">Term</div>
                  {new Date(date).toLocaleDateString('pl-PL')}
                </div>
              )}
            </div>
            <div>
              {selectedUser !== null && (
                <div
                  className=" flex flex-col gap-2"
                  style={{ padding: '5px' }}
                >
                  <div className="text-[16px] font-bold">Member</div>
                  {selectedUser.userName}
                </div>
              )}
            </div>
            <div>
              {activeMarkIds?.length !== 0 && (
                <div
                  className=" flex flex-col gap-2"
                  style={{ padding: '5px' }}
                >
                  <div className="text-[16px] font-bold">Marks</div>
                  <div className="flex gap-0.5">
                    {activeMarkIds.map(mark => (
                      <div
                        style={{
                          backgroundColor: mark.hexColor,
                          padding: '4px',
                          borderRadius: '5px',
                        }}
                        key={mark.id}
                      >
                        {mark.markName === '' ? 'No name' : mark.markName}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <h6 className="">Description</h6>
            <div className="flex justify-center description-container">
              {isEditing ? (
                <DescriptionEditor
                  initialValue={description}
                  onChange={content => setDescription(content)}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) : (
                <div
                  onClick={() => setIsEditing(true)}
                  title="click"
                  className="w-full"
                >
                  {description ? (
                    <div className="markdown-content">
                      <ReactMarkdown>{description}</ReactMarkdown>
                    </div>
                  ) : (
                    <span>Add description...</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-3 items-center bg">
          <div className=" w-full">Coments</div>
          <div className="flex justify-center items-center gap-3 w-full">
            {/* <textarea
              name=""
              id=""
              className="resize-none w-[70%] rounded-[5px] border border-black"
              placeholder="text coment"
              value={message}
              onChange={e => setMessage(e.target.value)}
            ></textarea> */}
            <TextArea placeholder="Text comment" size={3} className="w-[70%]" />
            <Button color="cyan" variant="soft" onClick={sendComment}>
              Send
            </Button>
          </div>
          <div className="flex flex-col items-center   w-full h-full">
            {messages.map((msg, index) => (
              <div key={index} className="bg-amber-600 w-[60%]">
                <div className="flex justify-between items-center  ">
                  <strong>{msg.sender}</strong>
                  <sub>{msg.timestamp.toLocaleTimeString()}</sub>
                </div>
                <p>{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
