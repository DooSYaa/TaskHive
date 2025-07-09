import Header from "./components/HeaderComponent/Header.jsx";
import './App.css'
import {Route, Routes} from "react-router-dom";
import Registration from "./components/RegistrationComponent/Registration.jsx";
import Login from "./components/LoginComponent/Login.jsx";
import Home from "./components/HomeComponent/Home.jsx";
import Account from "./components/AccountComponent/Account.jsx";
import Friend from "./components/FriendComponent/Friend.jsx";
import Chat from "./components/ChatComponent/Chat.jsx";


export default function App() {

    return (
        <>
            <Header />
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path='/registration' element={<Registration />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/user' element={<Account />} />
                    <Route path='/friends' element={<Friend />} />
                    <Route path='/chat' element={<Chat />} />
                </Routes>
            </div>
        </>
    )
}
