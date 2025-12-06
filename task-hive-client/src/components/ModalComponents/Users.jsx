import { useState } from 'react';
import { Mention } from 'primereact/mention';
import Button from '../ButtonComponent/Button.jsx';
import { AutoComplete } from 'primereact/autocomplete';
import 'primereact/resources/themes/lara-dark-blue/theme.css';
import 'primereact/resources/primereact.min.css';

function Users({ setActivePanel }) {
  const [value, setValue] = useState('');
  const [customers, setCustomers] = useState([
    'DooSyaa',
    'eurosting73',
    'rozmarin41',
    'BonnZaiiTree',
    'BonnZaiiTwo',
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
      <div className="p-autocomplete-items">
        <span className="p-autocomplete-item">{suggestion}</span>
      </div>
    );
  };
  return (
    <div className="w-72 flex flex-col gap-6 absolute top-10 right-48 border border-amber-300 rounded-[15px]">
      <div className="border border-sky-500">
        <h3>Participants</h3>
      </div>
      <div className="">
        <AutoComplete
          value={value}
          suggestions={suggestions}
          completeMethod={search}
          onChange={e => setValue(e.value)}
          placeholder="Enter the nickname"
          itemTemplate={itemTemplate}
          dropdown
          panelClassName="w-72 shadow-lg border border-gray-300 rounded-md mt-1"
          className="w-full"
        />
      </div>
      <div>
        <Button onClick={() => setActivePanel(null)}>Close</Button>
      </div>
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
