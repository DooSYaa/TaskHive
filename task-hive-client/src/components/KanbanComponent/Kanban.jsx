import './kanban.css';
import KanbanBlock from "./KanbanBlock.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../Context/AuthContext.jsx";

import {DndContext, DragOverlay} from '@dnd-kit/core';
import TaskCard from './TaskCard.jsx';

export default function Kanban()
{
    const {kanbanId} = useParams();
    const [kanbanStatuses, setKanbanStatuses] = useState([]);
    const {user} = useAuth();
    const [activeCard, setActiveCard] = useState(null);
    useEffect(() =>  {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:5292/api/Kanban/GetCurrentKanbanTable?kanbanId=${kanbanId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            });
            if(!response.ok) {
                throw new Error("Kanban not found.", response.status);
            }
            const data = await response.json();
            setKanbanStatuses(data.statuses
                .sort((a, b) => a.position - b.position));
        }
        fetchData()
    }, [user.token, kanbanId]);
    const handleUpdateCardPosition = async (sourceColumn, destinationColumn, cardId) => {
        const request = await fetch('http://localhost:5292/api/Kanban/MoveCard', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                "sourceKanbanBlockId": sourceColumn,
                "targetKanbanBlockId": destinationColumn,
                "kanbanCardId": cardId
            })
        });
        if(!request.ok)
            throw new Error(request.status);
    }
    const findBoard = (board, cardId) => {
            for(const column of board) {
                const card = column.cards.find(c => c.id === cardId);
                if (card) return column.id;
            }
            return null;
    }
    function handleDragEnd(event) {
        const { active, over } = event;
        setActiveCard(null);

        if (!over) return;

        const sourceColumn = findBoard(kanbanStatuses, active.id);
        const destinationColumn = over.id

        if(sourceColumn === destinationColumn) return;
        const currentTable = kanbanStatuses.find(x => x.id === sourceColumn);
        const cardsId = currentTable.cards.find(x => x.id === active.id); 
        console.log("Cards: ");
        console.log(cardsId);        
        setKanbanStatuses(prev =>
            prev.map(table => {
                if (table.id === sourceColumn) {
                return {
                    ...table,
                    cards: table.cards.filter(card => card.id !== cardsId.id),
                };
                }
                if (table.id === destinationColumn) {
                return {
                    ...table,
                    cards: [...table.cards, cardsId],
                };
                }
                return table;
            })
            );
            handleUpdateCardPosition(sourceColumn, destinationColumn, active.id);
        }
        const handleCardCreated = (newCard, statusId) => {
        setKanbanStatuses(prev =>
            prev.map(status => {
                if (status.id === statusId) {
                    return { ...status, cards: [...status.cards, newCard] };
                }
                return status;
            })
        );
    };
    const handleDragStart = (event) => {
        const { active } = event;
        const cardId = active.id;

        // Находим карточку, которую начинаем тянуть
        for (const column of kanbanStatuses) {
            const found = column.cards.find((c) => c.id === cardId);
            if (found) {
                setActiveCard(found);
                return;
            }
        }
    };
    const handleDragCancel = () => {
        setActiveCard(null);
    };
        return (
            <DndContext
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                onDragCancel={handleDragCancel}
            >
                <div className="kanban">
                    {kanbanStatuses.length > 0 ? (
                        kanbanStatuses.map((status) => (
                            <KanbanBlock
                            key={status.position}
                            status={status}
                            onCardCreated={handleCardCreated}
                            />
                        ))
                    ): null}
                </div>

                <DragOverlay>
                    {activeCard ? (
                        <TaskCard card={activeCard} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        );
}
