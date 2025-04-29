import React from 'react';
import { validationRules } from '@src/utils/validations';
import PropTypes from 'prop-types';
import './inputField.css'

const InputField = ({
  label,
  id,
  type,
  max,
  min,
  maxLength,
  register,
  errors,
  trigger,
  ...rest
}) => {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        maxLength={maxLength}
        min={min}
        max={max}
        {...register(id, validationRules[id])}
        onChange={(e) => {
            const { onChange } = register(id);
            onChange(e);
            trigger(id);
          }}
          {...rest}
      />
      <p className="auth-error">{errors[id] &&  errors[id].message} </p>
    </div>
  );
};

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    min: PropTypes.number,
    maxLength: PropTypes.number,
    register: PropTypes.func,
    errors: PropTypes.object,
    trigger: PropTypes.func,
  };

export default InputField;