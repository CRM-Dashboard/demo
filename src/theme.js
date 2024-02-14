import { grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const colors = {
  dark1: "#21252D",
  dark2: "rgba(0, 0, 0, 0.54)",
  dark3: "#2B303B",
  dark4: "#21252D",
  dark5: "#404550",

  light0: "#fff",
  light1: "rgba(0, 0, 0, 0.25)",
  light2: "#e0e0e0",
  light3: "#929AAC",
  light4: "#f4f4f4",
  light5: "#e9e9e9",
};

export const appTheme = createTheme({
  typography: {
    button: {
      textTransform: "none",
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  palette: {
    background: {
      default: "#fafafa",
    },
    primary: {
      main: "#7252D3",
      success: "#219653",
    },
    grey: {
      main: grey[800],
    },
    // mui5 no longer has default colors
    default: {
      main: grey[300],
    },
    ...colors,
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "text", color: "default" },
          style: {
            color: colors.dark1,
          },
        },
      ],
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          background: "#F4F4F4",
          font: "sans-serif",
        },
      },
    },
    MuiTableRow: {
      hover: {
        cursor: "pointer",
      },
    },
  },
});
