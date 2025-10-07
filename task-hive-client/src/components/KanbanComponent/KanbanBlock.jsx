import Button from "../ButtonComponent/Button.jsx";
import TaskCard from "./TaskCard.jsx";
import {useState, useEffect, Fragment} from "react";
import KanbanInput from "./KanbanInput.jsx";
import DropArea from "../DragAreaComponent/DropArea.jsx";

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
                        <DropArea />
                        {cards?.map((card) => (
                            <Fragment key={card.id}>
                                <TaskCard card={card} />
                                <DropArea />
                            </Fragment>
                        ))}
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