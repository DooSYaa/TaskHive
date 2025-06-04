import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Login from './components/LoginComponent/Login.jsx';
import Registration from './components/RegistrationComponent/Registration.jsx';

export default function App() {
    return (
        <Router>
            <div>
                <nav>
                    <Link to='/login'>Login</Link>
                    <Link to='/registration'>Registration</Link>
                </nav>
                <Routes>
                    <Route path='/registration' element={<Registration />} />
                    <Route path='/login' element={<Login />} />
                </Routes>
            </div>
        </Router>
    )
}