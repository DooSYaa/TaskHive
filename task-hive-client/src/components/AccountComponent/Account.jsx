import React, { useState } from 'react';
import { Mention } from 'primereact/mention';
import './account.model.css';

export default function BasicDemo() {
  const [value, setValue] = useState('');
  const [customers, setCustomers] = useState([
    'DooSyaa',
    'eurosting73',
    'rozmarin41',
    'BonnZaiiTree',
    'CraftHunter',
  ]);
  const [suggestions, setSuggestions] = useState([]);

  // const nicname = [
  //   'DooSyaa',
  //   'eurosting73',
  //   'rozmarin41',
  //   'BonnZaiiTree',
  //   'CraftHunter',
  // ];
  const onSearch = event => {
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
          <small
            style={{ fontSize: '.75rem', color: 'var(--text-color-secondary)' }}
          >
            @{suggestion}
          </small>
        </span>
      </div>
    );
  };

  return (
    <div className="card flex justify-content-center ">
      <Mention
        value={value}
        onChange={e => setValue(e.target.value)}
        suggestions={suggestions}
        onSearch={onSearch}
        placeholder="Enter @ the nickname"
        itemTemplate={itemTemplate}
      />
    </div>
  );
}
