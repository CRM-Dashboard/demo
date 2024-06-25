/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Table from "mui-datatables";
import { Grid } from "@mui/material";
import GlobalFunctions from "../../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularScreenLoader from "./../../../../components/circularScreenLoader/CircularScreenLoader";

export default function Booking({ tableDetails, response, getFilteredData }) {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const reducerData = useSelector((state) => state);

  const getMuiTheme = () =>
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
    });

  const options = {
    selectableRows: "none",
    elevation: 0,
    print: true,
    download: true,
    search: true,
    viewColumns: true,
    filter: true,
  };

  const columns = [
    {
      name: "Building",
    },
    {
      name: "Flat Number",
    },
    {
      name: "Customer Name",
    },
    {
      name: "Consideration Value",
    },
    {
      name: "GST",
    },
    {
      name: "GST %",
    },
    {
      name: "Admin Charges",
    },
    {
      name: "Admin Charges GST",
    },
    {
      name: "Admin Charges GST %",
    },
    {
      name: "All Inclusive Value",
    },
  ];

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.building,
        item?.flatno,
        item?.customerName,
        item?.cvVal,
        item?.gst,
        item?.gstPer,
        item?.other,
        item?.gstOther,
        item?.gstOtherPer,
        item?.allIncVal,
      ];
    });
    return modifiedResponse;
  };

  useEffect(() => {
    setLoading(true);
    const data = getFilteredData(response);
    setTableData(modifyResponse(data));
    setLoading(false);
  }, [reducerData?.BookingReducer?.BookingsDetailsFilter, tableDetails]);

  useEffect(() => {
    setLoading(true);
    setTableData(modifyResponse(tableDetails));
    setLoading(false);
  }, []);

  return (
    <Grid style={{ marginTop: "0.5em" }}>
      {!loading ? (
        <ThemeProvider theme={() => getMuiTheme()}>
          <Table data={tableData} columns={columns} options={options}></Table>
        </ThemeProvider>
      ) : (
        <CircularScreenLoader />
      )}
    </Grid>
  );
}
