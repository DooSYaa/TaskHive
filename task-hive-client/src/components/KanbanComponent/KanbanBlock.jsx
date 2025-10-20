import Button from "../ButtonComponent/Button.jsx";
import TaskCard from "./TaskCard.jsx";
import {useState, useEffect, Fragment} from "react";
import KanbanInput from "./KanbanInput.jsx";

import { useDroppable } from "@dnd-kit/core";



export default function KanbanBlock({status, onCardCreated}) {
    const [showInput, setShowInput] = useState(false);
    const {setNodeRef, isOver} = useDroppable({
        id: status.id
    });
    const handleCardCreatedLocal = (newCard) => {
        onCardCreated(newCard, status.id);
        setShowInput(false);
    };
    return (
        <div 
            className={`kanban-block ${isOver ? "kanban-block-active" : ""}`}
        >
            <div className="kanban-block-header">
                {status.statusName}
            </div>
                <div
                    ref={setNodeRef}
                    className="kanban-block-list-container">
                        {status.cards?.map((card) => (
                            <TaskCard key={card.id} card={card} />
                        ))}
                        {showInput ? (
                            <KanbanInput
                                onCancel={() => setShowInput(false)}
                                kanbanCardId={status.id}
                                onCardCreated={handleCardCreatedLocal}
                            />
                        ) : null
                    }
                </div>
                <div className="kanban-block-button">
                <Button 
                    variant={'kanban'} 
                    onClick={() => setShowInput(true)}
                    >+ add card
                </Button>
            </div>
        </div>
    )
}
