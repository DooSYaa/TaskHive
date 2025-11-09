import Header from './components/HeaderComponent/Header.jsx';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Registration from './components/RegistrationComponent/Registration.jsx';
import Login from './components/LoginComponent/Login.jsx';
import Home from './components/HomeComponent/Home.jsx';
import Account from './components/AccountComponent/Account.jsx';
import Friend from './components/FriendComponent/Friend.jsx';
import Chat from './components/ChatComponent/Chat.jsx';
import Kanban from './components/KanbanComponent/Kanban.jsx';
import Group from './components/GroupComponent/Group.jsx';
import WorkingSpace from './components/WorkingSpaceComponent/WorkingSpace.jsx';
import WelcomePage from './components/WelcomePageComponent/WelcomePage.jsx';
import { useAuth } from './components/Context/AuthContext.jsx';

export default function App() {
  const { user } = useAuth();
  return (
    <div>
      <Header />
      <Routes>
        {user ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route path="/" element={<WelcomePage />} />
        )}
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<Account />} />
        <Route path="/friends" element={<Friend />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/group" element={<Group />} />
        <Route path="/group/:groupId" element={<WorkingSpace />} />
        <Route path="/:groupId/:kanbanId" element={<Kanban />} />
      </Routes>
    </div>
  );
}
