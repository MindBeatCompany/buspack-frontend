import React from "react";
import "./styles.scss";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./styles.scss";

const PasswordInput = ({
  label,
  onChange,
  showPassword,
  placeholder,
  value,
  name,
  additionalInfo,
  onBlur,
  setShowPassword,
}) => {
  return (
    <Form.Group className="passwordInput">
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        onChange={onChange}
        type={showPassword ? "text" : "password"}
        //placeholder={placeholder ? placeholder : ""}
        className="textInput"
        value={value}
        name={name}
        onBlur={onBlur}
      />
      {additionalInfo && (
        <Form.Text className="text-muted">{additionalInfo}</Form.Text>
      )}
      <div className="eye-container">
        <FontAwesomeIcon
          onClick={() => setShowPassword(!showPassword)}
          icon={showPassword ? faEyeSlash : faEye}
          className="eyeShow"
        />
      </div>
    </Form.Group>
  );
};

PasswordInput.propTypes = {
  label: PropTypes.string,
  show: PropTypes.bool,
  placeholder: PropTypes.string,
  additionalInfo: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any,
  name: PropTypes.string,
  onBlur: PropTypes.func,
};

export default PasswordInput;
