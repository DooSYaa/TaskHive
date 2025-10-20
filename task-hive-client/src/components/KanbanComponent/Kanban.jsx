import './kanban.css';
import KanbanBlock from "./KanbanBlock.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../Context/AuthContext.jsx";

import {DndContext} from '@dnd-kit/core';

export default function Kanban()
{
    const {kanbanId} = useParams();
    const [kanbanStatuses, setKanbanStatuses] = useState([]);
    const {user} = useAuth();
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
    }, []);
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

        if (!over) return;

        const sourceColumn = findBoard(kanbanStatuses, active.id);
        const destinationColumn = over.id

        if(sourceColumn === destinationColumn) return;
        const currentTable = kanbanStatuses.find(x => x.id === sourceColumn);
        const cardsId = currentTable.cards.find(x => x.id === active.id); 
        
        
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
        return (
            <DndContext
                onDragEnd={handleDragEnd}
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
            </DndContext>
        );
}
