import './kanban.css';
import KanbanBlock from "./KanbanBlock.jsx";


export default function Kanban()
{
    return (
        <div className="kanban">
            <KanbanBlock value="to do" />
            <KanbanBlock value="doing" />
            <KanbanBlock  value='done'/>
        </div>
    )
}