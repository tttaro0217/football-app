import s from "./Button.module.scss";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const Button: React.FC<Props> = ({
  onClick,
  children,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick} // disabledがtrueの場合、onClickを無効にする
      disabled={disabled}
      className={`${s["button"]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
