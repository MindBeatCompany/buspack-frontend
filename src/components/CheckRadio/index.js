import React from 'react';
import { FormCheck } from 'react-bootstrap';
import "./styles.scss";
import PropTypes from "prop-types";

const CheckRadio = ({ 
    checked, 
    onChange,
    reverse,
     id, 
     disabled, 
     inline, 
     label, 
     value,
      name  
    }) => {
  
    return (
        <FormCheck
            className='custom-checkradio'
            inline={inline}
            reverse={reverse}
            disabled={disabled}
            checked={checked}
            name={name}
            value={value}
            onChange={onChange}
            type="radio"
            label={label}
            id={id}
            />
            
        )
    }
   
        CheckRadio.propTypes = {
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          onChange: PropTypes.func.isRequired,
          name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
          id: PropTypes.string,
          disabled: PropTypes.bool,
          checked: PropTypes.bool,
          reverse: PropTypes.bool,
          inline: PropTypes.bool,
        };
      

export default CheckRadio