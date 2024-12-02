import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const Dropdown = ({ label, value, onChange, options }) => (
  <FormControl fullWidth>
    <InputLabel>{label}</InputLabel>
    <Select value={value} onChange={onChange} label={label}>
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default Dropdown;
