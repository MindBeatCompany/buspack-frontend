import React from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import "./styles.scss";
import EmailIcon from "../../../../resources/icons/EmailIcon";
const EmailInput = ({
  label,
  controlId,
  name,
  onChange,
  placeholder,
  additionalInfo,
  value,
  readOnly,
  formikClasses,
  onBlur,
  onError,
  isWriting,
}) => {
  return (
    <>
      <Form.Group className="email-input" controlId={controlId}>
        {label && <Form.Label>{label}</Form.Label>}
        {onError || isWriting ? null : (
          <div className="icon-container-input bg-white">
            <EmailIcon/>
          </div>
        )}
        <Form.Control
          onChange={onChange}
          autoComplete="new-password"
          type="text"
          placeholder={placeholder ? placeholder : ""}
          className={`${isWriting && "isWriting"} ${
            onError ? "on-error-email" : "email-login-input"
          }`}
          value={value}
          readOnly={readOnly ? true : false}
          name={name}
          onBlur={onBlur}
        />

        {additionalInfo && (
          <Form.Text className="text-muted">{additionalInfo}</Form.Text>
        )}
      </Form.Group>
    </>
  );
};
EmailInput.propTypes = {
  label: PropTypes.string,
  controlId: PropTypes.string,
  inputType: PropTypes.string,
  placeholder: PropTypes.string,
  additionalInfo: PropTypes.string,
  isAmount: PropTypes.bool,
  formikClasses: PropTypes.string,
};
export default EmailInput;
