
export default function InputChat({value, onChange}) {
    return (
        <div className="input-chat-container">
            <textarea
                className="input-chat__input"
                value={value}
                onChange={onChange}
            ></textarea>
        </div>
    )
}