import './home.css';
import ChatIcon from '../../assets/ChatIcon.jsx';
import FriendsIcon from '../../assets/FriendsIcon.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
import { useState, useEffect } from 'react';

function Home() {
  const [groupData, setGroupData] = useState(null);
  const {user} = useAuth();
  const fetchData = async () => {
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
    if (!response.ok) {
      throw new Error(`Error occurred: ${response.status}`);
    }
    const data = await response.json();
    setGroupData(data);
  };

  useEffect(() => {
      fetchData();
    }, []);

  return (
    <div className='home-page'>
      <div className='main'>
        <div className='main-groups'>
          Your groups
          <div className='group-list'>

          {groupData
          ? groupData.map(group => (
            <Link
            className="group-block-name"
            to={`/group/${group.id}`}
            key={group.id}
            >
                <div className="group-block">
                  <h2>{group.name}</h2>
                </div>
              </Link>
            ))
            : null}
            </div>
        </div>
        <div className='main-tables'>
          your tables
        </div>
      </div>
      <div className='menu'>
          <Link className='menu-items' to="/friends">
            <>
              <FriendsIcon />
              <p>
                Friends 
              </p>
            </>
          </Link>
          <Link className='menu-items' to="/chat">
            <>
              <ChatIcon />
              <p>
                Chat 
                </p>
            </>
          </Link>
      </div>
    </div>
  );
}

export default Home;
