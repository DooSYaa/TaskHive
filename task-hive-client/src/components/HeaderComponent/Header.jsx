import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
import HomeIcon from '../../assets/HomeIcon.jsx';
import UserIcon from '../../assets/UserIcon.jsx';
import ChatIcon from '../../assets/ChatIcon.jsx';
import './header.css';
import FriendsIcon from '../../assets/FriendsIcon.jsx';

export default function Header() {
  const { user, logout } = useAuth();

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
          <nav className="header-account">
            <Link className="nav-link" to="/user">
              <UserIcon />
            </Link>
            <Link className="nav-link" to="#" onClick={handleLogout}>
              Logout
            </Link>
          </nav>
        </div>
      ) : (
        <>
          <nav className="header-main">
            <div className="header-logo">
              <Link className="nav-link" to="/">
                <h2>TaskHive</h2>
              </Link>
            </div>
            <div className="nav-menu">
              <HomeIcon />
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
        </>
      )}
    </header>
  );
}
// import { Link } from "react-router-dom";
// import { useAuth } from "../Context/AuthContext.jsx";
// import HomeIcon from "../../assets/HomeIcon.jsx";
// import UserIcon from "../../assets/UserIcon.jsx";
// import ChatIcon from "../../assets/ChatIcon.jsx";

// export default function Header() {
//   const { user, logout } = useAuth();

//   function handleLogout() {
//     try {
//       logout();
//       window.location.href = "/";
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   return (
//     <header className="px-8 py-2 border-b border-gray-300 shadow-sm flex justify-between items-center bg-white">
//       {user ? (
//         <div className="flex flex-1 justify-between border">
//           {/* Левая часть — лого и меню */}
//           <nav className="flex items-center gap-6">
//             <div className="flex justify-center w-[130px]">
//               <Link
//                 className="text-gray-800 hover:text-cyan-500 transition-colors duration-300 font-bold text-2xl"
//                 to="/"
//               >
//                 TaskHive
//               </Link>
//             </div>

//             <div className="flex flex-row gap-5 items-center text-[18px] text-gray-700">
//               <Link className="hover:text-cyan-500 transition-colors duration-300" to="/">
//                 <HomeIcon />
//               </Link>
//               <Link className="hover:text-cyan-500 transition-colors duration-300" to="/friends">
//                 <UserIcon />
//               </Link>
//               <Link className="hover:text-cyan-500 transition-colors duration-300" to="/chat">
//                 <ChatIcon />
//               </Link>
//               <Link
//                 className="hover:text-cyan-500 transition-colors duration-300 font-medium"
//                 to="/group"
//               >
//                 Group
//               </Link>
//             </div>
//           </nav>

//           {/* Правая часть — пользователь */}
//           <nav className="flex items-center gap-5 text-[17px] text-gray-800">
//             <Link
//               className="hover:text-cyan-500 transition-colors duration-300 font-medium"
//               to="/user"
//             >
//               {user.userName}
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="text-gray-700 hover:text-red-500 transition-colors duration-300 font-medium"
//             >
//               Logout
//             </button>
//           </nav>
//         </div>
//       ) : (
//         <>
//           {/* Гость (неавторизованный пользователь) */}
//           <nav className="flex items-center gap-6">
//             <div className="flex justify-center w-[130px]">
//               <Link
//                 className="text-gray-800 hover:text-cyan-500 transition-colors duration-300 font-bold text-2xl"
//                 to="/"
//               >
//                 TaskHive
//               </Link>
//             </div>
//             <div className="flex flex-row items-center gap-5 text-[18px] text-gray-700">
//               <Link className="hover:text-cyan-500 transition-colors duration-300" to="/">
//                 <HomeIcon />
//               </Link>
//             </div>
//           </nav>

//           <nav className="flex items-center gap-5 text-[17px] text-gray-800 pr-8">
//             <Link
//               className="hover:text-cyan-500 transition-colors duration-300 font-medium"
//               to="/login"
//             >
//               Sign In
//             </Link>
//             <Link
//               className="hover:text-cyan-500 transition-colors duration-300 font-medium"
//               to="/registration"
//             >
//               Registration
//             </Link>
//           </nav>
//         </>
//       )}
//     </header>
//   );
// }
