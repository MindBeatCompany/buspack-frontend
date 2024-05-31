import React from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import "./styles.scss";
import SearchIcon from "../../resources/icons/SearchIcon";
const SearchInput = ({
  label,
  controlId,
  name,
  onChange,
  placeholder,
  additionalInfo,
  value,
  readOnly,
  onBlur,
}) => {
  return (
    <Form.Group className="search-input" controlId={controlId}>
      {label && <Form.Label>{label}</Form.Label>}
      <div className="icon-container-input bg-white">
        <SearchIcon width="23" height="23" />
      </div>
      <Form.Control
        onChange={onChange}
        autoComplete="new-password"
        type="text"
        placeholder={placeholder ? placeholder : ""}
        value={value}
        readOnly={readOnly ? true : false}
        name={name}
        onBlur={onBlur}
      />

      {additionalInfo && (
        <Form.Text className="text-muted">{additionalInfo}</Form.Text>
      )}
    </Form.Group>
  );
};
SearchInput.propTypes = {
  label: PropTypes.string,
  controlId: PropTypes.string,
  inputType: PropTypes.string,
  placeholder: PropTypes.string,
  additionalInfo: PropTypes.string,
  isAmount: PropTypes.bool,
  formikClasses: PropTypes.string,
};
export default SearchInput;
