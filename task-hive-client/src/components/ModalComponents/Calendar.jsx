import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/lara-dark-blue/theme.css';
import Button from '../ButtonComponent/Button';
function CalendarComponent({ date, setDate, setActivePanel }) {
  console.log(date);
  return (
    <div className="absolute top-10 right-72 h-80 w-96 bg-gray-500">
      <div>Term</div>
      <div className="flex flex-col items-start border border-amber-800 w-full">
        <div>
          <p>Select end term</p>
          <div className="p-calendar">
            <Calendar
              value={date}
              onChange={e => setDate(e.value)}
              dateFormat="dd/mm/yy"
              className="p-inputtext h-8"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start items-start border border-amber-200">
        <div className="w-full flex flex-row justify-center gap-1 border border-emerald-300 ">
          <Button onClick={() => setActivePanel(null)}>Save</Button>
          <Button onClick={() => setActivePanel(null)}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}

export default CalendarComponent;
