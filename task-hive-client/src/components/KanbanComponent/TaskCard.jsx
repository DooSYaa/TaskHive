import { Draggable } from "@hello-pangea/dnd";
export default function TaskCard({ card, index}) {
  return (
    <Draggable
      draggableId={card.id}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="main-kanban-card"
          style={{
            userSelect: "none",
            padding: "8px",
            marginBottom: "8px",
            background: snapshot.isDragging ? "#ffe58a" : "#fff",
            borderRadius: "6px",
            boxShadow: snapshot.isDragging
              ? "0 4px 8px rgba(0,0,0,0.2)"
              : "0 1px 3px rgba(0,0,0,0.1)",
            transition: "transform 0.15s ease, background 0.2s ease",
            ...provided.draggableProps.style, // 🟢 обязательная строка!
          }}
        >
          <h4>{card.title}</h4>
        </div>
      )}
    </Draggable>
  );
}
