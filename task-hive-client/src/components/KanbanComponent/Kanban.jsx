import "./kanban.css";
import KanbanBlock from "./KanbanBlock.jsx";
import {DragDropContext, Droppable} from '@hello-pangea/dnd';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext.jsx";

export default function Kanban() {
  const { kanbanId } = useParams();
  const [columns, setColumns] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:5292/api/Kanban/GetCurrentKanbanTable?kanbanId=${kanbanId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Kanban not found.", response.status);
      }
      const data = await response.json();
      setColumns(data.statuses || []);
    };
    fetchData();
  }, [user.token, kanbanId]);
  const handleUpdateCardPosition = async (
    sourceColumn,
    destinationColumn,
    cardId
  ) => {
    try {
      const request = await fetch("http://localhost:5292/api/Kanban/MoveCard", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          sourceKanbanBlockId: sourceColumn,
          targetKanbanBlockId: destinationColumn,
          kanbanCardId: cardId.id,
          position: cardId.position,
        }),
      });
      if (!request.ok) throw new Error(request.status);
    } catch (error) {
      console.error("Error request", error);
    }
  };
 
  const handleCardCreated = (newCard) => {
    setColumns((prev) =>
      prev.map((status) => {
        if (status.id === statusId) {
          return { ...status, cards: [...status.cards, newCard] };
        }
        return status;
      })
    );
  };
  function onDragEnd(result) {
    const {draggableId, destination, source, type} = result;

    if(!destination) return; 

    if(destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if(type === 'column') {
      const newColumnOrder = Array.from(columns.map((col) => col.id));
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      const reorderedColumns = newColumnOrder.map((id, index) => {
      const col = columns.find(c => c.id === id);
        return col ? { ...col, position: index } : null;
      }).filter(Boolean);
      setColumns(reorderedColumns);
      return;
    }
    let movedCard = null;
    if (source.droppableId === destination.droppableId) {
      const column = columns.find((col) => col.id === source.droppableId);
      const newCards = Array.from(column.cards);
      [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);

      const updatedCards = newCards.map((card, index) => ({
        ...card,
        position: index
      }));

      const newColumns = columns.map((col) =>
        col.id === column.id ? { ...col, cards: updatedCards } : col
      );
      setColumns(newColumns);
      return;
    }

    // ⚙️ если карточку перетащили в другую колонку
    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find((col) => col.id === destination.droppableId);

    const sourceCards = Array.from(sourceColumn.cards);
    const destCards = Array.from(destColumn.cards);

    [movedCard] = sourceCards.splice(source.index, 1);
    destCards.splice(destination.index, 0, movedCard);

    const updatedSourceCards = sourceCards.map((card, i) => ({ ...card, position: i }));
    const updatedDestCards = destCards.map((card, i) => ({ ...card, position: i }));

    const newColumns = columns.map(col => {
      if (col.id === sourceColumn.id) return { ...col, cards: updatedSourceCards };
      if (col.id === destColumn.id) return { ...col, cards: updatedDestCards };
      return col;
    });
    setColumns(newColumns);
  }
  return (
      <DragDropContext 
        onDragEnd={onDragEnd}
        >
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div 
              className="main-kanban"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columns.length > 0 ? columns.map((col, index) => (
                <KanbanBlock key={col.id} column={col} index={index}/>
              )) : null}
              {provided.placeholder}
            </div>
            )}
        </Droppable>
      </DragDropContext>
  );
}