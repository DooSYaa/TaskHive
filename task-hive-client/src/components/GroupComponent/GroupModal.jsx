import Button from "../ButtonComponent/Button.jsx";


export default function GroupModal({groupName, setGroupName, setShowModal, handleSubmit}) {
    return (
        <div className="create-group">
            <div className="create-group-form">
                <h2>Create new group</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter group name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        style={{ width: "100%", marginBottom: "10px" }}
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button type="submit">Create</Button>
                        <Button type="button" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}