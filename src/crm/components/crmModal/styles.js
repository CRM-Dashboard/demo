import { makeStyles } from "@mui/styles";

const modalStyles = makeStyles(() => ({
  root: {
    "& .MuiDialog-paper": {
      overflowY: "initial",
    },
  },
  paddingLeft: {
    paddingLeft: "40px",
  },
}));

export default modalStyles;
