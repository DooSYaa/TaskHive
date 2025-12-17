import Button from '../ButtonComponent/Button.jsx';

export default function CreateKanbanTable({
  KanbanTableName,
  setKanbanTableName,
  handleSubmit,
  showModal,
  setShowModal,
}) {
  return (
    <>
      {showModal === 'kanban' && (
        <div className="createKanbanTable">
          <div className="createKanbanTableForm">
            <h2>Create new kanban</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter kanban name"
                value={KanbanTableName}
                onChange={e => setKanbanTableName(e.target.value)}
                style={{ width: '100%', marginBottom: '10px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button type="submit">Create</Button>
                <Button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showModal === 'users' && (
        <div className="createKanbanTable">
          <div className="createKanbanTableForm">
            <h2>Add users</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter user name"
                value={KanbanTableName}
                onChange={e => setKanbanTableName(e.target.value)}
                style={{ width: '100%', marginBottom: '10px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button type="submit">Create</Button>
                <Button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
