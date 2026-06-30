import './home.css';
import {api} from "../../utils/util.js";
import ChatIcon from '../../assets/ChatIcon.jsx';
import FriendsIcon from '../../assets/FriendsIcon.jsx';
import TaskWidget from './TaskWidget';
import GroupModal from '../GroupComponent/GroupModal.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
import { useState, useEffect } from 'react';
import { GrTask } from 'react-icons/gr';
import RecentBoards from './RecentBoards.jsx';
import { Flex, Box, Heading, Text, Section, Grid } from '@radix-ui/themes';

function Home() {
  const [groupData, setGroupData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const { user } = useAuth();
  const fetchData = async () => {
    try {
      const res = await api.get('http://localhost:5292/api/groups');
      const data = res.data;
      console.log(data)
      setGroupData(data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch(
      'http://localhost:5292/api/Group/CreateGroup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          groupName: groupName,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`Error occurred: ${response.status}`);
    }
    fetchData();
    setShowModal(false);
  };
  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  return (
    <Flex height={'100vh'} className="home-page" overflow={'hidden'}>
      <Flex
        direction={'column'}
        gap={'4'}
        flexShrink={'0'}
        width={'250px'}
        p={'20px'}
        className="sidebar"
      >
        <Box>
          <Heading as={'h2'} size={'20px'} weight={'bold'} color={'blue'}>
            TaskHive
          </Heading>
        </Box>

        <Link className="menu-item" to="/friends">
          <FriendsIcon />
          <span>Friends</span>
        </Link>

        <Link className="menu-item" to="/chat">
          <ChatIcon />
          <span>Chat</span>
        </Link>

        <Link className="menu-item" to="/myTasks">
          <GrTask />
          <span>MyTasks</span>
        </Link>
        {/* Сюда можно добавить кнопку Settings или Logout */}
      </Flex>

      {/* --- MAIN CONTENT --- */}
      <Box flexGrow={'1'} px={'6'} py={'5'} overflowY={'auto'}>
        <Box mb={'32px'}>
          <Heading as="h1" size={'8'} weight={'bold'} color="gray">
            Hello, {user?.userName}!
          </Heading>
          <Text color="gray">Here is what's happening today.</Text>
        </Box>

        <Section>
          <Heading as={'h2'} size={'6'} weight={'bold'} color="black" mb={'5'}>
            Your Groups
          </Heading>

          <Grid
            columns={'repeat(auto-fill, minmax(260px, 1fr))'}
            gap={'4'}
            mb={'40px'}
          >
            <Flex
              direction={'column'}
              align={'center'}
              justify={'center'}
              height={'160px'}
              className="create-group-card"
              onClick={() => setShowModal(true)}
            >
              <span className="plus-icon">+</span>
              <span className="font-semibold">Create New Group</span>
            </Flex>
            {groupData &&
              groupData.map(group => (
                <Link
                  to={`/group/${group.id}`}
                  key={group.id}
                  className="group-card"
                >
                  <Box>
                    <Heading
                      as={'h3'}
                      size={'5'}
                      weight={'600'}
                      m={'0'}
                      color="black"
                      className="group-name"
                    >
                      {group.name}
                    </Heading>
                  </Box>

                  <Flex align={'center'} gap={'5px'} className="group-footer">
                    <span>Open workspace →</span>
                  </Flex>
                </Link>
              ))}
          </Grid>
        </Section>

        {/* Секция ДОСОК (Заготовка) */}
        <section className="mt-8">
          <h2 className="section-title">Your Tables</h2>
          <RecentBoards />
        </section>
      </Box>
      <Flex direction={'column'} gap={'24px'} width={'450px'}>
        <TaskWidget />
      </Flex>
      {showModal && (
        <GroupModal
          groupName={groupName}
          setGroupName={setGroupName}
          setShowModal={setShowModal}
          handleSubmit={handleSubmit}
        />
      )}
    </Flex>
  );
}

export default Home;
