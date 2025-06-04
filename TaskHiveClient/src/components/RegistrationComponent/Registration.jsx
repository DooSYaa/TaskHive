import './registration.css'
export default function Registration() {
    return (
        <div className="registration-container">
            <form action="">
                <label htmlFor="">User name</label> <br/>
                <input type="text"/>
                <label htmlFor="">Email</label>
                <input type="text"/>
                <label htmlFor="">Password</label>
                <input type="text"/>
                <button>Send</button>
            </form>
        </div>
    )
}