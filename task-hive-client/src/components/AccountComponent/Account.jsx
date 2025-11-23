import '@toast-ui/editor/dist/toastui-editor.css';
import ToastEditor from './ToastEditor';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';

export default function Account() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <div className="flex justify-center border border-amber-400">
      <DatePicker
        className="border border-cyan-700"
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        showTimeSelect
        dateFormat={'dd/MM/yyyy HH:mm'}
        timeFormat="HH:mm"
      />
      {/* <ToastEditor /> */}
    </div>
  );
}
