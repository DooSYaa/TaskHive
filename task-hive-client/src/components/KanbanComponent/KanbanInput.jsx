import './kanban.css';
import { useState, useRef } from 'react';
import Button from '../ButtonComponent/Button.jsx';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';

export default function KanbanInput({
  onCancel,
  kanbanColumnId,
  onCardCreated,
  onColumnCreated,
  type,
}) {
  const [title, setTitle] = useState('');
  const textareaRef = useRef(null);
  const { kanbanId } = useParams();
  const { user } = useAuth();
  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };
  const handleCreateCard = async () => {
    try {
      const request = await fetch(
        `http://localhost:5292/api/Kanban/CreateKanbanCard?kanbanTableId=${kanbanId}&kanbanStatusId=${kanbanColumnId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title: title,
            description: '',
          }),
        },
      );
      if (!request.ok) {
        throw new Error('Failed to create Kanban card', request.status);
      }
      const newCard = await request.json();
      console.log(newCard);
      onCardCreated(newCard);
      setTitle('');
    } catch (error) {
      console.error('Error request', error);
    }
  };
  const handleCreateColumn = async () => {
    try {
      const request = await fetch(
        `http://localhost:5292/api/Kanban/CreateCanbanBlock?kanbanTableId=${kanbanId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            kanbanBlockName: title,
          }),
        },
      );
      if (!request.ok) {
        throw new Error('Failed to create Kanban', request.status);
      }
      const newColumn = await request.json();
      console.log(newColumn);
      onColumnCreated(newColumn);
      setTitle('');
    } catch (error) {
      console.error(`Error request ${error}`);
    }
  };
  return (
    <div
      className={
        type === 'card'
          ? 'main-add-card-container'
          : 'main-add-column-container'
      }
    >
      <div className="textarea-container">
        <textarea
          value={title}
          onChange={e => setTitle(e.target.value)}
          ref={textareaRef}
          placeholder={
            type === 'card' ? 'Enter task title...' : 'Enter column name'
          }
          className={
            type === 'card' ? 'add-card-textarea' : 'add-column-textarea'
          }
          onInput={handleInput}
        ></textarea>
        <div className={'add-card-buttons-container'}>
          <Button
            variant={'kanban-input'}
            onClick={type === 'card' ? handleCreateCard : handleCreateColumn}
          >
            Submit
          </Button>
          <Button variant={'kanban-input-cancel'} onClick={onCancel}>
            X
          </Button>
        </div>
      </div>
    </div>
  );
}
