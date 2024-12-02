// Custom reusable components
import { Box, Typography } from "@mui/material";

const InfoRow = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid #e0e0e0",
      paddingBottom: 1,
      marginBottom: 2,
    }}
  >
    <Typography sx={{ fontWeight: 600, marginRight: 2 }}>{label} :</Typography>
    <Typography>{value}</Typography>
  </Box>
);

export default InfoRow;
