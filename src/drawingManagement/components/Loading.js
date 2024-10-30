import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Loading = ({ message }) => {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>
        {(message && message) || "Loading, please wait..."}
      </Typography>
    </Box>
  );
};

export default Loading;
