import { TextField } from "@mui/material";

const TextArea = ({ label, value, onChange }) => (
  <TextField
    label={label}
    multiline
    fullWidth
    value={value}
    onChange={onChange}
    sx={{
      backgroundColor: "#f9f9f9",
      borderRadius: 2,
    }}
  />
);

export default TextArea;
