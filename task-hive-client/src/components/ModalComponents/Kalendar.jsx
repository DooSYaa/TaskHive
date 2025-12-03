import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Typography } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import Button from '../ButtonComponent/Button';
function Kalendar({ selectedDate, setSelectedDate, setActivePanel }) {
  return (
    <div className="absolute top-10 right-72 bg-stone-400">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Typography />
        <DateCalendar
          value={selectedDate}
          onChange={setSelectedDate}
          slotProps={{
            calendarHeader: { sx: { color: 'white' } },
            day: {
              sx: {
                color: 'white',
              },
            },
            leftArrowIcon: { sx: { color: 'white' } },
            rightArrowIcon: { sx: { color: 'white' } },
          }}
          slots={{}}
        />
      </LocalizationProvider>
      <div className="flex flex-col justify-start items-start border border-amber-200">
        <p>Term</p>
        <div className="w-full flex flex-col gap-5 flex-1 border border-purple-400">
          <input
            type="text"
            value={selectedDate ? selectedDate.format('DD/MM/YYYY') : ''}
            onChange={date => setSelectedDate(date)}
            className="text-center border border-indigo-400 w-[33%]"
          />
          <div className="flex flex-col gap-1 border border-emerald-300 ">
            <Button onClick={() => setActivePanel(null)}>Save</Button>
            <Button onClick={() => setActivePanel(null)}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kalendar;
