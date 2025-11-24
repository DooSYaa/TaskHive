import '@toast-ui/editor/dist/toastui-editor.css';
import ToastEditor from './ToastEditor';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../Context/AuthContext.jsx';

export default function Account() {
  const { user } = useAuth();
  return (
    <div className="flex justify-center border border-amber-400">
      <p>Hello {user.userName}</p>
    </div>
  );
}
