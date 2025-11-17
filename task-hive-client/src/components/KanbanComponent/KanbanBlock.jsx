import Button from '../ButtonComponent/Button.jsx';
import TaskCard from './TaskCard.jsx';
import { useState, useEffect } from 'react';
import KanbanInput from './KanbanInput.jsx';
import { createPortal } from 'react-dom';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useParams } from 'react-router-dom';

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
  const [isExpandedCardMenu, setIsExpandedCardMenu] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const handleCardCreatedLocal = newCard => {
    onCardCreated(newCard);
    setShowInput(false);
  };
  return (
    <div>
      <Draggable draggableId={column.id} index={index}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="main-kanban-column"
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
        <div className="border border-b-emerald-600 w-max">
          <h2 className="modal-title">{card ? card.title : null}</h2>
          <textarea className="modal-textarea" name="" id=""></textarea>
        </div>
        <div className="modal-actions border border-amber-400">
          <button
            className="modal-btn primary"
            onClick={() => {
              setIsExpandedCard(false);
              setCard(null);
            }}
          >
            Сохранить
          </button>
          <button
            className="modal-btn secondary"
            onClick={() => setIsExpandedCard(false)}
          >
            Отмена
          </button>
        </div>
      </Modal>
    </div>
  );
}
