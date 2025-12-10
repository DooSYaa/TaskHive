import './account.model.css';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '../Context/AuthContext';

export default function BasicDemo() {
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
    </div>
  );
}
