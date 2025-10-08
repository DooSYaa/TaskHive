import Button from "../ButtonComponent/Button.jsx";
import TaskCard from "./TaskCard.jsx";
import {useState, useEffect, Fragment} from "react";
import KanbanInput from "./KanbanInput.jsx";
import DropArea from "../DragAreaComponent/DropArea.jsx";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function KanbanBlock({status}) {
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
        <div className="kanban-block" draggable={true}>
            {status.statusName}
                <div className="kanban-block-list">
                    <div className="kanban-block-list-container">
                        <SortableContext
                            id={status.id}
                            items={cards.map((c) => c.id)}
                            strategy={verticalListSortingStrategy}
                            >

                        {cards?.map((card) => (
                            <TaskCard card={card} />
                        ))}
                        </SortableContext>
                        {showInput ? (
                            <KanbanInput
                                onCancel={() => setShowInput(false)}
                                kanbanCardId={status.id}
                                onCardCreated={handleCardCreated}
                            />
                        ) : null
                        }
                    </div>
            </div>
            <Button variant={'kanban'} onClick={() => setShowInput(true)}>+ add card</Button>
        </div>
    )
}