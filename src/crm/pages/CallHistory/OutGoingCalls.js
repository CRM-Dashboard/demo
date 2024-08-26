/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "mui-datatables";
import ReactPlayer from "react-player";
import { IconButton, Grid } from "@mui/material";
import GlobalFunctions from "../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CircularScreenLoader from "../../components/circularScreenLoader/CircularScreenLoader";

const CustomPagination = ({ callMeta, onPageChange }) => (
  <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
    <div
      style={{
        padding: "16px",
      }}
    >
      <IconButton disabled={!callMeta?.PrevPageUri}>
        <ArrowBackIosIcon
          fontSize="small"
          onClick={() => onPageChange(callMeta?.PrevPageUri)}
          disabled={!callMeta?.PrevPageUri}
        />
      </IconButton>

      <IconButton disabled={!callMeta?.NextPageUri}>
        <ArrowForwardIosIcon
          onClick={() => onPageChange(callMeta?.NextPageUri)}
          disabled={!callMeta?.NextPageUri}
          fontSize="small"
        />
      </IconButton>
    </div>
  </Grid>
);

export default function OutGoingCalls() {
  const [response, setResponse] = useState([]);
  const [callMeta, setCallMeta] = useState();
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const getMetaData = (url) => {
    setIsLoading(true);

    const dataUrl = `${process.env.REACT_APP_SERVER_URL}/api/exotel/getCallMeta`;

    const formData = new FormData();
    formData.append("url", url);

    fetch(dataUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setResponse(data.Calls);
          setIsLoading(false);
          setCallMeta(data.Metadata);
          setTableData(modifyResponse(data.Calls));
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setIsLoading(false);
      });
  };

  const getTableData = () => {
    setIsLoading(true);

    const dataUrl = `${process.env.REACT_APP_SERVER_URL}/api/exotel/calls`;

    const formData = new FormData();
    formData.append("To", customerMobileNumber);

    fetch(dataUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setResponse(data.Calls);
          setIsLoading(false);
          console.log("#############data.Metadata", data.Metadata);
          setCallMeta(data.Metadata);
          setTableData(modifyResponse(data.Calls));
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setIsLoading(false);
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
    page: 1, // Set the default page index (0-based)
    rowsPerPage: 50, // Set the default number of rows per page
    rowsPerPageOptions: [50], // Options for the number of rows per page
    customFooter: () => (
      <CustomPagination callMeta={callMeta} onPageChange={getMetaData} />
    ),
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
    <Grid sx={{ paddingTop: "1em", height: "30em" }}>
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
    </Grid>
  );
}
