import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomDialog = ({
  open,
  onClose,
  title,
  content,
  actions,
  fullWidth = true,
  maxWidth = "sm",
  disableBackdropClick = false,
  onSubmit, // Add a submit handler for form dialogs
}) => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <Dialog
      open={open}
      onClose={disableBackdropClick ? null : onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      {title && (
        <DialogTitle>
          <Typography variant="h6">{title}</Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent dividers>
        {onSubmit ? (
          <form onSubmit={handleFormSubmit}>{content}</form>
        ) : (
          content
        )}
      </DialogContent>
      {actions && (
        <DialogActions>
          {actions.map((action, index) => (
            <Button
              key={index}
              type={action.submit ? "submit" : "button"} // Specify "submit" type if it's a form action
              color={action.color || "primary"}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CustomDialog;
