import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@mui/material";

function InputField(props) {
  const {
    value,
    label,
    type,
    id,
    width,
    shrink,
    required,
    onChange,
    error,
    ...rest
  } = props;

  return (
    <TextField
      sx={{
        borderColor: "red",
        width: rest.selected ? "auto" : "100%",
        "MuiSelect-select": {
          width: "auto",
        },
        "& .MuiInputBase-root": {
          height: 45,
        },
        "& .MuiInputBase-input": {
          border: 0,
        },
        "& input[type=number]": {
          "-moz-appearance": "textfield",
        },
        "& input[type=number]::-webkit-outer-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#00000087",
          },
        },
      }}
      error={error}
      id={id || ""}
      type={type || "text"}
      label={label}
      required={required}
      InputLabelProps={{
        shrink: shrink || true,
      }}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
}

InputField.propTypes = {
  value: PropTypes.any,
  label: PropTypes.string,
  type: PropTypes.any,
  id: PropTypes.any,
  height: PropTypes.any,
  width: PropTypes.any,
  shrink: PropTypes.any,
  required: PropTypes.bool,
  register: PropTypes.any,
  rest: PropTypes.object,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.any,
};

export default InputField;
