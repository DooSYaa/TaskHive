import './dropArea.css';
import {useState} from "react";

export default function DropArea() {
    const [showDrop, setShowDrop] = useState(false);
    return (
        <div>
            Drop here
        </div>
    )
}