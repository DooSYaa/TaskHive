import Button from "../ButtonComponent/Button.jsx";
import TaskCard from "./TaskCard.jsx";
import { useState } from "react";
import KanbanInput from "./KanbanInput.jsx";
import { Droppable, Draggable } from "@hello-pangea/dnd";

export default function KanbanBlock({ column, index, onCardCreated }) {
  const [showInput, setShowInput] = useState(false);
  const handleCardCreatedLocal = (newCard) => {
    onCardCreated(newCard);
    setShowInput(false);
  };
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
      <div
        ref={provided.innerRef} 
        {...provided.draggableProps}
        className="main-kanban-column"
      >
        <div className="x">

        <div {...provided.dragHandleProps} className="kanban-column-title">
            <h2>{column.statusName}</h2>
        </div>
        <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div
              ref={provided.innerRef}
              style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
              {...provided.droppableProps}
              className="droppable-kanban-column"
              >
                {column.cards?.map((card, index) => (
                  <TaskCard key={card.id} card={card} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    )}
    </Draggable>
  );
}


