/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "mui-datatables";
import ReactPlayer from "react-player";
import { Box, IconButton, Grid } from "@mui/material";
import GlobalFunctions from "../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularScreenLoader from "../../components/circularScreenLoader/CircularScreenLoader";

export default function IncomingOrMissedCalls() {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState([]);

  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;
  const customerMobileNumber = reducerData?.dashboard?.customerContactNo;

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.To,
        item?.From,
        item?.Status,
        item?.StartTime,
        item?.RecordingUrl,
      ];
    });
    return modifiedResponse;
  };

  const columns = [
    {
      name: "To",
      label: "To",
    },
    {
      name: "From",
      label: "From",
    },
    {
      name: "Status",
      label: "Status",
    },
    {
      name: "Start Time",
      label: "Start Time",
    },

    {
      label: "Action",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <IconButton color="primary" size="small">
            <ReactPlayer
              url={response[dataIndex]?.RecordingUrl}
              controls
              width="300px"
              height="50px"
            />
          </IconButton>,
        ],
      },
    },
  ];

  const getTableData = () => {
    setIsLoading(true);
    fetch(process.env.REACT_APP_SERVER_URL + "/api/exotel/calls", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setResponse(data.Calls);
          setIsLoading(false);
          const calls = data.Calls.filter((data) => {
            if (
              data.Direction === "inbound" &&
              data.To === "0" + customerMobileNumber
            ) {
              return data;
            }
          });
          setTableData(modifyResponse(calls));
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    getTableData();
  }, []);

  useEffect(() => {
    getTableData();
  }, [orderId]);

  const options = {
    selectableRows: "none",
    elevation: 0,
    print: true,
    download: true,
    search: true,
    viewColumns: true,
    filter: true,
  };

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
              lineHeight: "3.2em",
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              paddingTop: 0,
              paddingBottom: 0,
            },
          },
        },
      },
    });

  return (
    <Grid sx={{ paddingTop: "1em" }}>
      <Box sx={{ top: "30%" }}>
        {!isLoading ? (
          <>
            <ThemeProvider theme={getMuiTheme}>
              <Table
                data={tableData}
                columns={columns}
                options={options}
                sx={{
                  MuiTableCell: {
                    head: {
                      backgroundColor: "red !important",
                    },
                  },
                }}
              ></Table>
            </ThemeProvider>
          </>
        ) : (
          <CircularScreenLoader />
        )}
      </Box>
    </Grid>
  );
}
