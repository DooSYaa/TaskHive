import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
export default function TaskCard({ card }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Task",
      card,
    },
  });
  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
    cursor: "grab",
  };
  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className="dragging-task-card">
        <div className="task-card-content">
          <p>{card.title}</p>
        </div>
      </div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="task-card"
    >
      <div className="task-card-content">
        <p>{card.title}</p>
      </div>
    </div>
  );
}
