import Button from '../ButtonComponent/Button.jsx';
import TaskCard from './TaskCard.jsx';
import { useState, useEffect } from 'react';
import KanbanInput from './KanbanInput.jsx';
import { createPortal } from 'react-dom';
import { Droppable, Draggable } from '@hello-pangea/dnd';

function Modal({ isExpandedCard, onClose, children }) {
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!isExpandedCard) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // не закрывать при клике внутри
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export default function KanbanBlock({ column, index, onCardCreated }) {
  const [showInput, setShowInput] = useState(false);
  const [isExpandedCard, setIsExpandedCard] = useState(false);
  const [isExpandedCardMenu, setIsExpandedCardMenu] = useState(false);
  const handleCardCreatedLocal = (newCard) => {
    onCardCreated(newCard);
    setShowInput(false);
  };
  return (
    <div>
      <Draggable draggableId={column.id} index={index}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.draggableProps} className="main-kanban-column">
            <div className="x">
              <div {...provided.dragHandleProps} className="kanban-column-title">
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
                        onClick={() => setIsExpandedCard(true)}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              {showInput && (
                <div className="main-add-card-container">
                  <div className="textarea-container">
                    <textarea className="add-card-textarea"></textarea>
                  </div>
                  <div className="add-card-buttons-container">
                    <Button variant="kanban-input">Create</Button>
                    <Button variant="kanban-input-cancel" onClick={() => setShowInput(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
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
      <Modal isExpandedCard={isExpandedCard} onClose={() => setIsExpandedCard(false)}>
        <h2 className="modal-title">Создать карточку</h2>
        <p className="modal-text">Здесь будет форма или описание карточки.</p>
        <div className="modal-actions">
          <button className="modal-btn primary" onClick={() => setIsExpandedCard(false)}>
            Сохранить
          </button>
          <button className="modal-btn secondary" onClick={() => setIsExpandedCard(false)}>
            Отмена
          </button>
        </div>
      </Modal>
    </div>
  );
}
