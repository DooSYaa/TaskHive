import Button from "../ButtonComponent/Button.jsx";


export default function KanbanBlock({value}) {

    return (
        <div className="kanban-block">
            {value}
            <Button variant={'kanban'}>+ add card</Button>
        </div>
    )
}