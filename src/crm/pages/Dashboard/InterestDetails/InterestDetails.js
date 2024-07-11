/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Table from "mui-datatables";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { TableRow, TableCell, TableFooter } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function InterestDetails() {
  const [page, setPage] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const reducerData = useSelector((state) => state);
  const userName = reducerData.LoginReducer.userName;
  const passWord = reducerData.LoginReducer.passWord;
  const OrderId = reducerData.searchBar.orderId;
  const txtColour = GlobalFunctions.getThemeBasedDatailsColour(
    reducerData.ThemeReducer.mode
  );

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
    rowsPerPage: 100,
    elevation: 0,
    print: true,
    download: true,
    search: true,
    viewColumns: true,
    filter: true,
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

      let sumAmountDue = opts.data
        .slice(startIndex, endIndex)
        .reduce((accu, item) => {
          console.log("**********sumdata", accu, item.data);
          return accu + item.data[4];
        }, 0);

      let sumPaymentAmount = opts.data
        .slice(startIndex, endIndex)
        .reduce((accu, item) => {
          return accu + item.data[5];
        }, 0);

      return (
        <>
          {tableData.length > 0 && (
            <TableFooter>
              <TableRow>
                {opts.columns.map((col, index) => {
                  if (col.display === "true") {
                    if (col.name === "Sr. No") {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "Milestone Stage") {
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
                    } else if (col.name === "Invoice Date") {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "Due Date") {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "Amount Due") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {sumAmountDue}
                        </TableCell>
                      );
                    } else if (col.name === "Payment Amount") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {sumPaymentAmount}
                        </TableCell>
                      );
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
      name: "Sr. No",
      label: "Sr. No",
    },
    {
      name: "Milestone Stage",
      label: "Milestone Stage",
    },
    {
      name: "Invoice Date",
      label: "Invoice Date",
    },
    {
      name: "Due Date",
      label: "Due Date",
    },
    {
      name: "Amount Due",
      label: "Amount Due",
    },
    {
      name: "Payment Amount",
      label: "Payment Amount",
    },
    {
      name: "Balance CF",
      label: "Balance CF",
    },
    {
      name: "Payment Date",
      label: "Payment Date",
    },
    {
      name: "Cheque Number",
      label: "Cheque Number",
    },
    {
      name: "Interest Amount",
      label: "Interest Amount",
    },
    {
      name: "Days",
      label: "Days",
    },
  ];

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.SrNo,
        item?.MilestoneStage,
        item?.InvoiceDate,
        item?.DueDate,
        item?.AmountDue,
        item?.PaymentAmount,
        item?.BalanceCF,
        item?.PaymentDate,
        item?.ChequeNo,
        item?.InterestAmount,
        item?.Days,
      ];
    });
    return modifiedResponse;
  };

  useEffect(() => {
    const formData = new FormData();
    formData.append("orderId", OrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/interest", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setTableData(modifyResponse(data));
        }
      });
  }, [OrderId]);

  return (
    <div style={{ marginTop: "1em" }}>
      <ThemeProvider theme={() => getMuiTheme()}>
        <Table data={tableData} columns={columns} options={options}></Table>
      </ThemeProvider>
    </div>
  );
}
