/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Table from "mui-datatables";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function SAPEmail() {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const reducerData = useSelector((state) => state);
  const OrderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const EmailID = reducerData?.dashboard?.customerEmailId;

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
    elevation: 0,
    print: true,
    download: true,
    search: true,
    viewColumns: true,
    filter: true,
  };

  const columns = [
    {
      name: "Title",
      label: "Title",
    },
    {
      name: "Sender",
      label: "Sender",
    },
    {
      name: "Recepient",
      label: "Recepient",
    },
    {
      name: "Date",
      label: "Date",
    },
    {
      name: "Time",
      label: "Time",
    },
  ];

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [item?.Title, item?.Sender, item.Recepient, item.Date, item.Time];
    });
    return modifiedResponse;
  };

  useEffect(() => {
    setIsLoading(true);
    if (OrderId) {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("emailId", EmailID);

      fetch(process.env.REACT_APP_SERVER_URL + `/api/reports/maillog`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.Emails) {
            setTableData(modifyResponse(data.Emails));
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        });
    } else {
      setTableData([]);
      setIsLoading(false);
    }
  }, [OrderId]);

  return !isLoading ? (
    <div style={{ marginTop: "1em" }}>
      <ThemeProvider theme={() => getMuiTheme()}>
        <Table data={tableData} columns={columns} options={options}></Table>
      </ThemeProvider>
    </div>
  ) : (
    <CircularScreenLoader />
  );
}
