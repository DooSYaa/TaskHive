import './registration.module.css'
import styles from "../RegistrationComponent/registration.module.css";
import Button from "../ButtonComponent/Button.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../Context/AuthContext.jsx";
import {Link, useNavigate} from "react-router-dom";
export default function Registration(){
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const {login} = useAuth();
    const navigate = useNavigate();

    function handleSubmit(e){
        e.preventDefault()
        fetch('http://localhost:5292/api/Account/registration', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "userName": userName,
                "email": email,
                "password": password,
            })
        })
            .then(res => res.json())
            .then(data => {
                login(data.userName, data.token);
                navigate('/');
            })
            .catch(err => console.log(err));
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
            setEmailError('Введите корректный email');
        } else {
            setEmailError(null);
        }
    }, [email]);
    return (
        <div className={styles.registrationMainContainer}>

            <div className={styles.registrationContainer}>
                <div className={styles.rectangleContainer}>
                    <svg className={styles.rectangle} width={400} height={400} version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <rect width={400} height={400}  />
                    </svg>
                </div>
                <div className={styles.registrationFormContainer}>
                    <h1>Sign up</h1>
                    <form onSubmit={handleSubmit}>
                        <input className={styles.formInput}
                               id="username"
                               type="text"
                               value={userName}
                               onChange={(e) => setUserName(e.target.value)}
                               placeholder="User Name"
                        />
                        <br/>
                        <br/>
                        <input className={styles.formInput}
                               id="email"
                               type="email"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               placeholder="Email"
                        /> <br/>
                        {emailError && (
                            <span id="email-error" className={styles.errorMessage}>
                                {emailError}
                            </span>
                        )}
                        <br/>
                        <input
                            className={styles.formInput}
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        <br/>
                        {passwordError && (
                            <span id="password-error" className={styles.errorMessage}>
                                {passwordError.split('\n').map((line, index) => (
                                    <span key={index}>
                                {line}
                                        <br />
                            </span>
                                ))}
                            </span>
                        )}
                        <br/>
                        <Button variant={'login'}>Sign up</Button>
                        <div className={styles.qwrt}>
                            <p>Already have an account?</p>
                            <Link to="/login">Sign In</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}