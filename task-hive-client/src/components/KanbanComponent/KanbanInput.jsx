import './kanban.css';
import {useState, useRef} from "react";
import Button from "../ButtonComponent/Button.jsx";


export default function KanbanInput({onCancel}) {
    const [title, setTitle] = useState("");
    const textareaRef = useRef(null);

    const handleInput = () => {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }
    return (
        <div className="kanban-input-block">
            <textarea
                ref={textareaRef}
                placeholder="Enter task title..."
                className="kanban-input__input"
                onInput={handleInput}
            ></textarea>
            <div className={'kanban-input-buttons-container'}>
                <Button variant={'kanban-input'}>Submit</Button>
                <Button variant={'kanban-input-cancel'} onClick={onCancel}>X</Button>
            </div>
        </div>
    )
}