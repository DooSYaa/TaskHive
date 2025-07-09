import {Link} from "react-router-dom";
import {useAuth} from "../Context/AuthContext.jsx";
import './header.css';

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
                <>
                    <nav className="header-main">
                        <div className="header-logo">
                            <Link className="nav-link" to="/">
                                <h2>TaskHive</h2>
                            </Link>
                        </div>
                        <div className="nav-menu">
                            <Link className="nav-link" to="/">Home</Link>
                            <Link className="nav-link" to="#">About</Link>
                            <Link className="nav-link" to="#">Subscribe</Link>
                            <Link className="nav-link" to="/friends">Friends</Link>
                            <Link className="nav-link" to="/chat">Chat</Link>
                        </div>
                    </nav>
                    <nav className="header-account">
                        <Link className="nav-link" to="/user">{user.userName}</Link>
                        <Link className="nav-link" to="#" onClick={handleLogout}>Logout</Link>
                    </nav>
                </>
            ) : (
                <>
                    <nav className="header-main">
                        <div className="header-logo">
                            <Link className="nav-link" to="/">
                                <h2>TaskHive</h2>
                            </Link>
                        </div>
                        <div className="nav-menu">
                            <Link className="nav-link" to="/">Home</Link>
                            <Link className="nav-link" to="#">About</Link>
                            <Link className="nav-link" to="#">Subscribe</Link>
                        </div>
                    </nav>
                    <nav className="header-account">
                        <Link className="nav-link" to="/login">Login</Link>
                        <Link className="nav-link" to="/registration">Registration</Link>
                    </nav>
                </>
            )}
        </header>
    );
}
