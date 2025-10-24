import Button from "../ButtonComponent/Button.jsx";
import TaskCard from "./TaskCard.jsx";
import { useState, useMemo } from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import KanbanInput from "./KanbanInput.jsx";
import { CSS } from "@dnd-kit/utilities";

export default function KanbanBlock({ status, cards, onCardCreated }) {
  const [showInput, setShowInput] = useState(false);
  const cardsIds = useMemo(() => {
    return cards.map((card) => card.id);
  }, [cards]);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isOver,
    isDragging,
  } = useSortable({
    id: status.id,
    data: {
      type: "Column",
      status,
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={"dragging-kanban-block"}
      ></div>
    );
  }
  const handleCardCreatedLocal = (newCard) => {
    onCardCreated(newCard);
    setShowInput(false);
  };
  return (
    <div ref={setNodeRef} style={style} className={"kanban-block"}>
      <div {...attributes} {...listeners} className="kanban-block-header">
        {status.statusName}
      </div>
      <div className="kanban-block-list">
        <SortableContext
          id={cardsIds}
          items={cardsIds}
          strategy={verticalListSortingStrategy}
        >
          {cards?.map((card) => (
            <TaskCard key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>
      {showInput ? (
        <KanbanInput
          onCancel={() => setShowInput(false)}
          kanbanCardId={status.id}
          onCardCreated={handleCardCreatedLocal}
        />
      ) : null}
      <div className="kanban-block-button">
        <Button variant={"kanban"} onClick={() => setShowInput(true)}>
          + add card
        </Button>
      </div>
    </div>
  );
}
