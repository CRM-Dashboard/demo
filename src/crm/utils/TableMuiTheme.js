import GlobalFunctions from "../utils/GlobalFunctions";
import { createTheme } from "@mui/material";

const getMuiTheme = (reducerData) =>
  createTheme({
    components: {
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: "Blue",
          },
        },
      },
      MUIDataTableToolbar: {
        styleOverrides: {
          root: {
            backgroundColor: GlobalFunctions.getThemeBasedMode(
              reducerData.ThemeReducer.mode
            ),
            color: GlobalFunctions.getThemeBasedDatailsColour(
              reducerData.ThemeReducer.mode
            ),
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          selectLabel: {
            color: GlobalFunctions.getThemeBasedDatailsColour(
              reducerData.ThemeReducer.mode
            ),
          },
          selectIcon: {
            color: GlobalFunctions.getThemeBasedDatailsColour(
              reducerData.ThemeReducer.mode
            ),
          },
          displayedRows: {
            color: GlobalFunctions.getThemeBasedDatailsColour(
              reducerData.ThemeReducer.mode
            ),
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            color: GlobalFunctions.getThemeBasedDatailsColour(
              reducerData.ThemeReducer.mode
            ),
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          footer: {
            backgroundColor: GlobalFunctions.getThemeBasedMode(
              reducerData.ThemeReducer.mode
            ),
            color: GlobalFunctions.getThemeBasedDatailsColour(
              reducerData.ThemeReducer.mode
            ),
          },
        },
      },
      MUIDataTableHeadRow: {
        styleOverrides: {
          root: {
            backgroundColor: GlobalFunctions.getThemeBasedMode(
              reducerData.ThemeReducer.mode
            ),
            color: GlobalFunctions.getThemeBasedDatailsColour(
              reducerData.ThemeReducer.mode
            ),
          },
        },
      },
      MUIDataTableHeadCell: {
        styleOverrides: {
          root: {
            backgroundColor: GlobalFunctions.getThemeBasedMode(
              reducerData.ThemeReducer.mode
            ),
            color: GlobalFunctions.getThemeBasedDatailsColour(
              reducerData.ThemeReducer.mode
            ),
          },
        },
      },
      MUIDataTableBodyCell: {
        styleOverrides: {
          root: {
            backgroundColor: GlobalFunctions.getThemeBasedMode(
              reducerData.ThemeReducer.mode
            ),
            color: GlobalFunctions.getThemeBasedDatailsColour(
              reducerData.ThemeReducer.mode
            ),
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            paddingTop: 0,
            paddingBottom: 0,
            lineHeight: "2.2em",
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            padding: 0,
          },
        },
      },
    },
  });

const exportDefault = {
  getMuiTheme,
};

export default exportDefault;
