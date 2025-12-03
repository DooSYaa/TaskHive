import { useState } from 'react';
import { Mention } from 'primereact/mention';
import Button from '../ButtonComponent/Button.jsx';
import { AutoComplete } from 'primereact/autocomplete';

function Users({ setActivePanel }) {
  const [value, setValue] = useState('');
  const [customers, setCustomers] = useState([
    'DooSyaa',
    'eurosting73',
    'rozmarin41',
    'BonnZaiiTree',
    'CraftHunter',
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const search = event => {
    //in a real application, make a request to a remote url with the query and return suggestions, for demo we filter at client side
    setTimeout(() => {
      const query = event.query;
      let suggestions;

      if (!query.trim().length) {
        suggestions = [...customers];
      } else {
        suggestions = customers.filter(customer => {
          return customer.toLowerCase().startsWith(query.toLowerCase());
        });
      }

      setSuggestions(suggestions);
    }, 250);
  };

  const itemTemplate = suggestion => {
    return (
      <div className="flex align-items-center bg-emerald-950">
        <span className="flex flex-column ml-2">
          {suggestion}
          {/* <small
            style={{ fontSize: '.75rem', color: 'var(--text-color-secondary)' }}
          >
            @{suggestion}
          </small> */}
        </span>
      </div>
    );
  };
  return (
    <div className="w-72 flex flex-col gap-4 absolute top-10 right-48 border border-amber-300 rounded-[15px]">
      <div className="border border-sky-500">
        <h3>Participants</h3>
      </div>
      <div className="z-20 border border-amber-300">
        <AutoComplete
          value={value}
          suggestions={suggestions}
          completeMethod={search}
          onChange={e => setValue(e.value)}
          placeholder="Enter @ the nickname"
          itemTemplate={itemTemplate}
          dropdown
        />
      </div>
      <Button onClick={() => setActivePanel(null)}>Close</Button>
    </div>
  );
}

export default Users;

{
  /* <Mention
  className="h-5"
  value={value}
  onChange={e => setValue(e.target.value)}
  suggestions={suggestions}
  onSearch={onSearch}
  placeholder="Enter @ the nickname"
  itemTemplate={itemTemplate}
  autoResize
/> */
}
