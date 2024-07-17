/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import moment from "moment";
import Table from "mui-datatables";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography } from "@mui/material";

export default function TodayActivity() {
  const [tableData, setTableData] = useState([]);

  const reducerData = useSelector((state) => state);
  const crmId = reducerData.dashboard.crmId;
  const OrderId = reducerData.searchBar.orderId;
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

  const options = {
    selectableRows: "none",
    rowsPerPage: 100,
    elevation: 0,
    print: true,
    download: true,
    search: true,
    viewColumns: true,
    filter: true,
    filterType: "dropdown",
    responsive: "standard",
  };

  const columns = [
    {
      name: "Date",
      label: "Date",
    },
    {
      name: "Activity Type",
      label: "Activity Type",
    },
    {
      name: "Mode",
      label: "Mode",
    },
    {
      name: "Amount",
      label: "Amount",
    },
    {
      name: "Action",
      label: "Action",
    },
    {
      name: "Remarks",
      label: "Remarks",
    },
    {
      name: "Time",
      label: "Time",
    },
    {
      name: "Status",
      label: "Status",
    },
  ];

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.erdat,
        item.actTypTxt,
        item.actModeTxt,
        item.dmbtr,
        item.action,
        item.remark,
        item.pltac,
        item.compInd === "X" ? "X" : "Open",
      ];
    });
    return modifiedResponse;
  };

  const getTableData = () => {
    const formData = new FormData();
    formData.append("crmId", crmId);
    formData.append("orderId", OrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("projectId", projectId);

    fetch(
      `https://gera-crm-server.azurewebsites.net//api/activity/getActivity`,
      { method: "POST", body: formData }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data[0]?.actdata) {
          const todayActivity = data[0]?.actdata?.filter(
            (act) => act.erdat === moment(new Date()).format("YYYY-MM-DD")
          );
          console.log(
            "#########today's Activity",
            todayActivity,
            moment(new Date()).format("YYYY-MM-DD")
          );
          setTableData(modifyResponse(todayActivity));
        }
      });
  };

  useEffect(() => {
    getTableData();
  }, []);

  return (
    tableData.length > 0 && (
      <div style={{ marginTop: "1em" }}>
        <ThemeProvider theme={() => getMuiTheme()}>
          <Table
            data={tableData}
            columns={columns}
            options={options}
            title={
              <Typography sx={{ fontWeight: "Bold" }}>
                {" "}
                Today's Activity
              </Typography>
            }
          ></Table>
        </ThemeProvider>
      </div>
    )
  );
}
