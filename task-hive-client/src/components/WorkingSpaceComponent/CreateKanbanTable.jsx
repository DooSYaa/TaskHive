import { useState } from 'react';
import Button from '../ButtonComponent/Button.jsx';

const KANBAN_TEMPLATES = [
  {
    id: 1,
    name: 'Default',
    columns: ['ToDo', 'Doing', 'Done'],
    display: 'ToDo -> Doing -> Done',
  },
  {
    id: 2,
    name: 'Development',
    columns: [
      'Backlog',
      'Ready for Dev',
      'In Progress',
      'Code Review',
      'Testing/QA',
      'Done',
    ],
    display:
      'Backlog -> Ready for Dev -> In Progress -> Code Review -> Testing/QA -> Done',
  },
  {
    id: 3,
    name: 'Getting Things Done',
    columns: ['Inbox', 'Today', 'Next week', 'Waiting for', 'Done'],
    display: 'Inbox -> Today -> Next week -> Waiting for -> Done',
  },
];
export default function CreateKanbanTable({
  KanbanTableName,
  setKanbanTableName,
  handleCreateKanbanTable, // Эта функция должна принимать (name, template)
  showModal,
  setShowModal,
  handleAddUserToGroup,
  friendName,
  setFriendName,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(KANBAN_TEMPLATES[0]);

  return (
    <>
      {showModal === 'kanban' && (
        <div className="createKanbanTable">
          <div className="createKanbanTableForm">
            <h2>Create new kanban</h2>
            <form onSubmit={handleCreateKanbanTable}>
              <input
                type="text"
                placeholder="Enter kanban name"
                value={KanbanTableName}
                onChange={e => setKanbanTableName(e.target.value)}
                style={{ width: '100%', marginBottom: '10px' }}
              />
              <div className="flex flex-col gap-2">
                <div>Template:</div>
                <Button
                  type="button"
                  variant="sorting"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="sort-button"
                  style={{ height: '40px' }}
                >
                  {selectedTemplate.name}
                </Button>
                <div>
                  {isMenuOpen && (
                    <div className="flex flex-col gap-1.5">
                      {KANBAN_TEMPLATES.map(template => (
                        <div
                          key={template.id}
                          className="hover:bg-blue-50 cursor-pointer"
                          style={{ padding: '0 5px 0 5px' }}
                          onClick={() => {
                            (setSelectedTemplate(template),
                              setIsMenuOpen(false));
                          }}
                        >
                          <div className="font-bold">{template.name}</div>
                          <div className="text-[12px]">{template.display}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
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
            <form onSubmit={handleAddUserToGroup}>
              <input
                type="text"
                placeholder="Enter user name"
                value={friendName}
                onChange={e => setFriendName(e.target.value)}
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
