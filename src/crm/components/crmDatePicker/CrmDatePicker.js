import * as React from "react";
import PropTypes from "prop-types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function CrmDatePicker(props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        sx={{ width: "100%" }}
        format={props?.format || "DD-MM-YYYY"}
        disablePast={props?.disablePast}
        minDate={props.minDate}
        maxDate={props.maxDate}
        label={props.label}
        value={props.value}
        onChange={props.onChange}
        openTo={props.openTo}
        views={props.views}
        readOnly={props.readOnly}
        disabled={props.disabled}
        hideIcon={props.hideIcon}
        slotProps={{
          openPickerButton: {
            size: "small",
            sx: {
              "&.MuiButtonBase-root": {
                backgroundColor: "#7252D3",
                color: "#FFFFFF",
                height: props.buttonBase && props.buttonBase,
                width: props.buttonBase && props.buttonBase,
              },
              "& .MuiSvgIcon-root": {
                height: props.iconHeight && props.iconHeight,
                width: props.iconWidth && props.iconWidth,
              },
            },
          },
          textField: {
            fullWidth: true,
            error: props.error,
            helperText: props.helperText,
            InputLabelProps: {
              shrink: true,
            },
            sx: {
              "& .MuiInputBase-root": {
                height: props.height ? props.height : 45,
                fontSize: props.fontSize && props.fontSize,
                width: props.width && props.width,
              },
              "& .MuiInputLabel-root": {
                color: "gray",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray",
                },
              },
            },
            required: props.isRequired,
          },
        }}
      />
    </LocalizationProvider>
  );
}

CrmDatePicker.propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.string,
  disablePast: PropTypes.bool,
  format: PropTypes.string,
  value: PropTypes.any,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  readOnly: PropTypes.bool,
  openTo: PropTypes.string,
  views: PropTypes.array,
  minDate: PropTypes.any,
  maxDate: PropTypes.any,
  isRequired: PropTypes.bool,
  hideIcon: PropTypes.bool,
};

export default CrmDatePicker;
