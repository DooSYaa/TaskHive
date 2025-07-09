import {useAuth} from '../Context/AuthContext.jsx';
import './account.model.css';
export default function Account() {
    const {user} = useAuth();
    return (
        <h2>Hello {user.userName}</h2>
    )
}