import Button from '../ButtonComponent/Button.jsx';
import TaskCard from './TaskCard.jsx';
import KanbanInput from './KanbanInput.jsx';
// import DatePicker from 'react-datepicker';
import { DatePicker, StaticDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import ToastEditor from '../AccountComponent/ToastEditor.jsx';
import { Dayjs } from 'dayjs';
import { Typography } from '@mui/material';
function Modal({ isExpandedCard, onClose, children }) {
  useEffect(() => {
    const handleKey = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!isExpandedCard) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
export default function KanbanBlock({ column, index, onCardCreated }) {
  const [showInput, setShowInput] = useState(false);
  const [isExpandedCard, setIsExpandedCard] = useState(false);
  const [card, setCard] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const handleCardCreatedLocal = newCard => {
    onCardCreated(newCard);
    setShowInput(false);
  };
  const theme = createTheme({
    palette: {
      primary: {
        light: '#000',
        main: '#000',
        dark: '#000',
        contrastText: '#fff',
      },
      secondary: {
        light: '#fff',
        main: '#fff',
        dark: '#fff',
        contrastText: '#fff',
      },
    },
  });
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
                : '1px dashed #cfffe2',
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
                {(provided, snapshot) => (
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
        isExpandedCard={isExpandedCard}
        onClose={() => setIsExpandedCard(false)}
      >
        <div className="flex flex-col flex-1 justify-between w-max border border-cyan-500">
          <div className="flex flex-col justify-center w-[80%] border border-amber-600">
            <h2 className="modal-title">{card ? card.title : null}</h2>
          </div>
          <div className="relative flex gap-3 text-center justify-center border border-amber-200">
            <Button onClick={() => setOpen(!open)}>Select date</Button>
            <Button>Add user</Button>
            <Button>CheckList</Button>
            <Button>abc</Button>
            <Button>zxc</Button>
            {open && (
              <div className="absolute top-10 right-52 bg-emerald-400">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Typography />
                  <DateCalendar
                    value={selectedDate}
                    onChange={setSelectedDate}
                    slotProps={{
                      calendarHeader: { sx: { color: 'white' } },
                      day: {
                        sx: {
                          color: 'white',
                        },
                      },
                      leftArrowIcon: { sx: { color: 'white' } },
                      rightArrowIcon: { sx: { color: 'white' } },
                    }}
                    slots={{}}
                  />
                </LocalizationProvider>
                <input
                  type="text"
                  value={selectedDate ? selectedDate.format('DD/MM/YYYY') : ''}
                  onChange={date => setSelectedDate(date)}
                />
                <p>{selectedDate ? selectedDate.format('DD/MM/YYYY') : ''}</p>
                <Button onClick={() => setOpen(!open)}>Close</Button>
              </div>
            )}
          </div>
          <div>
            <h6 className="">Description</h6>
            {/* <div className="">
              <ToastEditor />
            </div> */}
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
            <button
              className="modal-btn secondary"
              onClick={() => setIsExpandedCard(false)}
            >
              Cancel
            </button>
          </div>
        </div>
        <div className="flex flex-1 border border-purple-700">Hello</div>
      </Modal>
    </div>
  );
}
