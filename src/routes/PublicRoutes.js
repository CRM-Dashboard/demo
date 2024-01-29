import React from "react";
import Navigation from "./Navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function getPublicRoutes(params) {
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#4D7AFF",
      },
      secondary: {
        main: "#363B4D",
      },
      textField: {
        main: "#00000087",
      },
      other: {
        headerBg: {
          main: "#F3F5F7",
        },
        menuSelected: {
          main: "#4A5060",
        },
        dark: {
          main: "#000000",
        },
        light: {
          main: "#ffffff",
        },
      },
    },

    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },

      // MuiTable header text center & row text center

      MUIDataTableHeadCell: {
        styleOverrides: {
          root: {
            fontSize: "1rem",
            padding: "4px",
            backgroundColor: "#F3F5F7",
            color: "#4A5060",
            "& .MuiButton-root": {
              fontSize: "1rem",
            },
            textAlign: "center",
          },
          contentWrapper: {
            justifyContent: "center",
          },
          sortAction: {
            alignItems: "center",
          },
        },
      },

      MUIDataTableSelectCell: {
        expandDisabled: {
          // Soft hide the button.
          visibility: "hidden",
        },
        styleOverrides: {
          headerCell: {
            backgroundColor: "#F3F5F7",
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderLeft: "1px solid rgba(224, 224, 224, 1)",
            padding: "4px",
          },
          head: {
            borderLeft: "1px solid rgba(224, 224, 224, 1)",
          },
        },
      },

      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            "&:hover": {
              color: "#4D7AFF",
            },
          },
        },
      },
      MuiTableFooter: {
        styleOverrides: {
          root: {
            borderRight: "1px solid rgba(224, 224, 224, 1)",
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            border: "1px solid rgba(224, 224, 224, 1)",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            border: "1px solid rgba(224, 224, 224, 1)",
          },
        },
      },
      MUIDataTableBodyCell: {
        styleOverrides: {
          root: {
            borderRightStyle: "1px solid black",
            display: "tableRowGroup",
            fontSize: "1rem",
            textAlign: "center",
            marginRight: "15%",
          },
        },
      },
    },
    spacing: [0, 4, 8, 16, 32, 40, 48, 56, 64, 72],
    typography: {
      fontFamily: "Futura",
      fontWeightRegular: 400,
      fontWeightLight: 300,
      fontWeightMedium: 500,
      fontWeightBold: 700,

      h1: {
        fontSize: 64,
      },
      h2: {
        fontSize: 56,
      },
      h3: {
        fontSize: 48,
      },
      h4: {
        fontSize: 40,
      },
      h5: {
        fontSize: 32,
      },
      h6: {
        fontSize: 28,
      },
      h7: {
        fontSize: 15,
      },
      subtitle1: {
        fontSize: 22,
        color: "#555B6B",
      },
      subtitle2: {
        fontSize: 20,
        color: "#555B6B",
      },
      body1: {
        fontSize: 16,
      },
      body2: {
        fontSize: 12,
      },
      caption: {
        color: "#555B6B",
      },
      button: {
        fontSize: 16,
      },
      fontSize: 15,
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Navigation />
    </ThemeProvider>
  );
}
