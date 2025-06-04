import './login.css';
export default function Login() {
    return(
        <div className="login-container">
            <form action="">
                <label htmlFor="">Email</label>
                <input type="text"/>
                <label htmlFor="">Password</label>
                <input type="text"/>
                <button>Send</button>
            </form>
        </div>
    )
}