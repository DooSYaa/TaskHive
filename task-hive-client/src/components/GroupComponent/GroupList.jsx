import { useEffect, useState } from 'react';

export default function GroupList({ user }) {
  const [groupData, setGroupData] = useState(null);

  const fetchGroups = async () => {
    try {
      const response = await fetch(
        'http://localhost:5292/api/Group/getMyGroups',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        },
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setGroupData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user.token]);

  return { groupData, fetchGroups };
}
