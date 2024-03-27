/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Table from "mui-datatables";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function InterestDetails() {
  const [tableData, setTableData] = useState([]);

  const reducerData = useSelector((state) => state);
  const userName = reducerData.LoginReducer.userName;
  const passWord = reducerData.LoginReducer.passWord;
  const OrderId = reducerData.searchBar.orderId;

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

  const calculateTotal = (index) => {
    let total = 0;
    tableData.forEach((row) => {
      total += parseFloat(row[index]); // Assuming currency format like "$1000"
    });

    return total.toFixed(2); // Format total as needed
  };

  const options = {
    selectableRows: "none",
    rowsPerPage: 100,
    elevation: 0,
    print: true,
    download: true,
    search: true,
    viewColumns: true,
    filter: true,
    customFooter: () => {
      return (
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{ fontWeight: "Bold" }}> Total : {calculateTotal(5)}</td>
          </tr>
        </tfoot>
      );
    },
  };

  const columns = [
    {
      name: "Sr. No",
      label: "Sr. No",
    },
    {
      name: "MilestoneStage",
      label: "MilestoneStage",
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
