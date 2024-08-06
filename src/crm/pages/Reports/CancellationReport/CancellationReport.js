/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "mui-datatables";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import moment from "moment";
import GlobalFunctions from "./../../../utils/GlobalFunctions";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function CancellationReport() {
  const [data, setData] = useState([]);

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
        moment(item?.reqRaiseon).format("DD-MM-YYYY"),
        item?.orderId,
        item?.name1,
        item?.arktx,
        item?.cvbeln,
        item?.creason,
        item?.refund,
        item?.remark,
        item?.approver,
      ];
    });
    return modifiedResponse;
  };

  async function getData() {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("projectId", projectId);
    fetch(
      "https://gera-crm-server.azurewebsites.net//api/reports/inactive_list",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((respData) => {
        setData(modifyResponse(respData));
      })
      .catch(() => {});
  }

  const columns = [
    { name: "Raised On" },
    { name: "Order ID" },
    { name: "Name" },
    {
      name: "Unit",
    },
    {
      name: "Cancellation ID",
    },
    {
      name: "Cancellation Reason",
    },
    {
      name: "Refund",
    },
    {
      name: "Remarks",
    },
    { name: "Approver" },
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
      <ThemeProvider theme={() => getMuiTheme()}>
        <Table data={data} columns={columns} options={options}></Table>
      </ThemeProvider>
    </Grid>
  );
}
