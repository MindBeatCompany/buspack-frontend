import React from "react";
import "./styles.scss";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import "./styles.scss";
import PasswordIcon from "../../../../resources/icons/PasswordIcon";
import { ClosedEyeIcon, EyeIcon } from "../../../../resources/icons";

const PasswordInputLogin = ({
  label,
  onChange,
  showPassword,
  placeholder,
  value,
  name,
  additionalInfo,
  onBlur,
  setShowPassword,
  onError,
  isWriting,
  //formikClasses
}) => {
  return (
    <Form.Group className="password-input-login">
      {label && <Form.Label>{label}</Form.Label>}
      {onError || isWriting ? null : (
        <div className="icon-container-input bg-white">
          <PasswordIcon />
        </div>
      )}

      <Form.Control
        onChange={onChange}
        type={showPassword ? "text" : "password"}
        //placeholder={placeholder ? placeholder : ""}
        className={`${isWriting && "isWriting"} ${
          onError ? "on-error-password" : "password-login-input"
        }`}
        value={value}
        name={name}
        onBlur={onBlur}
      />
      {additionalInfo && (
        <Form.Text className="text-muted">{additionalInfo}</Form.Text>
      )}
      <div className={`eye-container ${onError && "eye-container-error"}`}>
        {showPassword ? (
          <ClosedEyeIcon onClick={() => setShowPassword(!showPassword)} width="26" />
        ) : (
          <EyeIcon onClick={() => setShowPassword(!showPassword)} width="26" />
        )}

        {/* <FontAwesomeIcon
          onClick={() => setShowPassword(!showPassword)}
          icon={showPassword ? faEyeSlash : faEye}
          className="eyeShow"
        /> */}
      </div>
    </Form.Group>
  );
};

PasswordInputLogin.propTypes = {
  label: PropTypes.string,
  show: PropTypes.bool,
  placeholder: PropTypes.string,
  additionalInfo: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any,
  name: PropTypes.string,
  onBlur: PropTypes.func,
};

export default PasswordInputLogin;
