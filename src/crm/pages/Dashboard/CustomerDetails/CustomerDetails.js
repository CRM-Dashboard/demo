/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Graph from "./Graph";
import "./CustomerDetails.css";
import Chart from "react-apexcharts";
import { useDispatch } from "react-redux";
import Table from "mui-datatables";
import TodayActivity from "./TodayActivity";
import TodaysBirthday from "./TodaysBirthday";
import { useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import { Grid, Typography, CircularProgress, Box } from "@mui/material";
import AcceptancePending from "./AcceptancePending";
import RegistrationPending from "./RegistrationPending";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import GlobalFunctions from "./../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StatusCard from "../../../components/statusCard/StatusCard";
import dashboardActions from "../DashboardReducer.js/DashboardActions";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";
import axios from "axios";

export default function CustomerDetails() {
  const [unitData, setUnitData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setTableResponse] = useState([]);
  const [birthdayData, setBirthdayData] = useState();
  const [numberOfCust, setNumberOfCust] = useState(0);
  const [ndcTableData, setNdcTableData] = useState([]);
  const [customerDetails, setCustomerDetails] = useState();
  const [acceptancePendingData, setAcceptancePendingData] = useState([]);
  const [searchValueAvailable, setSearchValueAvailable] = useState(false);
  const [registrationPendingData, setReistrationPendingData] = useState([]);
  const [isNdcLoading, setIsNdcLoading] = useState(true);
  const [cardDataFromNdc, setCardDataFromNdc] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reducerData = useSelector((state) => state);
  const crmId = reducerData.dashboard.crmId;
  const OrderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData?.dashboard?.project?.projectId;
  const accountStatement = reducerData.searchBar.accountStatement;
  // const searchValueAvailable = reducerData.searchBar.searchKey ? true : false;

  console.log(
    "\n",
    "*********",
    "\n",
    "accountStatement",
    accountStatement,
    "\n",
    "searchValueAvailable",
    searchValueAvailable,
    "\n",
    "customerDetails",
    customerDetails,
    "\n",
    "ndcTableData",
    ndcTableData,
    "\n",
    "************",
    "\n"
  );
  // console.log("accountStatement",accountStatement)
  // console.log("searchValueAvailable",searchValueAvailable)
  // console.log("customerDetails",customerDetails)
  // console.log("ndcTableData",ndcTableData)

  const getDetails = () => {
    // setLoading(true);
    // if (projectId) {
    const formData = new FormData();
    if (OrderId && !crmId) {
      formData.append("orderId", OrderId);
      formData.append("crmId", "");
    }
    if (!OrderId && crmId) {
      formData.append("orderId", "");
      formData.append("crmId", crmId);
    }
    if (OrderId && crmId) {
      formData.append("orderId", OrderId);
      formData.append("crmId", "");
    }
    if (!OrderId && !crmId) {
      formData.append("orderId", "");
      formData.append("crmId", userName?.toUpperCase());
    }
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    // !OrderId && formData.append("crmId", crmId);
    fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/summary", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setCustomerDetails(data[0].summary[0]);
        setBirthdayData(data[0]);
        setAcceptancePendingData(data[0].acceptancePending);
        setReistrationPendingData(data[0].registrationPending);

        if (
          reducerData.dashboard.shouldShowSentimentAnalysis &&
          reducerData?.dashboard?.shouldShowHappinessMeter
        ) {
          setLoading(false);
        }
      });
    // }
  };

  const getBookingDetails = () => {
    if (OrderId) {
      const formData = new FormData();
      formData.append("orderId", OrderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/so", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data[0].so[0].vbeln) {
            dispatch(dashboardActions.setProjectId(data[0].so[0].werks));
            setUnitData(data[0].so[0]);
            // setLoading(false);
          }
        });
    }
  };

  const modifyResponse = (res = []) => {
    const modifiedResponse =
      res &&
      res?.map((item) => {
        return [
          item?.head === "Sub Total 1" ||
          item?.head === "Sub Total 2" ||
          item?.head === "Grand Total" ? (
            <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
              {item?.head}
            </Typography>
          ) : (
            item?.head
          ),
          item?.head === "Sub Total 1" ||
          item?.head === "Sub Total 2" ||
          item?.head === "Grand Total" ? (
            <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
              {item?.payable}
            </Typography>
          ) : (
            item?.payable
          ),
          item?.head === "Sub Total 1" ||
          item?.head === "Sub Total 2" ||
          item?.head === "Grand Total" ? (
            <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
              {item?.invoiced}
            </Typography>
          ) : (
            item?.invoiced
          ),
          item?.head === "Sub Total 1" ||
          item?.head === "Sub Total 2" ||
          item?.head === "Grand Total" ? (
            <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
              {item?.payment}
            </Typography>
          ) : (
            item?.payment
          ),
          item?.head === "Sub Total 1" ||
          item?.head === "Sub Total 2" ||
          item?.head === "Grand Total" ? (
            <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
              {item?.tds}
            </Typography>
          ) : (
            item?.tds
          ),
          item?.head === "Sub Total 1" ||
          item?.head === "Sub Total 2" ||
          item?.head === "Grand Total" ? (
            <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
              {item?.totalPayment}
            </Typography>
          ) : (
            item?.totalPayment
          ),
          item?.head === "Sub Total 1" ||
          item?.head === "Sub Total 2" ||
          item?.head === "Grand Total" ? (
            <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
              {item?.credit}
            </Typography>
          ) : (
            item?.credit
          ),
          item?.head === "Sub Total 1" ||
          item?.head === "Sub Total 2" ||
          item?.head === "Grand Total" ? (
            <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
              {item?.outstanding}
            </Typography>
          ) : (
            item?.outstanding
          ),
          item?.head === "Sub Total 1" ||
          item?.head === "Sub Total 2" ||
          item?.head === "Grand Total" ? (
            <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
              {item?.unbilled}
            </Typography>
          ) : (
            item?.unbilled
          ),
        ];
      });
    return modifiedResponse;
  };

  const columns = [
    {
      name: "Heads",
    },
    {
      name: "Total Value(A)",
    },
    {
      name: "Invoiced Raised Till Date(B)",
    },
    {
      name: "Amount Received Till Date",
    },
    {
      name: "TDS Paid Till Date",
    },
    {
      name: "Total (Payment Received + TDS ) (C)",
    },
    {
      name: "Credit Notes / Discounts (D)",
    },
    {
      name: "Current Due (B-C-D)",
    },
    {
      name: "Balance Invoice To Be Raised (A-B) ",
    },
  ];
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
    selectableRows: "none",
    rowsPerPage: ndcTableData?.length,
    pagination: false,
    elevation: 0,
    print: false,
    download: false,
    search: false,
    viewColumns: false,
    filter: false,
  };

  const getNdcReportDetails = async () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    if (OrderId && !crmId) {
      formData.append("orderId", OrderId);
      formData.append("crmId", "");
    }
    if (!OrderId && crmId) {
      formData.append("orderId", "");
      formData.append("crmId", crmId);
    }
    if (OrderId && crmId) {
      formData.append("orderId", OrderId);
      formData.append("crmId", "");
    }
    if (!OrderId && !crmId) {
      formData.append("orderId", "");
      formData.append("crmId", userName?.toUpperCase());
    }

    // if (OrderId) {
    try {
      setIsNdcLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/dashboard/getNdcData`,
        formData
      );
      const data = response.data;
      setTableResponse(data);
      setNdcTableData(modifyResponse(data));
      const filterData = data?.filter(
        (row) => row.head === "Consideration Value"
      );
      console.log("filterData", filterData[0]);
      // if (
      //   searchValueAvailable === false &&
      //   filterData &&
      //   filterData?.length > 0
      // ) {
      setCardDataFromNdc(filterData[0]);
      // }

      console.log("##########ndc data", data);
    } catch (error) {
      console.error("Error fetching NDC data:", error);
    } finally {
      setIsNdcLoading(false);
    }
    // }
  };

  useEffect(() => {
    getDetails();
    getNdcReportDetails();
  }, [crmId]);

  useEffect(() => {
    setSearchValueAvailable(reducerData.searchBar.searchKey ? true : false);
  }, [reducerData.searchBar.searchKey]);

  useEffect(() => {
    if (reducerData?.searchBar?.accountStatement) {
      //   if (Object.keys(reducerData?.searchBar?.accountStatement).length !== 0) {
      //     setCustomerDetails(reducerData?.searchBar?.accountStatement);
      //   } else {
      //     getDetails();
      //   }
      // } else {
      getDetails();
    }
  }, [reducerData.searchBar.accountStatement]);

  useEffect(() => {
    getDetails();
    getBookingDetails();
    getNdcReportDetails();
  }, [OrderId]);

  useEffect(() => {
    getBookingDetails();
    getNdcReportDetails();
  }, []);

  useEffect(() => {
    // setLoading(true);

    if (
      reducerData?.searchBar?.accountStatement &&
      Object.keys(reducerData?.searchBar?.accountStatement)?.length !== 0
    ) {
      setCustomerDetails(reducerData.searchBar.accountStatement);
      setLoading(false);
    }

    if (OrderId) {
      const formData = new FormData();
      !OrderId && formData.append("crmId", crmId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("orderId", OrderId);

      fetch(process.env.REACT_APP_SERVER_URL + `/api/dashboard/getcustomer`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setNumberOfCust(data[0]?.customerdata?.length);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
    }
  }, [reducerData?.searchBar?.accountStatement, projectId, OrderId, crmId]);

  const getPaidAmt = () => {
    const bigNumber1 = parseFloat(
      accountStatement?.ReceivedAmount?.replace(/,/g, "")
    );
    const bignumber2 = parseFloat(
      accountStatement?.TDSAmount?.replace(/,/g, "")
    );
    const PaidAmt = bigNumber1 + bignumber2;
    return PaidAmt;
  };

  const getInvoicePercentage = () => {
    let invoiceAmount;
    let considerationAmount;
    if (searchValueAvailable) {
      considerationAmount = parseFloat(
        accountStatement.AgreementValue?.replace(/,/g, "")
      );
      invoiceAmount = parseFloat(
        accountStatement?.DueAmount?.replace(/,/g, "")
      );
    } else {
      // considerationAmount = parseFloat(
      //   cardDataFromNdc?.payable?.replace(/,/g, "")
      // );

      // invoiceAmount = parseFloat(cardDataFromNdc?.invoiced?.replace(/,/g, ""));
      considerationAmount = cardDataFromNdc?.payable;
      invoiceAmount = cardDataFromNdc?.invoiced;
    }
    const percentage = ((invoiceAmount / considerationAmount) * 100).toFixed(0);

    return percentage;
  };

  const getPaidPercentage = () => {
    let paidAmount;
    let invoiceAmount;
    if (searchValueAvailable) {
      paidAmount = parseFloat(
        accountStatement?.AgreementValue?.replace(/,/g, "")
      );
      invoiceAmount = parseFloat(
        accountStatement?.DueAmount?.replace(/,/g, "")
      );
    } else {
      paidAmount = cardDataFromNdc?.totalPayment;
      invoiceAmount = cardDataFromNdc?.payable;
    }

    const percentage = ((paidAmount / invoiceAmount) * 100).toFixed(0);
    return percentage;
  };

  const getOutstandingPercentage = () => {
    if (searchValueAvailable) {
      if (customerDetails?.BalanceAmount && customerDetails?.DueAmount) {
        const oustadingAmount = parseFloat(
          customerDetails?.BalanceAmount?.replace(/,/g, "")
        );

        const invoiceAmount = parseFloat(
          customerDetails?.DueAmount?.replace(/,/g, "")
        );

        const percentage = ((oustadingAmount / invoiceAmount) * 100).toFixed(0);

        return percentage < 0 ? 0 : percentage;
      } else {
        return 0;
      }
    } else {
      let outstandingAmt = cardDataFromNdc?.outstanding;
      let total = cardDataFromNdc?.payable;

      let result = ((outstandingAmt / total) * 100).toFixed(1);
      return result;
    }
  };

  const getUpcomingPercentage = () => {
    var considerationAmount;
    var upcomingAmount;
    if (searchValueAvailable) {
      considerationAmount = parseFloat(
        accountStatement?.AgreementValue?.replace(/,/g, "")
      );
      upcomingAmount = parseFloat(
        accountStatement.PossessionBalance?.replace(/,/g, "")
      );
    } else {
      considerationAmount = cardDataFromNdc?.payable;

      upcomingAmount = cardDataFromNdc?.unbilled;
    }

    const percentage = ((upcomingAmount / considerationAmount) * 100).toFixed(
      0
    );

    return percentage < 0 ? 0 : percentage;
  };

  const circleInvoice = {
    series: [
      getInvoicePercentage() ? getInvoicePercentage() : 0,
      // searchValueAvailable
      //   ? getInvoicePercentage() !== undefined
      //     ? getInvoicePercentage()
      //     : 0
      // : // : customerDetails?.InvoicePercent !== undefined
      // ? customerDetails?.InvoicePercent
      // 0,
    ],

    options: {
      chart: {
        height: "100%",
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "50%",
          },
          dataLabels: {
            showOn: "always",
            name: {
              show: false,
              color: "#888",
              fontSize: "11px",
            },
            value: {
              offsetY: 1,
              color: "#111",
              fontSize: "11px",
              show: true,
            },
          },
        },
      },
    },
  };

  const circlePaid = {
    series: [
      getPaidPercentage() ? getPaidPercentage() : 0,
      // searchValueAvailable
      //   ? getPaidPercentage() !== undefined
      //     ? getPaidPercentage()
      //     : 0
      //   : customerDetails?.PaidPercent !== undefined
      //   ? customerDetails?.PaidPercent
      //   : 0,
    ],

    options: {
      chart: {
        height: "100%",
        type: "radialBar",
      },
      fill: {
        colors: ["#1cbd00"],
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "50%",
          },
          dataLabels: {
            showOn: "always",
            name: {
              show: false,
              color: "#888",
              fontSize: "11px",
            },
            value: {
              offsetY: -1,
              color: "#111",
              fontSize: "11px",
              show: true,
            },
          },
        },
      },
    },
  };

  const circleOut = {
    series: [
      getOutstandingPercentage ? getOutstandingPercentage() : 0,
      // searchValueAvailable
      //   ? getOutstandingPercentage() !== undefined
      //     ? getOutstandingPercentage()
      //     : 0
      //   : customerDetails?.BalancePercent !== undefined
      //   ? customerDetails?.BalancePercent
      //   : 0,
    ],

    options: {
      chart: {
        height: "100%",
        type: "radialBar",
      },
      fill: {
        colors: ["#fb0b12"],
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "50%",
          },

          dataLabels: {
            showOn: "always",
            name: {
              show: false,
              color: "#888",
              fontSize: "11px",
            },
            value: {
              offsetY: -1,
              color: "#111",
              fontSize: "11px",
              show: true,
            },
          },
        },
      },
    },
  };

  const circleUp = {
    series: [
      getUpcomingPercentage() ? getUpcomingPercentage() : 0,
      // searchValueAvailable
      //   ? getUpcomingPercentage() !== undefined
      //     ? getUpcomingPercentage()
      //     : 0
      //   : customerDetails?.UpcomingPercent !== undefined
      //   ? customerDetails?.UpcomingPercent
      //   : 0,
    ],

    options: {
      chart: {
        height: "100%",
        type: "radialBar",
      },
      fill: {
        colors: ["#FFA500"],
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "50%",
          },

          dataLabels: {
            showOn: "always",
            name: {
              show: false,
              color: "#888",
              fontSize: "11px",
            },
            value: {
              offsetY: -1,
              color: "#111",
              fontSize: "11px",
              show: true,
            },
          },
        },
      },
    },
  };

  // function displayIncreasingNumbers(
  //   currentVal,
  //   targetNumber,
  //   updatingFunction
  // ) {
  //   let currentNumber = currentVal;

  //   const intervalId = setInterval(() => {
  //     updatingFunction(() => {
  //       currentNumber = currentNumber + 1;

  //       if (currentNumber === targetNumber) {
  //         clearInterval(intervalId);
  //       }

  //       return currentNumber;
  //     });
  //   }, 5); // Interval duration set to 1 second
  // }

  const CardData = {
    column1: [
      {
        gridStyle: { cursor: "pointer" },
        onClickHandle: () => {}, //navigate("/crm/crm/bookingReport"
        count: searchValueAvailable
          ? "₹" + GlobalFunctions.getFormatedNumber(customerDetails?.cvVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.cvVal) + "Cr",
        title: "Consideration Amount",
      },
      {
        gridStyle: { cursor: "pointer" },
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" + GlobalFunctions.getFormatedNumber(customerDetails?.gstVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.gstVal) + "Cr",
        title: "GST Value",
      },
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" + GlobalFunctions.getFormatedNumber(customerDetails?.otherVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.otherVal) + "Cr",
        title: "Other Amount",
      },
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" +
            GlobalFunctions.getFormatedNumber(customerDetails?.otherGstVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.otherGstVal) +
            "Cr",
        title: "Other GST Value",
      },
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" + GlobalFunctions.getFormatedNumber(customerDetails?.totalVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.totalVal) + "Cr",
        title: "Total Value",
      },
    ],
    column2: [
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" + GlobalFunctions.getFormatedNumber(customerDetails?.invCvVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.invCvVal) + "Cr",
        title: "Invoice Amount",
      },
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" + GlobalFunctions.getFormatedNumber(customerDetails?.invGstVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.invGstVal) +
            "Cr",
        title: "Invoice GST",
      },
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" + GlobalFunctions.getFormatedNumber(customerDetails?.invOthVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.invOthVal) +
            "Cr",
        title: "Other Invoice Amount",
      },
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" +
            GlobalFunctions.getFormatedNumber(customerDetails?.invOthGstVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.invOthGstVal) +
            "Cr",
        title: "Other Invoice GST",
      },
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" +
            GlobalFunctions.getFormatedNumber(customerDetails?.invTotalVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.invTotalVal) +
            "Cr",
        title: "Total Invoice Amount",
      },
    ],
    column3: [
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" + GlobalFunctions.getFormatedNumber(customerDetails?.paidCvVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.paidCvVal) +
            "Cr",
        title: "Paid Amount",
      },
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" + GlobalFunctions.getFormatedNumber(customerDetails?.paidGstVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.paidGstVal) +
            "Cr",
        title: "Paid GST",
      },
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" + GlobalFunctions.getFormatedNumber(customerDetails?.paidOthVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.paidOthVal) +
            "Cr",
        title: "Other Paid Amount ",
      },
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" +
            GlobalFunctions.getFormatedNumber(customerDetails?.paidOthGstVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.paidOthGstVal) +
            "Cr",
        title: "Other Paid GST",
      },
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" +
            GlobalFunctions.getFormatedNumber(customerDetails?.paidTotalVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.paidTotalVal) +
            "Cr",
        title: "Total Paid Amount",
      },
    ],
    column4: [
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" + GlobalFunctions.getFormatedNumber(customerDetails?.balCvVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.balCvVal) + "Cr",
        title: "Balance Amount",
      },
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" + GlobalFunctions.getFormatedNumber(customerDetails?.balGstVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.balGstVal) +
            "Cr",
        title: "Balance GST",
      },
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" + GlobalFunctions.getFormatedNumber(customerDetails?.balOthVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.balOthVal) +
            "Cr",
        title: "Other Balance Amount ",
      },
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" +
            GlobalFunctions.getFormatedNumber(customerDetails?.balOthGstVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.balOthGstVal) +
            "Cr",
        title: "Other Balance GST",
      },
      {
        gridStyle: {},
        onClickHandle: () => {},
        count: searchValueAvailable
          ? "₹" +
            GlobalFunctions.getFormatedNumber(customerDetails?.balTotalVal)
          : GlobalFunctions.getFormatedNumber(customerDetails?.balTotalVal) +
            "Cr",
        title: "Total Balance Amount",
      },
    ],
  };

  const getDetailsWithCards = (style, onClickHandle, count, title) => {
    return (
      <Grid style={style && style} onClick={onClickHandle && onClickHandle}>
        <StatusCard
          width="10em"
          height="8em"
          count={count && count}
          title={title && title}
        />
      </Grid>
    );
  };

  const showCustomerDetails = () => {
    return !loading && customerDetails ? (
      // circleInvoice.series &&
      // circleInvoice.options &&
      // circleOut.series &&
      // circleOut.options &&
      // circleUp.series &&
      // circleUp.options &&
      // circlePaid.series &&
      // circlePaid.options &&
      <>
        {/* for div = style={{ height: "12em" }} */}
        <Grid>
          <Grid
            style={{
              display: "flex",
              cursor: "",
              marginTop: "1em",

              "&.MuiGrid-item": {
                paddingTop: "0em",
                paddingLeft: "0em",
              },
            }}
          >
            {/* <Grid xs={8} sm={8} lg={8} md={8}>
              <Grid
                container
                columnSpacing={{ xs: 2, sm: 2, md: 2, lg: 2 }}
                columns={12}
                sx={{ display: "flex" }}
              >
                <Grid
                  xs={3}
                  sm={3}
                  lg={3}
                  md={3}
                  // sx={{ marginLeft: "1em" }}
                  index
                >
                  {CardData?.column1?.map((card) => {
                    const style = card.style;
                    const handleClick = card.onClickHandle;
                    const count = card.count;
                    const title = card.title;
                    return getDetailsWithCards(
                      style,
                      handleClick,
                      count,
                      title
                    );
                  })}
                </Grid>
                <Grid xs={3} sm={3} lg={3} md={3} index>
                  {CardData?.column2?.map((card) => {
                    const style = card.style;
                    const handleClick = card.onClickHandle;
                    const count = card.count;
                    const title = card.title;
                    return getDetailsWithCards(
                      style,
                      handleClick,
                      count,
                      title
                    );
                  })}
                </Grid>
                <Grid xs={3} sm={3} lg={3} md={3} index>
                  {CardData?.column3?.map((card) => {
                    const style = card.style;
                    const handleClick = card.onClickHandle;
                    const count = card.count;
                    const title = card.title;
                    return getDetailsWithCards(
                      style,
                      handleClick,
                      count,
                      title
                    );
                  })}
                </Grid>
                <Grid xs={3} sm={3} lg={3} md={3} index>
                  {CardData?.column4?.map((card) => {
                    const style = card.style;
                    const handleClick = card.onClickHandle;
                    const count = card.count;
                    const title = card.title;
                    return getDetailsWithCards(
                      style,
                      handleClick,
                      count,
                      title
                    );
                  })}
                </Grid>
              </Grid>
            </Grid> */}

            <Grid
              container
              columnSpacing={{ xs: 2, sm: 2, md: 2, lg: 2 }}
              columns={14}
              sx={{ display: "flex", paddingLeft: "1em" }}
            >
              <Grid
                xs={2}
                sm={2}
                lg={2}
                md={2}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  // dispatch(
                  //   dashboardActions.setShouldShowBookingDetails(
                  //     !reducerData.dashboard.shouldShowBookingDetails
                  //   )
                  // );
                  navigate("/crm/crm/bookingReport");
                }}
              >
                <StatusCard
                  width="10em"
                  height="12em"
                  count={searchValueAvailable ? 1 : customerDetails?.orderCnt} //NoOfBookings
                  title={OrderId ? "Booked" : "Booked Units"}
                />
              </Grid>
              <Grid
                xs={2}
                sm={2}
                lg={2}
                md={2}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(
                    dashboardActions.setShouldShowCustDetails(
                      !reducerData.dashboard.shouldShowCustData
                    )
                  );
                }}
              >
                <StatusCard
                  width="10em"
                  height="8em"
                  count={
                    searchValueAvailable
                      ? numberOfCust
                      : customerDetails?.customerCnt
                  } //NoOfApplicants
                  title={"Applicants"}
                />
              </Grid>
              <Grid
                xs={2}
                sm={2}
                lg={2}
                md={2}
                // style={{ cursor: "pointer" }}
                // onClick={() => {
                //   dispatch(
                //     dashboardActions.setShouldShowBookingDetails(
                //       !reducerData.dashboard.shouldShowBookingDetails
                //     )
                //   );
                // }}
              >
                <StatusCard
                  width="10em"
                  height="8em"
                  count={customerDetails?.regCnt} //NoOfBookings
                  title={"Pending Registration"}
                />
              </Grid>

              <Grid
                xs={2}
                sm={2}
                lg={2}
                md={2}
                item
                sx={{
                  "&.MuiGrid-item": {
                    paddingLeft: "0em",
                  },
                }}
              >
                <StatusCard
                  icon={
                    circleInvoice.options &&
                    circleInvoice.series && (
                      <Chart
                        options={
                          circleInvoice.options ? circleInvoice.options : ""
                        }
                        series={
                          circleInvoice.series ? circleInvoice.series : ""
                        }
                        type="radialBar"
                        height={120}
                        width={120}
                      />
                    )
                  }
                  count={
                    searchValueAvailable
                      ? GlobalFunctions.formatToIndianNumber(
                          accountStatement.DueAmount
                        ) !== undefined
                        ? "₹" +
                          GlobalFunctions.formatToIndianNumber(
                            accountStatement.DueAmount
                          )
                        : "₹" + 0
                      : cardDataFromNdc?.invoiced !== undefined
                      ? "₹" + cardDataFromNdc?.invoiced + " Cr"
                      : "₹" + 0
                  }
                  title="Invoiced Amount"
                />
              </Grid>
              <Grid
                xs={2}
                sm={2}
                lg={2}
                md={2}
                item
                sx={{
                  "&.MuiGrid-item": {
                    paddingLeft: "0em",
                  },
                }}
              >
                <StatusCard
                  width="14em"
                  height="8em"
                  icon={
                    circlePaid.options &&
                    circlePaid.series && (
                      <Chart
                        options={circlePaid.options}
                        series={circlePaid.series}
                        type="radialBar"
                        height={120}
                        width={120}
                      />
                    )
                  }
                  count={
                    searchValueAvailable
                      ? GlobalFunctions.formatToIndianNumber(
                          getPaidAmt().toLocaleString()
                        ) !== undefined
                        ? "₹" +
                          GlobalFunctions.formatToIndianNumber(
                            getPaidAmt().toLocaleString()
                          )
                        : "₹" + 0
                      : cardDataFromNdc?.totalPayment !== undefined
                      ? "₹" + cardDataFromNdc?.totalPayment + " Cr"
                      : "₹" + 0
                  }
                  title="Paid Amount"
                />
                {/* </Grid> */}
              </Grid>

              <Grid
                xs={2}
                sm={2}
                lg={2}
                md={2}
                item
                sx={{
                  "&.MuiGrid-item": {
                    paddingLeft: "0em",
                  },
                }}
              >
                <StatusCard
                  width="14em"
                  height="8em"
                  icon={
                    circleOut.options &&
                    circleOut.series && (
                      <Chart
                        options={circleOut.options}
                        series={circleOut.series}
                        type="radialBar"
                        height={120}
                        width={120}
                      />
                    )
                  }
                  count={
                    searchValueAvailable
                      ? accountStatement.BalanceAmount !== undefined
                        ? "₹" +
                          GlobalFunctions.formatToIndianNumber(
                            accountStatement.BalanceAmount
                          )
                        : "₹" + 0
                      : cardDataFromNdc?.outstanding !== undefined
                      ? "₹" + cardDataFromNdc?.outstanding + " Cr"
                      : "₹" + 0
                  }
                  title="Outstanding Amount"
                />
              </Grid>
              <Grid
                xs={2}
                sm={2}
                lg={2}
                md={2}
                item
                sx={{
                  "&.MuiGrid-item": {
                    paddingLeft: "0em",
                  },
                }}
              >
                <StatusCard
                  width="14em"
                  height="8em"
                  icon={
                    circleUp.options &&
                    circleUp.series && (
                      <Chart
                        options={circleUp.options}
                        series={circleUp.series}
                        type="radialBar"
                        height={120}
                        width={120}
                      />
                    )
                  }
                  count={
                    searchValueAvailable
                      ? accountStatement.PossessionBalance !== undefined
                        ? "₹" +
                          GlobalFunctions.formatToIndianNumber(
                            accountStatement.PossessionBalance
                          )
                        : "₹" + 0
                      : cardDataFromNdc?.unbilled !== undefined
                      ? "₹" + cardDataFromNdc?.unbilled + " Cr"
                      : "₹" + 0
                  }
                  title="Balance till possession"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <div style={{ marginTop: "1em", marginBottom: "1em" }}>
          <ThemeProvider theme={() => getMuiTheme()}>
            {isNdcLoading ? (
              <>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Box>
                    <CircularProgress />
                  </Box>
                </Box>
              </>
            ) : (
              <Table
                data={ndcTableData}
                columns={columns}
                options={options}
              ></Table>
            )}
          </ThemeProvider>
        </div>

        {/* Happiness meter and sentimental analysis */}
        {/* 
        <HappinessIndexDonut
          circleUp={circleUp}
          customerDetails={customerDetails}
          searchValueAvailable={searchValueAvailable}
        /> */}

        <Grid container columns={12} columnSpacing={1}>
          <Grid item sm={6} md={6} lg={6} xs={6}>
            <Accordion
              sx={{
                "&.MuiAccordionSummary-root": {
                  minHeight: "21px",
                  paddingTop: "1em",
                },
              }}
              defaultExpanded
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "0.9em" }}>
                  File Acceptance Pending
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {" "}
                <AcceptancePending
                  tableData={acceptancePendingData}
                  setLoading={setLoading}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item sm={6} md={6} lg={6} xs={6}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "0.9em" }}>
                  Registration Pending
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RegistrationPending
                  tableData={registrationPendingData}
                  setLoading={setLoading}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        <Grid
          container
          columns={12}
          columnSpacing={1}
          sx={{ marginTop: "1em" }}
        >
          <Grid item sm={6} md={6} lg={6} xs={6}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "0.9em" }}>
                  Today's Activity
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {" "}
                <TodayActivity />
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item sm={6} md={6} lg={6} xs={6}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "0.9em" }}>
                  Today's BirthDay / Anniversary
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TodaysBirthday data={birthdayData} />
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        {/* <Grid sx={{ height: "20em" }}>
          {OrderId ? <BookingDetails unitData={unitData} /> : <BookingData />}
        </Grid> */}

        {/* Ageing Graph and Projectf3 Graph */}
        {/* <Grid sx={{ marginLeft: "1%" }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 2, lg: 2 }}
            columns={12}
            sx={{
              display: "flex",
              marginTop: "1%",
            }}
          >
            <Grid
              item
              xs={6}
              sm={6}
              lg={6}
              md={6}
              sx={{
                // width: "48%",
                backgroundColor:
                  reducerData.ThemeReducer.mode === "theme-mode-light" ||
                  reducerData.ThemeReducer.mode === null
                    ? "#ffffff"
                    : "#2d2d2d",
                // backgroundColor: "white",
                borderRadius: "0.8em",
              }}
            >
              <AgingGraph />
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              lg={6}
              md={6}
              sx={{
                paddingleft: "3em",
                // width: "48%",
                // height: "100%",
                height: "10em",
                borderRadius: "0.8em",
                "&.MuiGrid-item": {
                  paddingTop: "0px",
                },
              }}
            >
              <Graph />
            </Grid>
          </Grid>
        </Grid> */}
      </>
    ) : (
      <CircularScreenLoader />
    );
  };

  return showCustomerDetails();
}
