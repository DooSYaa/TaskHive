import './kanban.css';
import KanbanBlock from "./KanbanBlock.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../Context/AuthContext.jsx";

import {DndContext, closestCorners} from '@dnd-kit/core';
import {arrayMove} from '@dnd-kit/sortable';


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




    const handleDragEnd = (event) => {
        const {active, over} = event;
        if(!over) return;
    }

   
  
    return (
        <DndContext
            collisionDetection={closestCorners}
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