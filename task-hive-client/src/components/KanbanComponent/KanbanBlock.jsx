import Button from "../ButtonComponent/Button.jsx";
import {useState} from "react";
import TaskCard from "./TaskCard.jsx";

export default function KanbanBlock({value}) {
    const [tasks, setTasks] = useState([]);

    const createTask = () => {
        setTasks([...tasks, { id: Date.now(), text: "" }]);
    };

    return (
        <div className="kanban-block">
            {value}
            {tasks.map((task) => (
                <TaskCard task={task} key={task.id} />
            ))}
            <Button variant={'kanban'} onClick={createTask}>+ add card</Button>
        </div>
    )
}