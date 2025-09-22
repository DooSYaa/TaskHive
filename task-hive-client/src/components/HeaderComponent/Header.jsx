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
                            <Link className="nav-link" to="/">
                                <svg className="svg-icon" width="30px" height="30px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8 0L0 6V8H1V15H4V10H7V15H15V8H16V6L14 4.5V1H11V2.25L8 0ZM9 10H12V13H9V10Z" />
                                </svg>
                            </Link>
                            <Link className="nav-link" to="/friends">
                                <svg className="svg-icon" width="40px" height="40px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"/>
                                    </g>
                                </svg>
                            </Link>
                            <Link className="nav-link" to="/chat">
                                <svg className="svg-icon" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="50px" height="20px" viewBox="0 0 122.88 78.607"  xmlSpace="preserve">
                                    <g>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M61.058,65.992l24.224-24.221l36.837,36.836H73.673h-25.23H0l36.836-36.836 L61.058,65.992L61.058,65.992z M1.401,0l59.656,59.654L120.714,0H1.401L1.401,0z M0,69.673l31.625-31.628L0,6.42V69.673L0,69.673z M122.88,72.698L88.227,38.045L122.88,3.393V72.698L122.88,72.698z"/>
                                    </g>
                                </svg>
                            </Link>
                            <Link className="nav-link" to="/kanban">
                                Kanban
                            </Link>
                            <Link className="nav-link" to="/group">
                                Group
                            </Link>
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
                            <Link className="nav-link" to="/">
                                <svg className="svg-icon" width="30px" height="30px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8 0L0 6V8H1V15H4V10H7V15H15V8H16V6L14 4.5V1H11V2.25L8 0ZM9 10H12V13H9V10Z" />
                                </svg>
                            </Link>
                        </div>
                    </nav>
                    <nav className="header-account">
                        <Link className="nav-link" to="/login">Sign In</Link>
                        <Link className="nav-link" to="/registration">Registration</Link>
                    </nav>
                </>
            )}
        </header>
    );
}
