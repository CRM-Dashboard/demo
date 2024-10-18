import { createTheme } from "@mui/material";

// import 
// import GlobalFunctions from "../../../../../utils/GlobalFunctions";

import GlobalFunctions from "../../utils/GlobalFunctions"
// import { useSelector } from "react-redux";
import { store } from "../../../index"


export const tableMuiTheme = () => {
    const reducerData = store.getState()
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
                        backgroundColor: "#62b4ff",
                        color: "white",
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
                        lineHeight: "1.3em",
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
    })
}

