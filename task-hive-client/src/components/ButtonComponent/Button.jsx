import './button.css'
export default function Button({children, onClick, variant = 'default'}) {
const classNames = `button ${variant}`
    return (
        <button
            className={classNames}
            onClick={onClick}
        >
            {children}
        </button>
    )
}