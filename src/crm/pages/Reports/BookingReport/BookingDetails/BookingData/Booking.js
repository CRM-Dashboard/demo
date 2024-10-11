/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import Table from "mui-datatables";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material";
import { TableRow, TableCell, TableFooter } from "@mui/material";
import GlobalFunctions from "../../../../../utils/GlobalFunctions";
import CircularScreenLoader from "./../../../../../components/circularScreenLoader/CircularScreenLoader";

export default function Booking({ tableDetails, response, getFilteredData }) {
  const [page, setPage] = useState(0);
  const [totalGst, setTotalGst] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState();
  const [dataToUpdate, setDataToUpdate] = useState();
  const [sumInvoiceGst, setSumInvoiceGst] = useState(0);
  const [tableChange, setTableChange] = useState(false);
  const [sumInvoiceUnit, setSumInvoiceUnit] = useState(0);
  const [totalPaymentGst, setTotalPaymentGst] = useState(0);
  const [totalPaymentTds, setTotalPaymentTds] = useState(0);
  const [sumTotalInvoice, setSumTotalInvoice] = useState(0);
  const [totalPaymentUnit, setTotalPaymentUnit] = useState(0);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [totalStampRegAmt, setTotalStampRegAmt] = useState(0);
  const [totalAdminCharges, setTotalAdminCharges] = useState(0);
  const [totalAdminChargesGst, setTotalAdminChargesGst] = useState(0);
  const [totalAllInclusiveVal, setTotalAllInclusiveVal] = useState(0);
  const [totalConsiderationValue, setTotalConsiderationValue] = useState(0);
  const [totalStampRegAmtRec, setTotalStampRegAmtRec] = useState(0);
  const [totalStampRegAmtBal, setTotalStampRegAmtBal] = useState(0);
  const [totalPaymentTotal, settotalPaymentTotal] = useState(0);

  function formatToTwoDecimals(number) {
    return parseFloat(number?.toFixed(2));
  }

  const tableRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData?.dashboard?.project?.projectId;
  const ref = useRef(null);

  const modifyFilterResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return item.data;
    });

    const sumCV = res?.reduce((sum, item) => sum + (item.data[14] || 0), 0); // Calculate total sum of cvVal
    setTotalConsiderationValue(sumCV); // Update state with total value
    const sumGst = res?.reduce((sum, item) => sum + (item.data[15] || 0), 0);
    setTotalGst(sumGst);
    const sumAdminCharge = res?.reduce(
      (sum, item) => sum + (item.data[17] || 0),
      0
    );
    setTotalAdminCharges(formatToTwoDecimals(sumAdminCharge));
    const sumAdminChargeGST = res?.reduce(
      (sum, item) => sum + (Number(item.data[18]?.replaceAll(",", "")) || 0),
      0
    );
    setTotalAdminChargesGst(Math.round(sumAdminChargeGST));
    const sumAllInclusive = res?.reduce(
      (sum, item) => sum + (Number(item.data[20]?.replaceAll(",", "")) || 0),
      0
    );
    setTotalAllInclusiveVal(sumAllInclusive);
    //Remaining updations
    const sumAllTotalStampReg = res?.reduce(
      (sum, item) => sum + (item.data[21] || 0),
      0
    );
    setTotalStampRegAmt(sumAllTotalStampReg);
    const sumStampRegReceived = res?.reduce(
      (sum, item) => sum + (item.data[22] || 0),
      0
    );
    setTotalStampRegAmtRec(sumStampRegReceived);
    const sumStampRegAmtBal = res?.reduce(
      (sum, item) => sum + (item.data[23] || 0),
      0
    );
    setTotalStampRegAmtBal(sumStampRegAmtBal);
    const TotalInvoice = res?.reduce(
      (sum, item) => sum + (Number(item.data[27]?.replaceAll(",", "")) || 0),
      0
    );
    setSumTotalInvoice(TotalInvoice);
    const TotalInvoiceUnit = res?.reduce(
      (sum, item) => sum + (Number(item.data[25]?.replaceAll(",", "")) || 0),
      0
    );
    setSumInvoiceUnit(TotalInvoiceUnit);
    const TotalInvoiceGst = res?.reduce(
      (sum, item) => sum + (Number(item.data[26]?.replaceAll(",", "")) || 0),
      0
    );
    setSumInvoiceGst(TotalInvoiceGst);
    const sumPaymentUnit = res?.reduce(
      (sum, item) => sum + (Number(item.data[29]?.replaceAll(",", "")) || 0),
      0
    );
    setTotalPaymentUnit(sumPaymentUnit);
    const sumPaymentGst = res?.reduce(
      (sum, item) => sum + (Number(item.data[30]?.replaceAll(",", "")) || 0),
      0
    );
    setTotalPaymentGst(sumPaymentGst);
    const sumPaymentTds = res?.reduce(
      (sum, item) => sum + (Number(item.data[31]?.replaceAll(",", "")) || 0),
      0
    );
    setTotalPaymentTds(sumPaymentTds);
    const sumPaymentTotal = res?.reduce(
      (sum, item) => sum + (Number(item.data[32]?.replaceAll(",", "")) || 0),
      0
    );
    settotalPaymentTotal(sumPaymentTotal);
    console.log("%%%%%%%%%%%%%%%filtered Response", modifiedResponse);

    return modifiedResponse;
  };
  useEffect(() => {
    if (tableChange === true) {
      const filteredData = dataToUpdate;
      const updatedData = modifyFilterResponse(filteredData);
      setTableData(updatedData);
    } else {
      setTableData(modifyResponse(tableDetails));
    }
  }, [tableChange, dataToUpdate]);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.replaceData(tableData); // Properly update data in the table
    }
  }, [tableData]);

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
              backgroundColor: "#62b4ff",
              color: "white",
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
    print: true,
    filter: true,
    search: true,
    elevation: 0,
    download: true,
    rowsPerPage: 100, //tableData?.length,
    pagination: false,
    viewColumns: true,
    stickyHeader: true,
    selectableRows: "none",
    count: tableData?.length,
    tableBodyHeight: "400px",
    rowsPerPageOptions: tableData?.length,
    // onTableChange: (action, tableState) => {
    //   console.log("###########action", action);
    //   if (action === "filterChange") {
    //     console.log("############tableState.data", tableState);
    //     // Perform data processing and totals update here
    //     setDataToUpdate(tableState.displayData);
    //     setTableChange(!true);
    //   }
    // },
    // onFilterChange: (changedColumn, filterList) => {
    //   const anyFiltersApplied = filterList.some(
    //     (filters) => filters?.length > 0
    //   );

    //   if (anyFiltersApplied) {
    //     const filteredData = dataToUpdate; // Use tableState.data to get filtered data
    //     const updatedData = modifyFilterResponse(filteredData);
    //     setTableData(updatedData);
    //   } else {
    //     setTableData(modifyResponse(tableDetails));
    //   }
    //   // setFiltersApplied(anyFiltersApplied);
    // },
    onTableChange: (action, tableState) => {
      if (action === "filterChange") {
        setDataToUpdate(tableState.displayData);
        setTableChange(!tableChange); // Properly toggle tableChange state
      }
    },
    onFilterChange: (changedColumn, filterList) => {
      const anyFiltersApplied = filterList.some(
        (filters) => filters?.length > 0
      );
      if (anyFiltersApplied) {
        const filteredData = dataToUpdate;
        const updatedData = modifyFilterResponse(filteredData);
        setTableData(updatedData);
      } else {
        setTableData(modifyResponse(tableDetails));
      }
    },
    onChangeRowsPerPage(numberOfRows) {
      setRowsPerPage(numberOfRows);
    },
    onChangePage(page) {
      setPage(page);
    },
    customTableBodyFooterRender: (opts) => {
      // const startIndex = page * rowsPerPage;
      // const endIndex = (page + 14) * rowsPerPage;

      return (
        <>
          {tableData?.length > 0 && (
            <TableFooter
              sx={{
                position: "sticky",
                bottom: 0,
                backgroundColor: "white",
                zIndex: 1,
              }}
            >
              <TableRow>
                {opts.columns.map((col, index) => {
                  // If the column is set to display
                  if (col.display === "true") {
                    // Check for specific column names to display totals or "Total" label
                    if (col.name === "Project Name") {
                      return (
                        <TableCell
                          style={{
                            padding: "1em",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          Total
                        </TableCell>
                      );
                    } else if (col.name === "Consideration Value") {
                      return (
                        <TableCell
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {totalConsiderationValue}
                        </TableCell>
                      );
                    } else if (col.name === "GST") {
                      return (
                        <TableCell
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {totalGst}
                        </TableCell>
                      );
                    } else if (col.name === "Admin Charges") {
                      return (
                        <TableCell
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {totalAdminCharges}
                        </TableCell>
                      );
                    } else if (col.name === "Admin Charges GST") {
                      return (
                        <TableCell
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {totalAdminChargesGst}
                        </TableCell>
                      );
                    } else if (col.name === "Stamp Registration Amount") {
                      return (
                        <TableCell
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {totalStampRegAmt}
                        </TableCell>
                      );
                    } else if (col.name === "Stamp Registration Received") {
                      return (
                        <TableCell
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {totalStampRegAmtRec}
                        </TableCell>
                      );
                    } else if (col.name === "Stamp Registration Balance") {
                      return (
                        <TableCell
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {totalStampRegAmtBal}
                        </TableCell>
                      );
                    } else if (col.name === "All Inclusive Value") {
                      return (
                        <TableCell
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {totalAllInclusiveVal}
                        </TableCell>
                      );
                    } else if (col.name === "Invoice Total") {
                      return (
                        <TableCell
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {sumTotalInvoice}
                        </TableCell>
                      );
                    } else if (col.name === "Invoice GST") {
                      return (
                        <TableCell
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {sumInvoiceGst}
                        </TableCell>
                      );
                    } else if (col.name === "Invoice Unit") {
                      return (
                        <TableCell
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {sumInvoiceUnit}
                        </TableCell>
                      );
                    } else if (col.name === "Payment Unit") {
                      return (
                        <TableCell
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {totalPaymentUnit}
                        </TableCell>
                      );
                    } else if (col.name === "Payment GST") {
                      return (
                        <TableCell
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {totalPaymentGst}
                        </TableCell>
                      );
                    } else if (col.name === "Payment TDS") {
                      return (
                        <TableCell
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {totalPaymentTds}
                        </TableCell>
                      );
                    } else if (col.name === "Payment Total") {
                      return (
                        <TableCell
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {totalPaymentTotal}
                        </TableCell>
                      );
                    } else {
                      // For all other columns, return an empty TableCell to preserve layout
                      return <TableCell key={index}></TableCell>;
                    }
                  }
                  return null; // If column is not set to display, return null
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
      name: "Project Name",
    },
    {
      name: "Building",
    },
    {
      name: "Flat/ Unit No.",
    },
    {
      name: "Property",
    },
    {
      name: "Application Date",
    },
    {
      name: "Gatekeeper Received Date",
    },
    {
      name: "CRM Received Date",
    },
    {
      name: "Confirmation Date",
    },
    {
      name: "Confirmation Status",
    },
    {
      name: "Possession Date",
    },
    {
      name: "Maintenance Start Date",
    },
    {
      name: "Warranty Start Date",
    },
    {
      name: "Warranty End Date",
    },
    {
      name: "Customer Name",
    },
    {
      name: "Consideration Value",
    },
    {
      name: "GST",
    },
    {
      name: "GST %",
    },
    {
      name: "Admin Charges",
    },
    {
      name: "Admin Charges GST",
    },
    {
      name: "Admin Charges GST %",
    },
    {
      name: "All Inclusive Value",
    },
    {
      name: "Stamp Registration Amount",
    },
    {
      name: "Stamp Registration Received",
    },
    {
      name: "Stamp Registration Balance",
    },
    {
      name: "Registration Date",
    },
    {
      name: "Invoice Unit",
    },
    {
      name: "Invoice GST",
    },
    {
      name: "Invoice Total",
    },
    {
      name: "Invoice %",
    },
    {
      name: "Payment Unit",
    },
    {
      name: "Payment GST",
    },
    {
      name: "Payment TDS",
    },
    {
      name: "Payment Total",
    },
    {
      name: "Payment %",
    },
    {
      name: "Balance Unit",
    },
    {
      name: "Balance GST",
    },
    {
      name: "Balance Total",
    },
    {
      name: "Balance %",
    },
    {
      name: "Parking Type",
    },
    {
      name: "Parking Floor",
    },
    {
      name: "Parking Location",
    },
    {
      name: "Parking Area",
    },
    {
      name: "Parking Number",
    },
    {
      name: "Parking in Sq.mt.",
    },
    {
      name: "Parking Height",
    },
    {
      name: "Sales Order No.",
    },
    {
      name: "CRM",
    },
    {
      name: "Scheme",
    },
    {
      name: "Scheme Start",
    },
    {
      name: "Scheme End",
    },
    {
      name: "Scheme Cost",
    },
    {
      name: "Self Fund",
    },
    {
      name: "Special Payment",
    },
    {
      name: "Due Interest",
    },
    {
      name: "Waived Interest",
    },
    {
      name: "Paid Interest",
    },
    {
      name: "Balanced Interest",
    },
    {
      name: "Sales TAT",
    },
    {
      name: "Gatekeeper TAT",
    },
    {
      name: "CRM TAT",
    },
    {
      name: "Saleable Area",
    },
    {
      name: "Carpet Area",
    },
    {
      name: "Rera Area",
    },
    {
      name: "Possession Status",
    },
    {
      name: "Customer No.",
    },
    {
      name: "Unit material No.",
    },
    {
      name: "Parking material No.",
    },
  ];

  // const setSearchData = (result) => {
  //   if (result && result.length > 0) {
  //     const res = result[0];
  //     dispatch(searchbarActions.setOrderId(res.orderId));
  //     dispatch(DashboardAction.setCustomerContactNumber(res.MobileNo));
  //     dispatch(DashboardAction.setCustomerEmailID(res.email));
  //     dispatch(
  //       searchbarActions.setSearchKey(
  //         res.name ? res.name + "  -  " + res.unit : ""
  //       )
  //     );

  //     const formData = new FormData();
  //     formData.append("orderId", res.orderId);

  //     fetch(process.env.REACT_APP_SERVER_URL + "/api/topBar/soa", {
  //       method: "POST",
  //       body: formData,
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         dispatch(searchbarActions.setAccountStmt(data.StatementOfAccount[0]));
  //       });
  //   }
  // };

  // const handleClick = useCallback(
  //   debounce((orderID) => {
  //     if (orderID === "") {
  //       dispatch(searchbarActions.setAccountStmt({}));
  //       dispatch(searchbarActions.setSearchKey(""));
  //       dispatch(searchbarActions.setOrderId(""));
  //       dispatch(DashboardAction.setCustomerContactNumber(""));
  //       dispatch(DashboardAction.setCustomerEmailID(""));
  //     } else {
  //       if (projectId) {
  //         const formData = new FormData();
  //         formData.append("projectId", projectId);
  //         formData.append("userName", userName);
  //         formData.append("passWord", passWord);

  //         fetch(process.env.REACT_APP_SERVER_URL + "/api/topBar/search", {
  //           method: "POST",
  //           body: formData,
  //         })
  //           .then((response) => response.json())
  //           .then((json) => {
  //             const results = json?.filter((customer) => {
  //               return customer.orderId === orderID;
  //             });
  //             setSearchData(results);
  //           });
  //       }
  //     }
  //   }, 300),
  //   [dispatch, projectId, passWord, userName]
  // );

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.project,
        item?.building,
        // flatno: (
        //   <Typography
        //     style={{ color: "blue", cursor: "pointer" }}
        //     onClick={() => {
        //       navigate("/crm/crm/dashboard");
        //       dispatch(DashboardAction.setShouldShowBookingDetails(false));
        //       handleClick(item?.orderId);
        //     }}
        //   >
        //     {item?.flatno}
        //   </Typography>
        // ),
        item?.flatno,
        item?.property,
        item?.appDt,
        item?.salToCrmDt,
        item?.crmRecDt,
        item?.confDt,
        item?.confStatus,
        item?.possDt,
        item?.zmaintdt,
        item?.zzwstdt,
        item?.zzwendt,
        item?.customerName,
        item?.cvVal,
        item?.gst,
        item?.gstPer,
        item?.other,
        GlobalFunctions.getFormatedNumber(item?.gstOther),
        item?.gstOtherPer,
        GlobalFunctions.getFormatedNumber(item?.allIncVal),
        item?.stampRegAmt,
        item?.stampRegReceived,
        item?.stampRegBalance,
        item?.regDt,
        GlobalFunctions.getFormatedNumber(item?.invUnit),
        GlobalFunctions.getFormatedNumber(item?.invGst),
        GlobalFunctions.getFormatedNumber(item?.invTot),
        item?.invPer,
        GlobalFunctions.getFormatedNumber(item?.pmtUnit),
        GlobalFunctions.getFormatedNumber(item?.pmtGst),
        GlobalFunctions.getFormatedNumber(item?.pmtTds),
        GlobalFunctions.getFormatedNumber(item?.pmtTot),
        item?.pmtPer,
        GlobalFunctions.getFormatedNumber(item?.balUnit),
        GlobalFunctions.getFormatedNumber(item?.balGst),
        GlobalFunctions.getFormatedNumber(item?.balTot),
        item?.balPer,
        item?.prkType,
        item?.flrText,
        item?.parkinglocation,
        item?.parkingareatext,
        item?.parkno,
        item?.parkaream2,
        item?.parkheight,
        item?.orderId,
        item?.crmid,
        item?.scheme,
        item?.schemeStart,
        item?.schemeEnd,
        item?.schemeCost,
        item?.selfFund,
        item?.specialPmtTxt,
        item?.dueInterest,
        item?.waivedInterest,
        item?.paidInterest,
        item?.balanceInterest,
        item?.salTat,
        item?.gateTat,
        item?.crmTat,
        item?.saleableArea,
        item?.carpetArea,
        item?.reraArea,
        item?.possStatus,
        item?.kunnr,
        item?.matnr,
        item?.matnrPrk,
      ];
    });
    const sumCV = res?.reduce((sum, item) => sum + (item?.cvVal || 0), 0); // Calculate total sum of cvVal
    setTotalConsiderationValue(formatToTwoDecimals(sumCV)); // Update state with total value
    const sumGst = res?.reduce((sum, item) => sum + (item?.gst || 0), 0);
    setTotalGst(formatToTwoDecimals(sumGst));
    const sumAdminCharge = res?.reduce(
      (sum, item) => sum + (item?.other || 0),
      0
    );
    setTotalAdminCharges(formatToTwoDecimals(sumAdminCharge));
    const sumAdminChargeGST = res?.reduce(
      (sum, item) => sum + (item?.gstOther || 0),
      0
    );
    setTotalAdminChargesGst(formatToTwoDecimals(sumAdminChargeGST));
    const sumAllInclusive = res?.reduce(
      (sum, item) => sum + (item?.allIncVal || 0),
      0
    );
    setTotalAllInclusiveVal(formatToTwoDecimals(sumAllInclusive));
    const sumAllTotalStampReg = res?.reduce(
      (sum, item) => sum + (item?.stampRegAmt || 0),
      0
    );
    setTotalStampRegAmt(formatToTwoDecimals(sumAllTotalStampReg));
    const sumStampRegReceived = res?.reduce(
      (sum, item) => sum + (item?.stampRegReceived || 0),
      0
    );
    setTotalStampRegAmtRec(formatToTwoDecimals(sumStampRegReceived));
    const sumStampRegAmtBal = res?.reduce(
      (sum, item) => sum + (item?.stampRegBalance || 0),
      0
    );
    setTotalStampRegAmtBal(formatToTwoDecimals(sumStampRegAmtBal));
    const TotalInvoice = res?.reduce(
      (sum, item) => sum + (item?.invTot || 0),
      0
    );
    setSumTotalInvoice(formatToTwoDecimals(TotalInvoice));
    const TotalInvoiceUnit = res?.reduce(
      (sum, item) => sum + (item?.invUnit || 0),
      0
    );
    setSumInvoiceUnit(formatToTwoDecimals(TotalInvoiceUnit));
    const TotalInvoiceGst = res?.reduce(
      (sum, item) => sum + (item?.invGst || 0),
      0
    );
    setSumInvoiceGst(formatToTwoDecimals(TotalInvoiceGst));
    const sumPaymentUnit = res?.reduce(
      (sum, item) => sum + (item?.pmtUnit || 0),
      0
    );
    setTotalPaymentUnit(formatToTwoDecimals(sumPaymentUnit));
    const sumPaymentGst = res?.reduce(
      (sum, item) => sum + (item?.pmtGst || 0),
      0
    );
    setTotalPaymentGst(formatToTwoDecimals(sumPaymentGst));
    const sumPaymentTds = res?.reduce(
      (sum, item) => sum + (item?.pmtTds || 0),
      0
    );
    setTotalPaymentTds(formatToTwoDecimals(sumPaymentTds));
    const sumPaymentTotal = res?.reduce(
      (sum, item) => sum + (item?.pmtTot || 0),
      0
    );
    settotalPaymentTotal(formatToTwoDecimals(sumPaymentTotal));
    console.log("**************modifiedResponse", modifiedResponse);

    return modifiedResponse;
  };

  useEffect(() => {
    setLoading(true);
    const data = getFilteredData(response);
    setTableData(modifyResponse(data));
    // setTableData([data]);
    setLoading(false);
  }, [reducerData?.BookingReducer?.BookingsDetailsFilter, tableDetails]);

  useEffect(() => {
    setLoading(true);
    // setTableData([tableDetails]);
    setTableData(modifyResponse(tableDetails));
    setLoading(false);
  }, []);

  return (
    <div style={{ marginTop: "0.5em" }} ref={ref}>
      {!loading ? (
        <ThemeProvider theme={getMuiTheme}>
          <Table data={tableData} columns={columns} options={options}></Table>
        </ThemeProvider>
      ) : (
        <CircularScreenLoader />
      )}
    </div>
  );
}
