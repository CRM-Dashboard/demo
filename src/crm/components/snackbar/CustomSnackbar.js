import React from "react";
import PropTypes from "prop-types";
import { Snackbar, Button, Alert } from "@mui/material";

export default function CustomSnackbar({
  message,
  action,
  ButtonProps,
  SnackbarProps,
  customParameters,
}) {
  return (
    <Snackbar autoHideDuration={5000} {...SnackbarProps}>
      <Alert
        elevation={6}
        variant="filled"
        severity={customParameters?.type}
        action={
          action != null && (
            <Button
              data-test-id="snackbar-button"
              color="inherit"
              size="small"
              {...ButtonProps}
            >
              {action}
            </Button>
          )
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

CustomSnackbar.propTypes = {
  message: PropTypes.string,
  action: PropTypes.string,
  ButtonProps: PropTypes.object,
  SnackbarProps: PropTypes.object,
  customParameters: PropTypes.shape({
    type: PropTypes.oneOf(["error", "warning", "info", "success"]),
  }),
};
