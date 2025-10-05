import './kanban.css';
import KanbanBlock from "./KanbanBlock.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../Context/AuthContext.jsx";


export default function Kanban()
{
    const [kanban, setKanban] = useState('null');
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
            setKanban(data.id);
            setKanbanStatuses(data.statuses
                .sort((a, b) => a.position - b.position));
            console.log(data);
        }
        fetchData()
    }, []);
    const {kanbanId} = useParams();
    return (
        <div className="kanban">
            {kanbanStatuses.length > 0 ? (
                kanbanStatuses.map((status) => (
                    <KanbanBlock key={status.position} status={status} />
                ))
            ): null}
        </div>
    )
}