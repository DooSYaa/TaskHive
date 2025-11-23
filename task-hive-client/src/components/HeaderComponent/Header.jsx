import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
import HomeIcon from '../../assets/HomeIcon.jsx';
import UserIcon from '../../assets/UserIcon.jsx';
import ChatIcon from '../../assets/ChatIcon.jsx';
import './header.css';
import FriendsIcon from '../../assets/FriendsIcon.jsx';
import Button from '../ButtonComponent/Button.jsx';
import { useState, useRef, useEffect } from 'react';
import AccountDropDown from '../AccountComponent/AccountDropDown.jsx';
import MenuIcon from '../../assets/MenuIcon.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  function handleLogout() {
    try {
      logout();
      window.location.href = '/';
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <header className="header-component">
      {user ? (
        <div className="header-main">
          <nav className="header-nav">
            <div className="header-logo">
              <Link className="nav-link" to="/">
                <h2>TaskHive</h2>
              </Link>
            </div>
            <div className="nav-menu">
              <Link className="nav-link" to="/">
                <HomeIcon />
              </Link>
              <Link className="nav-link" to="/friends">
                <FriendsIcon />
              </Link>
              <Link className="nav-link" to="/chat">
                <ChatIcon />
              </Link>
              <Link className="nav-link" to="/group">
                Group
              </Link>
            </div>
          </nav>
          <nav className="header-account" ref={menuRef}>
            <Button onClick={() => setOpen(!open)}>
              <UserIcon />
            </Button>
            <Button onClick={() => setOpen(!open)}>
              <MenuIcon />
            </Button>
            {open && (
              <AccountDropDown handleLogout={handleLogout}>
                <div className="userName-dropdown">
                  <p>{user.userName}</p>
                  <p>{user.email}</p>
                </div>
                <Link className="nav-link" to={'/user'}>
                  Profile
                </Link>
                <p>Settings</p>
                <Link className="nav-link" to="#" onClick={handleLogout}>
                  Logout
                </Link>
              </AccountDropDown>
            )}
          </nav>
        </div>
      ) : (
        <div className="header-main">
          <nav className="header-nav">
            <div className="header-logo">
              <Link className="nav-link" to="/">
                <h2>TaskHive</h2>
              </Link>
            </div>
            <div className="nav-menu">
              <Link className="nav-link" to="/">
                <HomeIcon />
              </Link>
            </div>
          </nav>
          <nav className="header-account">
            <Link className="nav-link" to="/login">
              Sign In
            </Link>
            <Link className="nav-link" to="/registration">
              Registration
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
