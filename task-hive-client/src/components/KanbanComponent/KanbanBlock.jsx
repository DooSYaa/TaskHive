import Button from "../ButtonComponent/Button.jsx";
import TaskCard from "./TaskCard.jsx";

export default function KanbanBlock({status}) {


    return (
        <div className="kanban-block">
            {status.statusName}

            <Button variant={'kanban'} >+ add card</Button>
        </div>
    )
}