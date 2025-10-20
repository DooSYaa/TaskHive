import './kanban.css';
import {useState, useRef} from "react";
import Button from "../ButtonComponent/Button.jsx";
import {useParams} from "react-router-dom";
import {useAuth} from "../Context/AuthContext.jsx";


export default function KanbanInput({onCancel, kanbanCardId, onCardCreated}) {
    const [title, setTitle] = useState("");
    const textareaRef = useRef(null);
    const {kanbanId} = useParams();
    const {user} = useAuth()
    const handleInput = () => {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }
    const handleSubmit = async () => {
        const request = await fetch(`http://localhost:5292/api/Kanban/CreateKanbanCard?kanbanTableId=${kanbanId}&kanbanStatusId=${kanbanCardId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({
                "title": title,
                "description": ""
            })
        });

        if (!request.ok) {
            throw new Error("Failed to create Kanban", request.status);
        }
        const newCard = await request.json();
        onCardCreated(newCard);
        setTitle("");
    }
    return (
        <div className="kanban-input-block">
            <textarea
                value={title}
                onChange={e => setTitle(e.target.value)}
                ref={textareaRef}
                placeholder="Enter task title..."
                className="kanban-input__input"
                onInput={handleInput}
            ></textarea>
            <div className={'kanban-input-buttons-container'}>
                <Button variant={'kanban-input'} onClick={() => handleSubmit()}>Submit</Button>
                <Button variant={'kanban-input-cancel'} onClick={onCancel}>X</Button>
            </div>
        </div>
    )
}