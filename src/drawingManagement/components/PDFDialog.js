import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const PDFDialog = ({
  open,
  onClose,
  onConfirm,
  pdfUrl,
  title = "PDF Viewer",
  confirmText = "Confirm",
  cancelText = "Cancel",
  data,
}) => {
  console.log("data", data);
  const { url } = data;
  console.log(url);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Dialog Title */}
      <DialogTitle>{title}</DialogTitle>

      {/* PDF Content */}
      <DialogContent>
        {JSON.stringify(data)}
        <iframe
          src={url}
          width="100%"
          height="600px"
          style={{ border: "none" }}
          title="PDF Viewer"
        ></iframe>
      </DialogContent>

      {/* Action Buttons */}
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PDFDialog;
