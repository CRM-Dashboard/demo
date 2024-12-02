import { Button } from "@mui/material";

const StatusButton = ({ label, onClick, variant, color }) => (
  <Button
    fullWidth
    variant={variant}
    color={color}
    onClick={onClick}
    sx={{
      textTransform: "none",
      fontWeight: 600,
    }}
  >
    {label}
  </Button>
);

export default StatusButton;
