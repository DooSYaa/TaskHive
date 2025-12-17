import './button.css';
export default function Button({
  children,
  onClick,
  variant = 'default',
  style,
}) {
  return (
    <button className={`button ${variant}`} onClick={onClick} style={style}>
      {children}
    </button>
  );
}
