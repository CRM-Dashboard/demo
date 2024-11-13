import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { useSelector } from "react-redux";
import GlobalFunctions from "./../../crm/utils/GlobalFunctions";
import { TableRow, TableCell, TableFooter, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CrmDatePicker from "../../crm/components/crmDatePicker/CrmDatePicker";
import dayjs from "dayjs";

const ITExpensesAndBudget = () => {
  const [month, setMonth] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);

  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const txtColour = GlobalFunctions.getThemeBasedDatailsColour(
    reducerData.ThemeReducer.mode
  );

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTableBodyCell: {
          styleOverrides: {
            root: {
              fontSize: "0.7rem",
            },
          },
        },
        MUIDataTableHeadCell: {
          styleOverrides: {
            data: {
              fontSize: "0.8rem",
              fontWeight: "bold",
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              padding: "7px",
            },
          },
        },
      },
    });

  const modifyResponse = (expenseData) => {
    const DataForTable = expenseData?.map((item) => {
      return [
        item?.maktx,
        GlobalFunctions.getFormatedNumber(item?.totalBudget),
        GlobalFunctions.getFormatedNumber(item?.mthExpense),
        GlobalFunctions.getFormatedNumber(item?.cumExpense),
        GlobalFunctions.getFormatedNumber(item?.commited),
        GlobalFunctions.getFormatedNumber(item?.projected),
        GlobalFunctions.getFormatedNumber(item?.perConsumed),
      ];
    });
    return DataForTable;
  };

  const getTableData = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/activity/getProjectTracker`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data[0].expense.length > 0) {
          setTableData(modifyResponse(data[0].expense));
        }
      });
  };

  useEffect(() => {
    getTableData();
  }, []);

  const columns = [
    {
      name: "On Going(Keeping Lights ON) Expenses",
    },
    {
      name: "IT Total Budget",
    },
    {
      name: "Monthly Expenses",
    },
    {
      name: "Cumulative till",
    },
    {
      name: "Commited Cost",
    },
    {
      name: "Projected",
    },
    {
      name: "% Consumed",
    },
  ];

  const options = {
    // expandableRows: true,
    pagination: false,
    print: false,
    download: false,
    search: false,
    filter: false,
    viewColumns: false,
    selectableRows: "none",
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
          return accu + Number(item.data[1]?.replaceAll(",", ""));
        }, 0);
      let sumMnthExpenses = opts.data
        .slice(startIndex, endIndex)
        .reduce((accu, item) => {
          return accu + Number(item.data[2]?.replaceAll(",", ""));
        }, 0);
      let sumCumTill = opts.data
        .slice(startIndex, endIndex)
        .reduce((accu, item) => {
          return accu + Number(item.data[3]?.replaceAll(",", ""));
        }, 0);
      let sumCommittedCost = opts.data
        .slice(startIndex, endIndex)
        .reduce((accu, item) => {
          return accu + Number(item.data[4]?.replaceAll(",", ""));
        }, 0);
      let sumProjected = opts.data
        .slice(startIndex, endIndex)
        .reduce((accu, item) => {
          return accu + Number(item.data[5]?.replaceAll(",", ""));
        }, 0);

      let sumConsumed = (sumCommittedCost / sumAmount) * 100;

      return (
        <>
          {tableData.length > 0 && (
            <TableFooter>
              <TableRow>
                {opts.columns.map((col, index) => {
                  if (col.display === "true") {
                    if (col.name === "On Going(Keeping Lights ON) Expenses") {
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
                    } else if (col.name === "IT Total Budget") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {GlobalFunctions.getFormatedNumber(sumAmount)}
                        </TableCell>
                      );
                    } else if (col.name === "Monthly Expenses") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {GlobalFunctions.getFormatedNumber(sumMnthExpenses)}
                        </TableCell>
                      );
                    } else if (col.name === "Cumulative till") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {GlobalFunctions.getFormatedNumber(sumCumTill)}
                        </TableCell>
                      );
                    } else if (col.name === "Commited Cost") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {GlobalFunctions.getFormatedNumber(sumCommittedCost)}
                        </TableCell>
                      );
                    } else if (col.name === "Projected") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {GlobalFunctions.getFormatedNumber(sumProjected)}
                        </TableCell>
                      );
                    } else if (col.name === "% Consumed") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {GlobalFunctions.getFormatedNumber(sumConsumed)}
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

  return (
    <Grid>
      <Grid
        container
        spacing={1}
        sx={{
          marginTop: "0.5em",
          marginBottom: "0.5em",
        }}
      >
        <Grid item sm={2} md={2} lg={3}>
          <CrmDatePicker
            id="month"
            name="month"
            label="Month"
            format="MMMM YYYY"
            views={["month", "year"]}
            value={dayjs(month)}
            onChange={(value) => {
              // const formattedDate = value
              //   ? dayjs(value).format("YYYY-MM-DD")
              //   : "";
              setMonth(value);
            }}
          />
        </Grid>
        <Grid item sm={2} md={2} lg={2}>
          <Button
            style={{
              backgroundColor: "#007FFF",
              fontFamily: "futura",
              borderRadius: "5px",
              fontSize: "15px",
              color: "white",
              marginTop: "0.2em",
              height: "2.2em",
              width: "4.5em",
            }}
            // sx={ selectedProjects?.toString()?.trim()?.length === 0 ? {} : {}}
            // disabled={
            //   selectedProjects?.toString()?.trim()?.length === 0
            // }
            // onClick={() => {
            //   getData();
            // }}
          >
            Go
          </Button>
        </Grid>
      </Grid>

      {tableData?.length > 0 && (
        <ThemeProvider theme={() => getMuiTheme()}>
          <MUIDataTable
            title={"Expenses and Budget"}
            data={tableData}
            style={{ width: "100%" }}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      )}
    </Grid>
  );
};

export default ITExpensesAndBudget;
