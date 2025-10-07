

export default function TaskCard({card}) {

    return (
        <div className="task-card" draggable={true}>
            <div>
                <p>{card.title}</p>
            </div>
        </div>
    );
}