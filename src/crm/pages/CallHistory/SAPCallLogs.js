/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "mui-datatables";
import ReactPlayer from "react-player";
import { Box, IconButton, Grid } from "@mui/material";
import GlobalFunctions from "../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CircularScreenLoader from "../../components/circularScreenLoader/CircularScreenLoader";

export default function SAPCallLogs() {
  const [response, setResponse] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [recordingId, setRecordingId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState("");

  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.callTo,
        item?.callFrom,
        item?.status,
        item?.startTime,
        item?.recordingUrl,
      ];
    });
    return modifiedResponse;
  };

  const playRecording = async (recordingURL) => {
    try {
      // const recordingId = recordingURL.replace("https://", "");
      // Fetch the recording stream from your backend API
      const formData = new FormData();
      formData.append("base_url", recordingURL.replace("https://", ""));
      const response = await fetch(
        process.env.REACT_APP_SERVER_URL + `/api/exotel/recording`,
        { method: "POST", body: formData }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch recording");
      }

      // Create an object URL for the stream
      const stream = await response.blob();
      const audioUrl = URL.createObjectURL(stream);
      setRecordingUrl(audioUrl);
    } catch (error) {
      console.error("Error playing recording:", error);
    }
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
      label: "Call Recordings",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          response[dataIndex]?.recordingUrl && (
            <IconButton color="primary" size="small">
              {recordingId === response[dataIndex]?.recordingUrl ? (
                <ReactPlayer
                  url={recordingUrl}
                  controls
                  width="300px"
                  height="50px"
                />
              ) : (
                <PlayCircleOutlineIcon
                  onClick={() => {
                    setRecordingId(response[dataIndex]?.recordingUrl);
                    playRecording(response[dataIndex]?.recordingUrl);
                  }}
                />
              )}
            </IconButton>
          ),
        ],
      },
    },
  ];

  const getTableData = () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);

    fetch(process.env.REACT_APP_SERVER_URL + "/api/topbar/getCallDetails", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log("#########data", data);
          setResponse(data);
          setIsLoading(false);
          setTableData(modifyResponse(data));
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
