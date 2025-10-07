import './dropArea.css';
import {useState} from "react";

export default function DropArea() {
    const [showDrop, setShowDrop] = useState(false);
    return (
        <div
            className={showDrop ? "drop-area" : "hide-drop"}
            draggable={true}
            onDragEnter={() => setShowDrop(true)}
            onDragLeave={() => setShowDrop(false)}
        >
        </div>
    )
}