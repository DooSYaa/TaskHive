import Button from '../ButtonComponent/Button.jsx';
import TaskCard from './TaskCard.jsx';
import KanbanInput from './KanbanInput.jsx';
import Users from '../ModalComponents/Users.jsx';
import CalendarComponent from '../ModalComponents/Calendar.jsx';
import CalendarIcon from '../../assets/CalendarIcon.jsx';
import AddUserIcon from '../../assets/AddUserIcon.jsx';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Mark from '../ModalComponents/Mark.jsx';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import { useAuth } from '../Context/AuthContext.jsx';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import DescriptionEditor from '../ModalComponents/DescriptionEditor.jsx';
import Priority from '../ModalComponents/Priority.jsx';
function Modal({ isExpandedCard, setIsExpandedCard, onClose, children }) {
  useEffect(() => {
    const handleKey = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleOverlayClick = e => {
    // Если клик был именно по overlay (а не по вложенному .modal-content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  if (!isExpandedCard) return null;

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className=" flex flex-col w-[80%] rounded-2xl bg-white">
        <div className="flex justify-end items-center modal-header rounded-t-2xl h-12">
          <Button onClick={() => setIsExpandedCard(false)}>x</Button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
export default function KanbanBlock({ column, index, onCardCreated }) {
  const [showInput, setShowInput] = useState(false);
  const [isExpandedCard, setIsExpandedCard] = useState(false);
  const [card, setCard] = useState(null);
  const [activePanel, setActivePanel] = useState(null);
  const [date, setDate] = useState(null);
  const [priority, setPriority] = useState('low');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeMarkIds, setActiveMarkIds] = useState([]);
  console.log(activeMarkIds);
  //SignalR
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const groupId = useRef();
  const latestCardId = useRef();

  const [description, setDescription] = useState();
  const handleToggleMark = markId => {
    setActiveMarkIds(prev => {
      if (prev.includes(markId)) return prev.filter(id => id !== markId);
      else return [...prev, markId];
    });
  };
  useEffect(() => {
    if (!isExpandedCard || !card || !user?.token) {
      return;
    }

    latestCardId.current = card.id;
    const conn = new HubConnectionBuilder()
      .withUrl('http://localhost:5292/hubs/chat', {
        accessTokenFactory: () => user.token,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();
    conn.on('ReceiveComment', (senderName, message) => {
      setMessages(prev => [
        ...prev,
        { message: message, sender: senderName, timestamp: new Date() },
      ]);
    });
    conn
      .start()
      .then(() => {
        console.log('SignalR connected for card:', card.id, user.userName);
        return conn.invoke('Enter', card.id, user.userName);
      })
      .catch(error => console.error('SignalR error:', error));

    setConnection(conn);

    return () => {
      conn
        .stop()
        .then(() => console.log('SignalR disconnected from card:', card.id))
        .catch(() => {});

      setConnection(null);
      setMessages([]);
    };
  }, [isExpandedCard, card, user]);

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
          <div className="relative flex gap-3 text-center justify-center ">
            <Button
              variant="actions"
              onClick={() =>
                setActivePanel(activePanel === 'date' ? null : 'date')
              }
            >
              <div className="flex flex-row gap-1.5">
                <CalendarIcon />
                Select date
              </div>
            </Button>
            <Button
              variant="actions"
              onClick={() =>
                setActivePanel(activePanel === 'users' ? null : 'users')
              }
            >
              <div className="flex flex-row gap-1.5">
                <AddUserIcon />
                Add user
              </div>
            </Button>
            <Button
              variant="actions"
              onClick={() =>
                setActivePanel(activePanel === 'marks' ? null : 'marks')
              }
            >
              Marks
            </Button>
            <Priority
              value={priority}
              onChange={newValue => setPriority(newValue)}
            />
            {activePanel === 'date' && (
              <CalendarComponent
                date={date}
                setDate={setDate}
                setActivePanel={setActivePanel}
              />
            )}
            {activePanel === 'users' && (
              <Users
                setActivePanel={setActivePanel}
                setSelectedUser={setSelectedUser}
              />
            )}
            {activePanel === 'marks' && (
              <Mark
                setActivePanel={setActivePanel}
                onToggleMark={handleToggleMark}
                activeMarksIds={activeMarkIds}
              />
            )}
          </div>
          <div className="flex gap-6 border border-amber-400">
            {date !== null && (
              <div className="border">
                <div className="text-[12px] font-bold">Term</div>
                {date.toLocaleDateString('pl-PL')}
              </div>
            )}
            {selectedUser !== null && (
              <div className="border">
                <div className="text-[12px] font-bold">Member</div>
                {selectedUser.username}
              </div>
            )}
          </div>
          <div>
            <h6 className="">Description</h6>
            <div className="flex justify-center description-container">
              <DescriptionEditor
                onChange={content => setDescription(content)}
              />
            </div>
          </div>
          <div className="modal-actions">
            <button
              className="modal-btn primary"
              onClick={() => {
                setIsExpandedCard(false);
                setCard(null);
              }}
            >
              Save
            </button>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-3 items-center bg-gray-400">
          <div className=" w-full">Coments</div>
          <div className="flex justify-center items-center gap-3 w-full">
            <textarea
              name=""
              id=""
              className="resize-none w-[70%] rounded-[5px] border border-black"
              placeholder="text coment"
              value={message}
              onChange={e => setMessage(e.target.value)}
            ></textarea>
            <Button onClick={sendComment}>Send</Button>
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
