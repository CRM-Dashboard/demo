/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Graph from "./Graph";
import "./CustomerDetails.css";
import Chart from "react-apexcharts";
import { Grid } from "@mui/material";
import AgingGraph from "./AgingGraph";
import { useDispatch } from "react-redux";
import HappinessIndexDonut from "./HappinessIndexDonut";
import GlobalFunctions from "./../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import StatusCard from "../../../components/statusCard/StatusCard";
import dashboardActions from "../DashboardReducer.js/DashboardActions";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";
import TodayActivity from "./TodayActivity";

export default function CustomerDetails() {
  const [customerDetails, setCustomerDetails] = useState();
  const [loading, setLoading] = useState(false);
  const [numberOfCust, setNumberOfCust] = useState(0);
  const [searchValueAvailable, setSearchValueAvailable] = useState(false);

  const dispatch = useDispatch();
  const reducerData = useSelector((state) => state);
  const OrderId = reducerData?.searchBar?.orderId;
  const projectId = reducerData?.dashboard?.project?.projectId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const crmId = reducerData.dashboard.crmId;
  const accountStatement = reducerData.searchBar.accountStatement;
  // const searchValueAvailable = reducerData.searchBar.searchKey ? true : false;

  const getDetails = () => {
    // setLoading(true);
    if (projectId) {
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("crmId", crmId);
      fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/summary", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setCustomerDetails(data[0]);

          if (
            reducerData.dashboard.shouldShowSentimentAnalysis &&
            reducerData?.dashboard?.shouldShowHappinessMeter
          ) {
            setLoading(false);
          }
        });
    }
  };

  useEffect(() => {
    getDetails();
  }, [crmId]);

  useEffect(() => {
    setSearchValueAvailable(reducerData.searchBar.searchKey ? true : false);
  }, [reducerData.searchBar.searchKey]);

  useEffect(() => {
    if (reducerData?.searchBar?.accountStatement) {
      if (Object.keys(reducerData?.searchBar?.accountStatement).length !== 0) {
        setCustomerDetails(reducerData?.searchBar?.accountStatement);
      } else {
        getDetails();
      }
    } else {
      getDetails();
    }
  }, [reducerData.searchBar.accountStatement]);

  useEffect(() => {
    // setLoading(true);

    if (
      reducerData?.searchBar?.accountStatement &&
      Object.keys(reducerData?.searchBar?.accountStatement)?.length !== 0
    ) {
      setCustomerDetails(reducerData.searchBar.accountStatement);
      setLoading(false);
    }

    if (projectId !== "undefined" && OrderId) {
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("orderId", OrderId);
      formData.append("crmId", crmId);
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
    var invoiceAmount;
    var considerationAmount;
    if (searchValueAvailable) {
      considerationAmount = parseFloat(
        accountStatement.AgreementValue?.replace(/,/g, "")
      );
      invoiceAmount = parseFloat(
        accountStatement?.DueAmount?.replace(/,/g, "")
      );
    } else {
      considerationAmount = parseFloat(
        customerDetails?.AgreementValue?.replace(/,/g, "")
      );
      invoiceAmount = parseFloat(customerDetails?.DueAmount?.replace(/,/g, ""));
    }
    const percentage = ((invoiceAmount / considerationAmount) * 100).toFixed(1);
    return percentage;
  };

  const getPaidPercentage = () => {
    var paidAmount;
    var invoiceAmount;
    if (searchValueAvailable) {
      paidAmount = parseFloat(
        accountStatement?.AgreementValue?.replace(/,/g, "")
      );
      invoiceAmount = parseFloat(
        accountStatement?.DueAmount?.replace(/,/g, "")
      );
    } else {
      paidAmount = getPaidAmt();
      invoiceAmount = parseFloat(customerDetails?.DueAmount?.replace(/,/g, ""));
    }

    const percentage = ((paidAmount / invoiceAmount) * 100).toFixed(1);
    return percentage;
  };

  const getOutstandingPercentage = () => {
    if (customerDetails?.BalanceAmount && customerDetails?.DueAmount) {
      const oustadingAmount = parseFloat(
        customerDetails?.BalanceAmount?.replace(/,/g, "")
      );

      const invoiceAmount = parseFloat(
        customerDetails?.DueAmount?.replace(/,/g, "")
      );

      const percentage = ((oustadingAmount / invoiceAmount) * 100).toFixed(1);

      return percentage < 0 ? 0 : percentage;
    } else {
      return 0;
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
      considerationAmount = parseFloat(
        customerDetails?.AgreementValue?.replace(/,/g, "")
      );
      upcomingAmount = parseFloat(
        customerDetails.PossessionBalance?.replace(/,/g, "")
      );
    }

    const percentage = ((upcomingAmount / considerationAmount) * 100).toFixed(
      1
    );

    return percentage < 0 ? 0 : percentage;
  };

  const circleInvoice = {
    series: [
      searchValueAvailable
        ? getInvoicePercentage() !== undefined
          ? getInvoicePercentage()
          : 0
        : customerDetails?.InvoicePercent !== undefined
        ? customerDetails?.InvoicePercent
        : 0,
    ],

    options: {
      chart: {
        height: "50%",
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "40%",
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
      searchValueAvailable
        ? getPaidPercentage() !== undefined
          ? getPaidPercentage()
          : 0
        : customerDetails?.PaidPercent !== undefined
        ? customerDetails?.PaidPercent
        : 0,
    ],

    options: {
      chart: {
        height: "50%",
        type: "radialBar",
      },
      fill: {
        colors: ["#1cbd00"],
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "40%",
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
      searchValueAvailable
        ? getOutstandingPercentage() !== undefined
          ? getOutstandingPercentage()
          : 0
        : customerDetails?.BalancePercent !== undefined
        ? customerDetails?.BalancePercent
        : 0,
    ],

    options: {
      chart: {
        height: "50%",
        type: "radialBar",
      },
      fill: {
        colors: ["#fb0b12"],
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "40%",
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
      searchValueAvailable
        ? getUpcomingPercentage() !== undefined
          ? getUpcomingPercentage()
          : 0
        : customerDetails?.UpcomingPercent !== undefined
        ? customerDetails?.UpcomingPercent
        : 0,
    ],

    options: {
      chart: {
        height: "50%",
        type: "radialBar",
      },
      fill: {
        colors: ["#FFA500"],
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "40%",
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

  function displayIncreasingNumbers(
    currentVal,
    targetNumber,
    updatingFunction
  ) {
    let currentNumber = currentVal;

    const intervalId = setInterval(() => {
      updatingFunction(() => {
        currentNumber = currentNumber + 1;

        if (currentNumber === targetNumber) {
          clearInterval(intervalId);
        }

        return currentNumber;
      });
    }, 5); // Interval duration set to 1 second
  }

  const showCustomerDetails = () => {
    return !loading &&
      customerDetails &&
      // circleInvoice.series &&
      // circleInvoice.options &&
      // circleOut.series &&
      // circleOut.options &&
      // circleUp.series &&
      // circleUp.options &&
      // circlePaid.series &&
      // circlePaid.options &&
      projectId ? (
      <>
        {/* for div = style={{ height: "12em" }} */}
        <Grid sx={{ marginLeft: "1%" }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 2, lg: 2 }}
            columns={14}
            style={{
              display: "flex",
              cursor: "",
              marginTop: "2em",

              "&.MuiGrid-item": {
                paddingTop: "0em",
                paddingLeft: "0em",
              },
            }}
          >
            <Grid
              xs={2}
              sm={2}
              lg={2}
              md={2}
              style={{ cursor: "pointer" }}
              onClick={() => {
                dispatch(
                  dashboardActions.setShouldShowBookingDetails(
                    !reducerData.dashboard.shouldShowBookingDetails
                  )
                );
              }}
            >
              <StatusCard
                width="10em"
                height="5.5em"
                count={searchValueAvailable ? 1 : customerDetails?.NoOfBookings} //NoOfBookings
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
                height="5.5em"
                count={
                  searchValueAvailable
                    ? numberOfCust
                    : customerDetails?.NoOfCustomers
                } //NoOfApplicants
                title={"Applicants"}
              />
            </Grid>
            <Grid xs={2} sm={2} lg={2} md={2}>
              <StatusCard
                width="12.5em"
                height="5.5em"
                count={
                  searchValueAvailable
                    ? GlobalFunctions.formatToIndianNumber(
                        accountStatement.AgreementValue
                      ) !== undefined
                      ? "₹" +
                        GlobalFunctions.formatToIndianNumber(
                          accountStatement.AgreementValue
                        )
                      : "₹" + 0
                    : customerDetails?.ConsiderationAmount !== undefined
                    ? "₹" + customerDetails?.ConsiderationAmount + " Cr"
                    : "₹" + 0
                }
                title={"Consideration Amount"}
              />
            </Grid>
            <Grid xs={2} sm={2} lg={2} md={2}>
              <StatusCard
                width="14em"
                height="5.5em"
                icon={
                  circleInvoice.options &&
                  circleInvoice.series && (
                    <Chart
                      options={
                        circleInvoice.options ? circleInvoice.options : ""
                      }
                      series={circleInvoice.series ? circleInvoice.series : ""}
                      type="radialBar"
                      height={100}
                      width={100}
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
                    : customerDetails?.InvoiceAmount !== undefined
                    ? "₹" + customerDetails?.InvoiceAmount + "Cr"
                    : "₹" + 0
                }
                title="Invoiced Amount"
              />
            </Grid>
            <Grid xs={2} sm={2} lg={2} md={2}>
              <StatusCard
                width="14em"
                height="5.5em"
                icon={
                  circlePaid.options &&
                  circlePaid.series && (
                    <Chart
                      options={circlePaid.options}
                      series={circlePaid.series}
                      type="radialBar"
                      height={100}
                      width={100}
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
                    : customerDetails?.PaidAmount !== undefined
                    ? "₹" + customerDetails?.PaidAmount + "Cr"
                    : "₹" + 0
                }
                title="Paid Amount"
              />
              {/* </Grid> */}
            </Grid>
            <Grid xs={2} sm={2} lg={2} md={2}>
              <StatusCard
                width="14em"
                height="5.5em"
                icon={
                  circleOut.options &&
                  circleOut.series && (
                    <Chart
                      options={circleOut.options}
                      series={circleOut.series}
                      type="radialBar"
                      height={100}
                      width={100}
                    />
                  )
                }
                count={
                  searchValueAvailable
                    ? accountStatement.BalanceAmount !== undefined
                      ? "₹" + accountStatement.BalanceAmount
                      : "₹" + 0
                    : customerDetails?.BalanceAmount !== undefined
                    ? "₹" + customerDetails?.BalanceAmount + "Cr"
                    : "₹" + 0
                }
                title="Outstanding Amount"
              />
            </Grid>
            <Grid xs={2} sm={2} lg={2} md={2}>
              <StatusCard
                width="14em"
                height="5.5em"
                icon={
                  circleUp.options &&
                  circleUp.series && (
                    <Chart
                      options={circleUp.options}
                      series={circleUp.series}
                      type="radialBar"
                      height={100}
                      width={100}
                    />
                  )
                }
                count={
                  searchValueAvailable
                    ? accountStatement.PossessionBalance !== undefined
                      ? "₹" + accountStatement.PossessionBalance
                      : "₹" + 0
                    : customerDetails?.UpcomingAmount !== undefined
                    ? "₹" + customerDetails?.UpcomingAmount + "Cr"
                    : "₹" + 0
                }
                title="Balance till possession"
              />
            </Grid>
            {/* </Grid> */}

            {/* </Grid> */}
          </Grid>
        </Grid>

        <HappinessIndexDonut
          circleUp={circleUp}
          customerDetails={customerDetails}
          searchValueAvailable={searchValueAvailable}
        />
        <TodayActivity />
        <Grid sx={{ marginLeft: "1%" }}>
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
        </Grid>
      </>
    ) : (
      <CircularScreenLoader />
    );
  };

  return showCustomerDetails();
}
