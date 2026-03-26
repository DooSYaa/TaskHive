import './kanban.css';
import KanbanBlock from './KanbanBlock.jsx';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext.jsx';
import Button from '../ButtonComponent/Button.jsx';
import KanbanInput from './KanbanInput.jsx';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils.js';

export default function Kanban() {
  const { kanbanId } = useParams();
  const [columns, setColumns] = useState([]);
  const [showInput, setShowInput] = useState(null);
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:5292/api/Kanban/GetCurrentKanbanTable?kanbanId=${kanbanId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Kanban not found.', response.status);
      }
      const data = await response.json();
      setColumns(data.statuses || []);
    };
    fetchData();
  }, [user?.token, kanbanId]);
  const handleUpdateCardPosition = async cardToUpdate => {
    try {
      const request = await fetch('http://localhost:5292/api/Kanban/MoveCard', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          sourceKanbanBlockId: cardToUpdate.sourceColumnId,
          targetKanbanBlockId: cardToUpdate.destColumnId,
          kanbanCardId: cardToUpdate.cardId,
          position: cardToUpdate.position,
        }),
      });
      if (!request.ok) throw new Error(request.status);
    } catch (error) {
      console.error('Error request', error);
    }
  };
  const handleUpdateColumnPosition = async columnToMove => {
    try {
      const request = await fetch(
        'http://localhost:5292/api/Kanban/MoveColumn',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            kanbanTableId: columnToMove.kanbanTableId,
            columnId: columnToMove.columnId,
            position: columnToMove.position,
          }),
        },
      );
      if (!request.ok) throw new Error(request.status);
    } catch (error) {
      console.error('Error request', error);
    }
  };
  const handleCardCreated = newCard => {
    setColumns(prev =>
      prev.map(column => {
        if (column.id === newCard.kanbanStatusId) {
          return { ...column, cards: [...column.cards, newCard] };
        }
        return column;
      }),
    );
  };
  const handleCardDeleted = cardId => {
    setColumns(prev =>
      prev.map(column => ({
        ...column,
        cards: column.cards.filter(card => card.id !== cardId),
      })),
    );
  };
  const handleColumnCreated = newColumn => {
    setColumns(prev => [...prev, { ...newColumn, cards: [] }]);
    setShowInput(false);
  };
  function onDragEnd(result) {
    const { draggableId, destination, source, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(columns.map(col => col.id));
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      const reorderedColumns = newColumnOrder
        .map((id, index) => {
          const col = columns.find(c => c.id === id);
          return col ? { ...col, position: index } : null;
        })
        .filter(Boolean);
      setColumns(reorderedColumns);
      const columnToMove = {
        kanbanTableId: kanbanId,
        columnId: draggableId,
        position: destination.index,
      };
      handleUpdateColumnPosition(columnToMove);
      return;
    }
    let movedCard = null;
    if (source.droppableId === destination.droppableId) {
      const column = columns.find(col => col.id === source.droppableId);
      const newCards = Array.from(column.cards);
      [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);
      const updatedCards = newCards.map((card, index) => ({
        ...card,
        position: index,
      }));
      const newColumns = columns.map(col =>
        col.id === column.id ? { ...col, cards: updatedCards } : col,
      );
      setColumns(newColumns);
      const cardToUpdate = {
        sourceColumnId: column.id,
        destColumnId: column.id,
        cardId: movedCard.id,
        position: destination.index,
      };
      handleUpdateCardPosition(cardToUpdate);
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);
    const sourceCards = Array.from(sourceColumn.cards);
    const destCards = Array.from(destColumn.cards);
    [movedCard] = sourceCards.splice(source.index, 1);
    destCards.splice(destination.index, 0, movedCard);

    const updatedSourceCards = sourceCards.map((card, i) => ({
      ...card,
      position: i,
    }));
    const updatedDestCards = destCards.map((card, i) => ({
      ...card,
      position: i,
    }));
    const newColumns = columns.map(col => {
      if (col.id === sourceColumn.id)
        return { ...col, cards: updatedSourceCards };
      if (col.id === destColumn.id) return { ...col, cards: updatedDestCards };
      return col;
    });
    setColumns(newColumns);
    const cardToUpdate = {
      sourceColumnId: sourceColumn.id,
      destColumnId: destColumn.id,
      cardId: movedCard.id,
      position: destination.index,
    };
    handleUpdateCardPosition(cardToUpdate);
  }
  return (
    <div className="y">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {provided => (
            <div
              className="main-kanban"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columns.length > 0
                ? columns.map((col, index) => (
                    <KanbanBlock
                      key={col.id}
                      column={col}
                      index={index}
                      onCardCreated={handleCardCreated}
                      onCardDeleted={handleCardDeleted}
                    />
                  ))
                : null}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="add-column-container">
        {showInput ? (
          <KanbanInput
            onCancel={() => setShowInput(false)}
            onColumnCreated={handleColumnCreated}
          />
        ) : (
          <Button
            variant="add-kanban-column"
            onClick={() => setShowInput(true)}
          >
            Add Column
          </Button>
        )}
      </div>
    </div>
  );
}
