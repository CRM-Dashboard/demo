/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "mui-datatables";
import { Box, IconButton } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import GlobalFunctions from "../../utils/GlobalFunctions";
import CircularScreenLoader from "../../components/circularScreenLoader/CircularScreenLoader";
import { useSelector } from "react-redux/es/hooks/useSelector";
// import { SpeechClient } from "@google-cloud/speech/build/src/v1";
import ReactPlayer from "react-player";

export default function CallHistory() {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState([]);
  // const [transcript, setTranscript] = useState("");

  const reducerData = useSelector((state) => state);

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.To,
        item?.From,
        item?.Status,
        item?.StartTime,
        item?.EndTime,
        item?.Duration,
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
      name: "End Time",
      label: "End Time",
    },
    {
      name: "Duration",
      label: "Duration",
    },

    {
      label: "Action",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <IconButton color="primary" size="small">
            <ReactPlayer
              url={response[dataIndex].RecordingUrl}
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

    fetch(process.env.REACT_APP_SERVER_URL + "/api/exotel/calls")
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setResponse(data.Calls);
          setIsLoading(false);
          setTableData(modifyResponse(data.Calls));
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
  );
}
