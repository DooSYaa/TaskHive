import './workingSpace.css';
import {useParams} from "react-router-dom";
import {useAuth} from "../Context/AuthContext.jsx";
import {useEffect, useState} from "react";
import Button from "../ButtonComponent/Button.jsx";
import GroupModal from "../GroupComponent/GroupModal.jsx";

export default function WorkingSpace() {
    const {groupId} = useParams();
    const {user} = useAuth();
    const [kanbanTables, setkanbanTables] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [KanbanTableName, setKanbanTableName] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:5292/api/Kanban/GetKanbanTables?groupId=${groupId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Kanban', response.status);
            }
            const data = await response.json();
            console.log(data);
            setkanbanTables(data);
        }
        fetchData();
    }, [])

    return (
        <>
            <div className="workingSpace">
                <h1>Working Space</h1>
                <div className='createKanbanContainer'>
                    <Button variant={'group'} onClick={() => setShowModal(true)}>Create kanban</Button>
                </div>
                {kanbanTables ? (kanbanTables.map((kanban) => (
                    <div className='kanbanTablesList' key={kanban.id}>
                        {kanban.kanbanTableName}
                    </div>
                ))) : (null)}
            </div>

            {showModal && (
                <GroupModal
                    groupName={KanbanTableName}
                    setGroupName={setKanbanTableName}
                    setShowModal={setShowModal}
                    handleSubmit={handleSubmit}
                />
            )}
        </>
    )
}