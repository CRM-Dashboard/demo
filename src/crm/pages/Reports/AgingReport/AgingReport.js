/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "mui-datatables";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import GlobalFunctions from "./../../../utils/GlobalFunctions";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";

export default function AgingReport() {
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState([]);

  const reducerData = useSelector((state) => state);
  const crmId = reducerData?.dashboard?.crmId;
  const OrderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData.dashboard.project.projectId;

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiIconButton: {
          styleOverrides: {
            root: {
              variant: "contained",
            },
          },
        },
        MuiSvgIcon: {
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

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      console.log("#########item", item?.bal_0_15);
      return [
        item?.name,
        item?.arktx,
        item?.bal_0_15,
        item?.bal_15_30,
        item?.bal_30_60,
        item?.bal_60_90,
        item?.bal_90_120,
        item?.bal_120_150,
        item?.bal_150_180,
        item?.bal_180,
      ];
    });
    return modifiedResponse;
  };

  async function getData() {
    const formData = new FormData();
    formData.append("crmId", crmId);
    formData.append("orderId", OrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("projectId", projectId);

    setLoading(true);

    fetch(process.env.REACT_APP_SERVER_URL + "/api/reports/aging", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setGraphData(modifyResponse(data));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  const columns = [
    { name: "Name" },
    { name: "Unit" },
    {
      name: "0-15",
    },
    {
      name: "15-30",
    },
    {
      name: "30-60",
    },
    {
      name: "60-90",
    },
    {
      name: "90-120",
    },
    {
      name: "120-150",
    },
    {
      name: "150-180",
    },
    {
      name: "> 180",
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    print: true,
    download: true,
    search: true,
    viewColumns: true,
    filter: true,
    pagination: false,
  };

  useEffect(() => {
    getData();
  }, [OrderId, projectId, crmId]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <Grid sx={{ paddingTop: "0.5em" }}>
      {!loading ? (
        <ThemeProvider theme={() => getMuiTheme()}>
          <Table data={graphData} columns={columns} options={options}></Table>
        </ThemeProvider>
      ) : (
        <CircularScreenLoader />
      )}
    </Grid>
  );
}
