import Button from "../ButtonComponent/Button.jsx";
import TaskCard from "./TaskCard.jsx";
import {useState, useEffect, Fragment} from "react";
import KanbanInput from "./KanbanInput.jsx";
import DropArea from "../DragAreaComponent/DropArea.jsx";

import { useDroppable } from "@dnd-kit/core";

export default function KanbanBlock({status}) {
    const {setNodeRef} = useDroppable({
        id: status.id
    });
    const [showInput, setShowInput] = useState(false);
    const [cards, setCards] = useState(status.cards || []);
    const handleCardCreated = (newCard) => {
        setCards((prev) => [...prev, newCard]);
        setShowInput(false);
    };
    useEffect(() => {
        setCards(status.cards || []);
    }, [status.cards]);
    return (
        <div className="kanban-block">
        {/* <div className="kanban-block-list"> */}
            {status.statusName}
            <div
                ref={setNodeRef} 
                className="kanban-block-list-container">
                    {cards?.map((card) => (
                        <TaskCard key={card.id} card={card} />
                    ))}
                    {showInput ? (
                        <KanbanInput
                            onCancel={() => setShowInput(false)}
                            kanbanCardId={status.id}
                            onCardCreated={handleCardCreated}
                        />
                    ) : null
                }
                <Button variant={'kanban'} onClick={() => setShowInput(true)}>+ add card</Button>
            </div>
            {/* </div> */}
        </div>
    )
}
