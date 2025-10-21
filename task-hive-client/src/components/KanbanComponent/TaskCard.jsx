
import {CSS} from '@dnd-kit/utilities';
import { useSortable } from "@dnd-kit/sortable";
export default function TaskCard({card}) {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useSortable({
        id: card.id
    })
    const style = {
        transform: CSS.Translate.toString(transform),
        // transition: transform ? 'none' : 'transform 200ms ease',
        visibility: isDragging ? "hidden" : "visible", 
        cursor: 'grab',
    };
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes} 
            className="task-card">
            <div className='task-card-content'>
                <p>{card.title}</p>
            </div>
        </div>
    );
}