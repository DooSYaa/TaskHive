import React from 'react';
import reactCSS from 'reactcss';
import Button from '../ButtonComponent/Button';

import { Checkbox } from 'primereact/checkbox';

// import { ColorPicker } from 'primereact/colorpicker';
// import { HexColorPicker } from 'react-colorful';
import { ChromePicker } from 'react-color';

import { useState } from 'react';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

function Mark({ setActivePanel, activeMarksIds = [], onToggleMark }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newMarkName, setNewMarkName] = useState('');
  const [marks, setMarks] = useState([
    { id: 1, markName: '', hexColor: '#000000' },
    { id: 2, markName: 'Backend', hexColor: '#123456' },
    { id: 3, markName: 'Frontend', hexColor: '#32a852' },
  ]);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState({
    r: '241',
    g: '112',
    b: '19',
    a: '1',
  });
  const [currentHex, setCurrentHex] = useState('#F17013');
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
  const handleSave = () => {
    const newMark = {
      id: Date.now(), // Генерируем уникальный ID
      markName: newMarkName, // Берем имя из инпута
      hexColor: currentHex, // Берем цвет из пикера
    };
    setMarks(prev => [...prev, newMark]); // Добавляем в массив
    setNewMarkName('');
    setIsCreating(false);
    setDisplayColorPicker(false);
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
      <div className="border border-amber-400 flex flex-col gap-0.5 items-center">
        {marks?.map((mark, index) => {
          const isAssigned = (activeMarksIds || []).includes(mark.id);
          return (
            <div>
              <div
                key={index}
                className="border border-blue-600 flex w-full justify-center items-center gap-0.5"
              >
                <Button
                  className={
                    isAssigned
                      ? '!bg-red-100 !text-red-600'
                      : 'bg-green-100 text-green-600'
                  }
                  onClick={() => onToggleMark(mark.id)}
                >
                  {isAssigned ? '-' : '+'}
                </Button>
                <div
                  className="h-8 w-[60%] flex items-center justify-center"
                  style={{ backgroundColor: mark.hexColor }}
                >
                  {mark.markName}
                </div>
                <Button
                  variant="delete"
                  onClick={() => {
                    setMarks(prev => prev.filter(item => item.id !== mark.id));
                  }}
                >
                  delete
                </Button>
                <Button>Edit</Button>
              </div>
            </div>
          );
        })}
      </div>
      {isCreating ? (
        <div className="w-full">
          <div className="flex justify-center">
            <div className="w-[90%] flex justify-center items-center">
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
            </div>
            <div className="flex justify-center gap-0.5 w-[80px]">
              <Button onClick={handleSave}>A</Button>
              <Button
                onClick={() => {
                  setIsCreating(false);
                  setNewMarkName('');
                }}
              >
                X
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="">
          <Button onClick={() => setIsCreating(true)}>Create mark</Button>
        </div>
      )}

      <Button onClick={() => setActivePanel(null)}>Close</Button>
    </div>
  );
}

export default Mark;
