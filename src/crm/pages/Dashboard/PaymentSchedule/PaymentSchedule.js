/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Table from "mui-datatables";
import moment from "moment";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { TableRow, TableCell, TableFooter } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function PaymentSchedule() {
  const [page, setPage] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const reducerData = useSelector((state) => state);
  const OrderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const txtColour = GlobalFunctions.getThemeBasedDatailsColour(
    reducerData.ThemeReducer.mode
  );

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

    rowsPerPageOptions: [5, 10, 25, 50],
    onChangeRowsPerPage(numberOfRows) {
      setRowsPerPage(numberOfRows);
    },
    onChangePage(page) {
      setPage(page);
    },
    customTableBodyFooterRender: (opts) => {
      const startIndex = page * rowsPerPage;
      const endIndex = (page + 3) * rowsPerPage;

      let sumAmount = opts.data
        .slice(startIndex, endIndex)
        .reduce((accu, item) => {
          return accu + Number(item.data[3].replaceAll(",", ""));
        }, 0);

      return (
        <>
          {tableData.length > 0 && (
            <TableFooter>
              <TableRow>
                {opts.columns.map((col, index) => {
                  if (col.display === "true") {
                    if (col.name === "Date") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          Total
                        </TableCell>
                      );
                    } else if (col.name === "Billing Percent") {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "MileStone Description") {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "Amount") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {sumAmount}
                        </TableCell>
                      );
                    } else if (col.name === "Status") {
                      return <TableCell key={index}>{}</TableCell>;
                    }
                  }
                })}
              </TableRow>
            </TableFooter>
          )}
        </>
      );
    },
  };

  const columns = [
    {
      name: "Date",
      label: "Date",
    },
    {
      name: "Billing Percent",
      label: "Billing Percent",
    },
    {
      name: "MileStone Description",
      label: "MileStone Description",
    },
    {
      name: "Amount",
      label: "Amount",
    },
    {
      name: "Status",
      label: "Status",
      options: {
        customBodyRender: (value) => {
          const cellStyle = {
            fontWeight: "bold",
            color:
              value === "Invoiced"
                ? "#0E9E07" //green
                : value === "Mlstn Not Completed"
                ? "#FFD800" //yellow
                : "red", //red
          };

          return <div style={cellStyle}>{value}</div>;
        },
      },
    },
  ];

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        moment(item?.Date).format("DD-MM-YYYY"),
        item?.BillingPercent,
        item?.MilestoneDescription,
        GlobalFunctions.getFormatedNumber(item.Amount),
        item.Status,
      ];
    });
    return modifiedResponse;
  };

  useEffect(() => {
    if (OrderId) {
      const formData = new FormData();
      formData.append("OrderId", OrderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      fetch(
        process.env.REACT_APP_SERVER_URL +
          "/api/dashboard/paymentSchedule/plan",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setTableData(modifyResponse(data));
          }
        });
    }
  }, [OrderId]);

  return (
    <div style={{ marginTop: "1em" }}>
      <ThemeProvider theme={() => getMuiTheme()}>
        <Table data={tableData} columns={columns} options={options}></Table>
      </ThemeProvider>
    </div>
  );
}
