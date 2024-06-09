import s from "./ScrollButton.module.scss";
import { IoMdNavigate } from "react-icons/io";

type Props = {
  onClick: () => void;
};

const ScrollButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button onClick={onClick} className={s["scrollToTopBtn"]}>
      <IoMdNavigate className={s["scrollToTopBtn__icon"]} />
    </button>
  );
};

export default ScrollButton;
