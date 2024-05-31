import React from "react";
import ReactDatePicker from "react-datepicker";
import Form from "react-bootstrap/Form";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.scss";

const DatePicker = ({ selected, onChange, label, name, controlId }) => {
  return (
    <>
      <Form.Group className="form_group_date_picke" controlId={controlId}>
        <Form.Label>{label}</Form.Label>
        <ReactDatePicker
          className="picker form-control"
          selected={selected}
          onChange={(date) => onChange(date)}
          name={name}
          dateFormat="dd/MM/yyyy"
        />
      </Form.Group>
    </>
  );
};

export default DatePicker;
