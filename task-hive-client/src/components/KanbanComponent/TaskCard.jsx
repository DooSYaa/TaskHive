import { Draggable } from '@hello-pangea/dnd';
export default function TaskCard({ card, index, onClick }) {
  const priorityColors = ['#22c55e', '#eab308', '#ef4444', '#000000'];
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="main-kanban-card"
          style={{
            color: 'black',
            userSelect: 'none',
            padding: '8px',
            marginBottom: '8px',
            background: snapshot.isDragging ? '#E3E3E3' : '#fff',
            borderRadius: '6px',
            boxShadow: snapshot.isDragging
              ? '0 4px 8px rgba(0,0,0,0.2)'
              : '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'transform 0.15s ease, background 0.2s ease',
            ...provided.draggableProps.style,
          }}
          onClick={onClick}
        >
          <div className="flex justify-end h-auto">
            <div
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: priorityColors[card.priority || 0],
                margin: '3px',
              }}
            ></div>
          </div>
          <div className="flex">
            {card.marks?.map((mark, index) => (
              <div
                key={mark.id || index}
                style={{
                  borderBottom: '2px solid black',
                  backgroundColor: mark.hexColor,
                  height: '15px',
                  width: '30px',
                }}
              ></div>
            ))}
          </div>
          <h4 className="border">{card.title}</h4>
          <div className="flex justify-between">
            <div>
              {card.assignedUser && (
                <div className="h-5">{card.assignedUser.userName}</div>
              )}
            </div>
            <div>
              {card.dueDate &&
                new Date(card.dueDate).toLocaleDateString('pl-PL')}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
