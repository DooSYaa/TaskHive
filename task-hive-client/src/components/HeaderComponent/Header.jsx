// import { Link } from 'react-router-dom';
// import { useAuth } from '../Context/AuthContext.jsx';
// import HomeIcon from '../../assets/HomeIcon.jsx';
// import UserIcon from '../../assets/UserIcon.jsx';
// import ChatIcon from '../../assets/ChatIcon.jsx';
// import '../AccountComponent/account.model.css';
// import './header.css';
// import FriendsIcon from '../../assets/FriendsIcon.jsx';
// import Button from '../ButtonComponent/Button.jsx';
// import { useState, useRef, useEffect } from 'react';
// import AccountDropDown from '../AccountComponent/AccountDropDown.jsx';
// import MenuIcon from '../../assets/MenuIcon.jsx';

// export default function Header() {
//   const { user, logout } = useAuth();
//   const [open, setOpen] = useState(false);
//   const menuRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = e => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);
//   function handleLogout() {
//     try {
//       logout();
//       window.location.href = '/';
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   return (
//     <header className="header-component">
//       {user ? (
//         <div className="header-main">
//           <nav className="header-nav">
//             <div className="header-logo">
//               <Link className="nav-link" to="/">
//                 <h2>TaskHive</h2>
//               </Link>
//             </div>
//             <div className="nav-menu">
//               <Link className="nav-link" to="/">
//                 <HomeIcon />
//               </Link>
//               <Link className="nav-link" to="/friends">
//                 <FriendsIcon />
//               </Link>
//               <Link className="nav-link" to="/chat">
//                 <ChatIcon />
//               </Link>
//               <Link className="nav-link" to="/group">
//                 Group
//               </Link>
//             </div>
//           </nav>
//           <nav className="header-account" ref={menuRef}>
//             <Button onClick={() => setOpen(!open)}>
//               <UserIcon />
//             </Button>
//             {open && (
//               <AccountDropDown handleLogout={handleLogout}>
//                 <div className="userName-dropdown ">
//                   <p>{user.userName}</p>
//                   <p>{user.email}</p>
//                 </div>
//                 <Link className="nav-link" to={'/user'}>
//                   Profile
//                 </Link>
//                 <p>Settings</p>
//                 <Link className="nav-link" to="#" onClick={handleLogout}>
//                   Logout
//                 </Link>
//               </AccountDropDown>
//             )}
//           </nav>
//         </div>
//       ) : (
//         <div className="header-main">
//           <nav className="header-nav">
//             <div className="header-logo">
//               <Link className="nav-link" to="/">
//                 <h2>TaskHive</h2>
//               </Link>
//             </div>
//             <div className="nav-menu">
//               <Link className="nav-link" to="/">
//                 <HomeIcon />
//               </Link>
//             </div>
//           </nav>
//           <nav className="header-account">
//             <Link className="nav-link" to="/login">
//               Sign In
//             </Link>
//             <Link className="nav-link" to="/registration">
//               Registration
//             </Link>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }
import { Link, useNavigate } from 'react-router-dom'; // Добавил useNavigate
import { useAuth } from '../Context/AuthContext.jsx';
import UserIcon from '../../assets/UserIcon.jsx';
import MenuIcon from '../../assets/MenuIcon.jsx'; // Можно оставить как иконку бургера для мобилок
import '../AccountComponent/account.model.css';
import './header.css';
import Button from '../ButtonComponent/Button.jsx';
import { useState, useRef, useEffect } from 'react';
import AccountDropDown from '../AccountComponent/AccountDropDown.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate(); // Хук для навигации

  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // Если logout асинхронный
      setOpen(false);
      navigate('/login'); // Перенаправляем без перезагрузки
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="header-component">
      <div className="header-main">
        {/* ЛЕВАЯ ЧАСТЬ: Логотип */}
        <div className="header-logo">
          <Link className="nav-link flex items-center gap-2" to="/">
            {/* Сюда можно добавить SVG логотип */}
            <h2 className="text-xl font-bold text-blue-600">TaskHive</h2>
          </Link>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: Аккаунт или Вход */}
        {user ? (
          <nav className="header-account relative" ref={menuRef}>
            {/* Единая кнопка профиля */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
              onClick={() => setOpen(!open)}
            >
              <span className="font-medium text-sm text-gray-700 hidden sm:block">
                {user.userName}
              </span>
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <UserIcon />
              </div>
            </div>

            {/* Выпадающее меню */}
            {open && (
              <AccountDropDown>
                {' '}
                {/* Убрал handleLogout из пропсов, передадим внутрь */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900">
                    {user.userName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <ul className="py-1">
                  <li>
                    <Link
                      to="/user"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </AccountDropDown>
            )}
          </nav>
        ) : (
          <nav className="flex gap-4">
            <Link
              className="text-gray-600 hover:text-blue-600 font-medium"
              to="/login"
            >
              Sign In
            </Link>
            <Link
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              to="/registration"
            >
              Get Started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
