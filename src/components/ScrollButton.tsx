import s from "./ScrollButton.module.scss";

type Props = {
  onClick: () => void;
};

const ScrollButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button onClick={onClick} className={s["scrollToTopBtn"]}>
      ↑
    </button>
  );
};

export default ScrollButton;
