import './button.css';
export default function Button({
  children,
  onClick,
  variant = 'default',
  style,
}) {
  const classNames = `button ${variant}`;
  return (
    <button className={classNames} onClick={onClick} style={style}>
      {children}
    </button>
  );
}
