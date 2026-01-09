import reactCSS from 'reactcss';
import Button from '../ButtonComponent/Button';
import { ChromePicker } from 'react-color';
import { useEffect, useState } from 'react';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import EditIcon from '../../assets/EditIcon';
import TrashIcon from '../../assets/TrashIcon';
import MinusIcon from '../../assets/MinusIcon';
import PlusIcon from '../../assets/PlusIcon';
import CloseIcon from '../../assets/CloseIcon';
import AcceptIcon from '../../assets/AcceptIcon';
import { useAuth } from '../Context/AuthContext';

function Mark({
  setActivePanel,
  activeMarksIds = [],
  onToggleMark,
  groupId,
  kanbanId,
  cardId,
}) {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newMarkName, setNewMarkName] = useState('');
  const [marks, setMarks] = useState([]);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState({
    r: '241',
    g: '112',
    b: '19',
    a: '1',
  });
  const [currentHex, setCurrentHex] = useState('#F17013');
  const fetchMarks = async () => {
    const response = await fetch(
      `http://localhost:5292/api/Kanban/GetMarks?GroupId=${groupId}&KanbanId=${kanbanId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      },
    );
    if (!response.ok) throw new Error(`Error loading marks ${response.status}`);
    const data = await response.json();
    setMarks(data);
  };
  useEffect(() => {
    fetchMarks();
  }, [groupId, kanbanId, user]);
  const handleCreateTaskMark = async () => {
    const response = await fetch(
      'http://localhost:5292/api/Kanban/CreateTaskMark',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          markName: newMarkName,
          hexColor: currentHex,
          groupId: groupId,
          kanbanId: kanbanId,
        }),
      },
    );
    if (!response.ok)
      throw new Error(`Error creating new mark: ${response.status}`);
    const data = await response.json();
    setMarks(prev => [...prev, data]);
    setNewMarkName('');
    setIsCreating(false);
    setDisplayColorPicker(false);
  };
  const handleUpdateTaskMarks = async (markId, action) => {
    if (action === 'update') {
      const response = await fetch(
        'http://localhost:5292/api/Kanban/UpdateTaskMarks',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            groupId: groupId,
            kanbanId: kanbanId,
            cardId: cardId,
            markId: markId,
          }),
        },
      );
      if (!response.ok)
        throw new Error(`Error updating marks: ${await response.text()}`);
      const data = await response.json();
      onToggleMark(data);
    }
    if (action === 'remove') {
      const response = await fetch(
        'http://localhost:5292/api/Kanban/RemoveTaskMarks',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            groupId: groupId,
            kanbanId: kanbanId,
            cardId: cardId,
            markId: markId,
          }),
        },
      );
      if (!response.ok)
        throw new Error(`Error updating marks: ${await response.text()}`);
      const data = await response.json();
      onToggleMark(data);
    }
  };

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };
  const handleClose = () => {
    setDisplayColorPicker(false);
  };
  const handleChange = newColor => {
    setColor(newColor.rgb);
    setCurrentHex(newColor.hex);
  };
  const styles = reactCSS({
    default: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
        marginTop: '30px',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });
  return (
    <div className="card absolute top-10 right-56 border w-80 bg-white z-50">
      <div className=" text-[16px] font-bold">Marks</div>
      <div className="flex flex-col gap-0.5 items-center">
        {marks?.map((mark, index) => {
          const isAssigned = (activeMarksIds || []).some(
            activeMark => activeMark.id === mark.id,
          );
          return (
            <div
              key={index}
              className="flex w-full justify-between items-center gap-0.5"
            >
              <div className="w-[10%] flex justify-center items-center">
                <Button
                  variant="action"
                  onClick={() => {
                    isAssigned
                      ? handleUpdateTaskMarks(mark.id, 'remove')
                      : handleUpdateTaskMarks(mark.id, 'update');
                  }}
                >
                  {isAssigned ? <MinusIcon /> : <PlusIcon />}
                </Button>
              </div>
              <div
                className="h-8 w-full flex items-center justify-center rounded-[5px]"
                style={{ backgroundColor: mark.hexColor }}
              >
                {mark.markName}
              </div>
              <div className="flex">
                <Button
                  variant="delete"
                  onClick={() => {
                    setMarks(prev => prev.filter(item => item.id !== mark.id));
                  }}
                >
                  <TrashIcon />
                </Button>
                <Button variant="edit">
                  <EditIcon />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {isCreating ? (
        <div className="w-full" style={{ marginTop: '10px' }}>
          <div className=" flex flex-row justify-around items-end">
            <div className="flex justify-center">
              <div style={styles.swatch} onClick={handleClick}>
                <div style={styles.color} />
              </div>
              {displayColorPicker ? (
                <div style={styles.popover}>
                  <div style={styles.cover} onClick={handleClose} />
                  <ChromePicker color={color} onChange={handleChange} />
                </div>
              ) : null}
            </div>
            <div className="border">
              <input
                type="text"
                placeholder="Mark name..."
                value={newMarkName}
                onChange={e => setNewMarkName(e.target.value)}
              />
            </div>
            <div className="flex justify-center gap-0.5 w-[60px]">
              <Button variant="action" onClick={handleCreateTaskMark}>
                <AcceptIcon />
              </Button>
              <Button
                variant="action"
                onClick={() => {
                  setIsCreating(false);
                  setNewMarkName('');
                }}
              >
                <CloseIcon variant={'rounded'} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="" style={{ marginTop: '10px' }}>
          <Button onClick={() => setIsCreating(true)}>Create mark</Button>
        </div>
      )}

      <Button variant="action" onClick={() => setActivePanel(null)}>
        <CloseIcon variant={'rounded'} />
      </Button>
    </div>
  );
}

export default Mark;
