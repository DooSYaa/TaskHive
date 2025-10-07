import Button from "../ButtonComponent/Button.jsx";
import TaskCard from "./TaskCard.jsx";
import {useState} from "react";
import KanbanInput from "./KanbanInput.jsx";

export default function KanbanBlock({status}) {
    const [showInput, setShowInput] = useState(false);
    //const [kanbanCards, setKanbanCards] = useState([]);


    return (
        <div className="kanban-block">
            {status.statusName}
            {status.cards?.map(() => (
                <TaskCard  />
            ))}

            {showInput ? (
                <KanbanInput
                    onCancel={() => setShowInput(false)}
                />
            ) :
                <Button variant={'kanban'} onClick={() => setShowInput(true)}>+ add card</Button>
            }
        </div>
    )
}