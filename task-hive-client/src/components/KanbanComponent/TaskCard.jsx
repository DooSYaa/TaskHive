
import {CSS} from '@dnd-kit/utilities';
import { useDraggable } from "@dnd-kit/core";
export default function TaskCard({card}) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: card.id
    })
    const style = {
        transform: CSS.Translate.toString(transform),
        transition: transform ? 'none' : 'transform 200ms ease',
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