import './account.model.css';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '../Context/AuthContext';
import { ColorPicker } from 'primereact/colorpicker';
import { useState } from 'react';
export default function BasicDemo() {
  const [color, setColor] = useState(null);
  const { user } = useAuth();

  return (
    <div className="flex">
      <div className="border border-black w-72 h-[55rem]"></div>
      <div className="border border-amber-400 w-full">
        {
          <Avatar sx={{ width: '200px', height: '200px', fontSize: '100px' }}>
            D
          </Avatar>
        }
        {user.userName}
      </div>
      <ColorPicker value={color} onChange={e => setColor(e.value)} />
    </div>
  );
}
