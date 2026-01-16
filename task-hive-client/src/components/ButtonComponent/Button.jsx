import './button.css';
export default function Button({
  children,
  onClick,
  variant = 'default',
  style,
  type = 'button',
}) {
  return (
    <button
      className={`button ${variant}`}
      onClick={onClick}
      style={style}
      type={type}
    >
      {children}
    </button>
  );
}
