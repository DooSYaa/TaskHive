import "./kanban.css";
import KanbanBlock from "./KanbanBlock.jsx";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../Context/AuthContext.jsx";
import { createPortal } from "react-dom";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import TaskCard from "./TaskCard.jsx";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

export default function Kanban() {
  const { kanbanId } = useParams();
  const [kanbanBlocks, setKanbanBlocks] = useState([]);
  const [kanbanCards, setKanbanCards] = useState([]);
  const { user } = useAuth();
  const [activeCard, setActiveCard] = useState(null);
  const [activeBlock, setActiveBlock] = useState([]);
  const blocksId = useMemo(
    () => kanbanBlocks.map((blocks) => blocks.id),
    [kanbanBlocks]
  );
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
      setKanbanBlocks(data.statuses || []);
      setKanbanCards(data.cards || []);
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

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveBlock(null);
    setActiveCard(null);
    if (!over) return;

    const activeBlock = active.id;
    const overBlock = over.id;

    if (activeBlock === overBlock) return;

    setKanbanBlocks((blocks) => {
      const activeBlockIndex = blocks.findIndex(
        (block) => block.id === activeBlock
      );
      const overBlockIndex = blocks.findIndex(
        (block) => block.id === overBlock
      );
      return arrayMove(blocks, activeBlockIndex, overBlockIndex);
    });
  }
  const handleCardCreated = (newCard, statusId) => {
    setKanbanBlocks((prev) =>
      prev.map((status) => {
        if (status.id === statusId) {
          return { ...status, cards: [...status.cards, newCard] };
        }
        return status;
      })
    );
  };
  const handleDragStart = (event) => {
    if (event.active.data.current?.type === "Column") {
      setActiveBlock(event.active.data.current?.status);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveCard(event.active.data.current.card);
      return;
    }
  };
  const handleDragCancel = () => {
    setActiveCard(null);
  };
  const handleDragOver = (event) => {
    // Добавлено: обработка onDragOver для улучшения isOver
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === "Task";
    const isOverACard = over.data.current?.type === "Task";

    if (!isActiveACard) return;
    if (isActiveACard && isOverACard) {
      setKanbanCards((cards) => {
        const activeIndex = cards.findIndex((t) => t.id === activeId);
        const overIndex = cards.findIndex((t) => t.id === overId);

        cards[activeIndex].kanbanStatusId = cards[overIndex].kanbanStatusId;

        return arrayMove(cards, activeIndex, overIndex);
      });
    }

    const isOverABlock = over.data.current?.type === "Column";
    if (isActiveACard && isOverABlock) {
      setKanbanCards((cards) => {
        const activeIndex = cards.findIndex((t) => t.id === activeId);

        cards[activeIndex].kanbanStatusId = overId;

        return arrayMove(cards, activeIndex, activeIndex);
      });
    }
  };
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
    >
      <div className="kanban">
        <SortableContext items={blocksId}>
          {kanbanBlocks.length > 0
            ? kanbanBlocks.map((status) => (
                <KanbanBlock
                  key={status.position}
                  status={status}
                  cards={kanbanCards.filter(
                    (card) => card.kanbanStatusId === status.id
                  )}
                  onCardCreated={handleCardCreated}
                />
              ))
            : null}
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay>
          {activeBlock && (
            <KanbanBlock
              status={activeBlock}
              cards={kanbanCards.filter(
                (card) => card.kanbanStatusId === activeBlock.id
              )}
            />
          )}
          {activeCard && <TaskCard card={activeCard} />}
        </DragOverlay>,
        document.body
      )}
      {/* {activeCard && <TaskCard card={activeCard}/>} */}
    </DndContext>
  );
}
