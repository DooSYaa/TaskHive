import './kanban.css';
import KanbanBlock from "./KanbanBlock.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../Context/AuthContext.jsx";

import {DndContext} from '@dnd-kit/core';

export default function Kanban()
{
    const [activeId, setActiveId] = useState(null);
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
   
    
    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
        console.log("Drag started:", active.id);
    }
    function handleDragEnd(event) {
        const { active, over } = event;

        if (!over) return;

        console.log('active ' + active.id)
        console.log('over ' + over.id)
        console.log(kanbanStatuses)
        const sourceColumn = findCard(kanbanStatuses, active.id);
        const destinationColumn = over.id

        console.log(`source ${sourceColumn}\ndestination ${destinationColumn}`)
        if(sourceColumn === destinationColumn) return;

        setKanbanStatuses(prev => {
            const newBoard = {...prev};
            console.log('qwer', newBoard[0]);

            // const cardToMove = newBoard[sourceColumn].find(c => c.id === active.id);
            // console.log('card to move', cardToMove);
            // newBoard[sourceColumn] = newBoard[sourceColumn].filter(c => c.id !== active.id);
            // newBoard[destinationColumn] = [...newBoard[destinationColumn], cardToMove];
            // return newBoard;
        })
    }

    const findCard = (board, cardId) => {
        for(const column of board) {
            const card = column.cards.find(c => c.id === cardId);
            if (card) return column.id;
        }
        return null;
    }

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="kanban">
                {kanbanStatuses.length > 0 ? (
                    kanbanStatuses.map((status) => (
                        <KanbanBlock
                        key={status.position}
                        status={status}
                        />
                    ))
                ): null}
            </div>
        </DndContext>
    );
}