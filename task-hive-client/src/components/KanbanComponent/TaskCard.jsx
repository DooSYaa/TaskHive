

export default function TaskCard({task}) {
    return (
        <div className="task-card">
            <input type="text" defaultValue={task.text} />
            <div>
                <button>Save</button>
                <button>X</button>
            </div>
        </div>
    );
}