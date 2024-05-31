import { Button } from "react-bootstrap";
import "./styles.scss";

const ActionButton = ({
  type,
  onClick,
  children,
  width,
  disabled,
  secondary,
  error,
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      className={`${secondary ? "secondary-action-button" : error ? "error-button" : "action-button"} `}
      style={{width: isNaN(width) ? `${width}` : `${width}%` }}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
