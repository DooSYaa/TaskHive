import React from 'react';
import Button from '../ButtonComponent/Button';

function Mark({ setActivePanel }) {
  return (
    <div className="card absolute top-10 right-56 border border-amber-300">
      Marks
      <Button onClick={() => setActivePanel(null)}>Close</Button>
    </div>
  );
}

export default Mark;
