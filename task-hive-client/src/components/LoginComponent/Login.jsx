import Button from '../ButtonComponent/Button.jsx'
import styles from './login.module.css'
import {useEffect, useState} from "react";
import {useAuth} from "../Context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setEmailError(!email ? 'email is required!' : null);
            setPasswordError(!password ? 'password required' : null);
            return;
        }
        if (!emailError && !passwordError) {
            const response = await fetch('http://localhost:5291/api/Account/login', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    "email": email,
                    "password": password,
                }),
            });
            if(!response.ok){
                throw new Error(`Error occured: ${response.status}`);
            }
            const data = await response.json();
            const userName = data.userName;
            if(userName){
                login(userName, data.token);
                navigate('/');
            } else {
                throw new Error('Username not found in this response')
            }
        }
    }
    useEffect(() => {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,20}$/;
        if (password && !pattern.test(password)) {
            setPasswordError(
                'Password must:\n' +
                '- be between 10 and 20 characters\n' +
                '- contain special characters\n' +
                '- must contain a capital letter\n' +
                '- contain numbers'
            );
        } else {
            setPasswordError(null);
        }
    }, [password]);

    useEffect(() => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailPattern.test(email)) {
            setEmailError('Enter a valid email');
        } else {
            setEmailError(null);
        }
    }, [email]);

    return (
        <div className={styles.loginMainContainer}>
            <div className={styles.loginContainer}>
                <h1>Sign in</h1>
                <form onSubmit={handleSubmit}>
                    <label className={styles.formLabel} htmlFor="email">Email</label> <br/>
                    <input
                        className={styles.formInput}
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    /> <br/>
                    {emailError && (
                        <span id="email-error" className={styles.errorMessage}>
                            {emailError}
                        </span>
                    )}
                    <br/>
                    <label className={styles.formLabel} htmlFor="password">Password</label> <br/>
                    <input
                        className={styles.formInput}
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} //setPassword(e.target.value)
                    /> <br/>
                    <br/>
                    <Button variant={'login'}>Sign in</Button>
                </form>
            </div>
        </div>
    )
}
