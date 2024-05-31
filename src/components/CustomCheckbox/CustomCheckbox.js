import "./styles.scss";
import PropTypes from "prop-types";


const CustomCheckbox = ({ value, onChange, name, id, disabled, checked }) => {
  return (
    <input
      className="custom-checkbox"
      value={value}
      onChange={onChange}
      name={name}
      id={id}
      type="checkbox"
      checked={checked}
      disabled={disabled}
    />
  );
};

CustomCheckbox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  id: PropTypes.string, 
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
};

export default CustomCheckbox;
