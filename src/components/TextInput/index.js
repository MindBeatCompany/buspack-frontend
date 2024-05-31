import React from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";

import "./styles.scss";

const TextInput = ({
  label,
  controlId,
  name,
  onChange,
  inputType,
  isAmount,
  placeholder,
  additionalInfo,
  value,
  readOnly,
  formikClasses,
  onBlur,
  required,
  disabled
}) => {
  return (
    <>
      <Form.Group className="text-input" controlId={controlId}>
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Control
          required={required}
          onChange={onChange}
          autoComplete="off"
          type={inputType ? inputType : "text"}
          placeholder={placeholder ? placeholder : ""}
          className={`textInput ${formikClasses} ${isAmount && "text-right"} `}
          value={value}
          readOnly={readOnly ? true : false}
          name={name}
          onBlur={onBlur}
          disabled={disabled}
        />

        {additionalInfo && (
          <Form.Text className="text-muted">{additionalInfo}</Form.Text>
        )}
      </Form.Group>
    </>
  );
};
TextInput.propTypes = {
  label: PropTypes.string,
  controlId: PropTypes.string,
  inputType: PropTypes.string,
  placeholder: PropTypes.string,
  additionalInfo: PropTypes.string,
  isAmount: PropTypes.bool,
  formikClasses: PropTypes.string,
};
export default TextInput;
