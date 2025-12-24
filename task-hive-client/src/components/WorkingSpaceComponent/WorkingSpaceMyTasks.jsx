import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';

function WorkingSpaceMyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'http://localhost:5292/api/Kanban/GetMyTasks',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        },
      );
      if (!response.ok) throw new Error('Error fetch data' + response.status);
      const data = await response.json();
      setTasks(data);
    };
    fetchData();
  }, [user?.token]);
  return (
    <div>
      {/*sorting buttons */}
      <div className="border h-20">sorting buttons</div>
      {/*Main task lists */}
      <div className="border h-96">main tasks</div>
    </div>
  );
}

export default WorkingSpaceMyTasks;
