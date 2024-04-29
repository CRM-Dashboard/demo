/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Grid } from "@mui/material";
import AgingGraph from "./AgingGraph";
import Divider from "@mui/material/Divider";
import Graph from "./Graph";
import { useSelector } from "react-redux/es/hooks/useSelector";
import StatusCard from "../../../components/statusCard/StatusCard";
import dashboardActions from "../DashboardReducer.js/DashboardActions";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";
import HappinessIndexDonut from "./HappinessIndexDonut";
import { useDispatch } from "react-redux";
import "./CustomerDetails.css";

export default function CustomerDetails() {
  const [customerDetails, setCustomerDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [numberOfCust, setNumberOfCust] = useState(0);
  const [NoOfBookings, setNoOfBookings] = useState(0);
  const [NoOfApplicants, setNoOfApplicants] = useState(0);
  const [searchValueAvailable, setSearchValueAvailable] = useState(false);
  const [NoOfRegistrations, setNoOfRegistrations] = useState(0);
  const [NoOfPossession, setNoOfPossession] = useState(0);

  const dispatch = useDispatch();
  const reducerData = useSelector((state) => state);
  const OrderId = reducerData?.searchBar?.orderId;
  const projectId = reducerData?.dashboard?.project?.projectId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  // const searchValueAvailable = reducerData.searchBar.searchKey ? true : false;

  const getDetails = () => {
    setLoading(true);
    if (projectId !== "undefined" || projectId) {
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
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
    setLoading(true);

    if (
      reducerData?.searchBar?.accountStatement &&
      Object.keys(reducerData?.searchBar?.accountStatement)?.length !== 0
    ) {
      setCustomerDetails(reducerData.searchBar.accountStatement);
      setLoading(false);
    }

    if (projectId !== "undefined") {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("projectId", projectId);
      fetch(process.env.REACT_APP_SERVER_URL + `/api/dashboard/customer`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            const filteredArray = data?.filter(
              (obj) => obj.orderId === OrderId
            );
            setNumberOfCust(filteredArray.length);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
    }
  }, [reducerData?.searchBar?.accountStatement, projectId, OrderId]);

  const getPaidAmt = () => {
    const bigNumber1 = parseFloat(
      customerDetails?.ReceivedAmount?.replace(/,/g, "")
    );
    const bignumber2 = parseFloat(
      customerDetails?.TDSAmount?.replace(/,/g, "")
    );
    const PaidAmt = bigNumber1 + bignumber2;
    return PaidAmt;
  };

  const getInvoicePercentage = () => {
    const considerationAmount = parseFloat(
      customerDetails?.AgreementValue?.replace(/,/g, "")
    );
    const invoiceAmount = parseFloat(
      customerDetails?.DueAmount?.replace(/,/g, "")
    );

    const percentage = ((invoiceAmount / considerationAmount) * 100).toFixed(1);
    return percentage;
  };

  const getPaidPercentage = () => {
    const paidAmount = getPaidAmt();
    const invoiceAmount = parseFloat(
      customerDetails?.DueAmount?.replace(/,/g, "")
    );

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
    const considerationAmount = parseFloat(
      customerDetails?.AgreementValue?.replace(/,/g, "")
    );
    const upcomingAmount = parseFloat(
      customerDetails.PossessionBalance?.replace(/,/g, "")
    );

    const percentage = ((upcomingAmount / considerationAmount) * 100).toFixed(
      1
    );

    return percentage < 0 ? 0 : percentage;
  };

  const circleInvoice = {
    series: [
      searchValueAvailable
        ? getInvoicePercentage()
        : customerDetails?.InvoicePercent,
    ],

    options: {
      chart: {
        height: 100,
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
              fontSize: "13px",
            },
            value: {
              offsetY: -1,
              color: "#111",
              fontSize: "12px",
              show: true,
            },
          },
        },
      },
    },
  };

  const circlePaid = {
    series: [
      searchValueAvailable ? getPaidPercentage() : customerDetails?.PaidPercent,
    ],

    options: {
      chart: {
        height: 100,
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
              fontSize: "13px",
            },
            value: {
              offsetY: -1,
              color: "#111",
              fontSize: "12px",
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
        ? getOutstandingPercentage()
        : customerDetails?.BalancePercent,
    ],

    options: {
      chart: {
        height: 100,
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
              fontSize: "13px",
            },
            value: {
              offsetY: -1,
              color: "#111",
              fontSize: "12px",
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
        ? getUpcomingPercentage()
        : customerDetails?.UpcomingPercent,
    ],

    options: {
      chart: {
        height: 100,
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
              fontSize: "10px",
            },
            value: {
              offsetY: -1,
              color: "#111",
              fontSize: "12px",
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

  useEffect(() => {
    if (customerDetails?.NoOfBookings) {
      displayIncreasingNumbers(
        0,
        customerDetails.NoOfBookings,
        setNoOfBookings
      );
    }
    if (customerDetails?.NoOfCustomers) {
      displayIncreasingNumbers(
        0,
        customerDetails.NoOfCustomers,
        setNoOfApplicants
      );
    }
    if (customerDetails?.NoOfRegistration) {
      displayIncreasingNumbers(
        0,
        customerDetails.NoOfRegistration,
        setNoOfRegistrations
      );
    }
    if (customerDetails?.NoOfPossession) {
      displayIncreasingNumbers(
        0,
        customerDetails.NoOfPossession,
        setNoOfPossession
      );
    }
  }, [customerDetails]);

  const showCustomerDetails = () => {
    return !loading &&
      customerDetails &&
      circleInvoice.series &&
      circleInvoice.options &&
      circleOut.series &&
      circleOut.options &&
      circleUp.series &&
      circleUp.options &&
      circlePaid.series &&
      circlePaid.options &&
      projectId ? (
      <>
        <div style={{ height: "12em" }}>
          <div
            style={{
              display: "flex",
              cursor: "",
              marginTop: "2em",
              paddingLeft: "4em",
              "&.MuiGrid-item": {
                paddingTop: "0em",
                paddingLeft: "0em",
              },
            }}
          >
            <Grid container spacing={4}>
              <Grid
                item
                xs={2}
                sm={2}
                md={2}
                sx={{
                  marginRight: "1em",
                  marginBottom: "2em",
                  "&.MuiGrid-item": {
                    paddingTop: "0em",
                    paddingLeft: "0em",
                  },
                }}
              >
                <Grid
                  className="circular-img-container"
                  style={
                    OrderId ? { cursor: "pointer" } : { cursor: "context-menu" }
                  }
                  onClick={() => {
                    if (OrderId) {
                      dispatch(
                        dashboardActions.setShouldShowTimeLine(
                          !reducerData.dashboard.shouldShowTimeLine
                        )
                      );
                    }
                  }}
                >
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid style={{ padding: "0.8em" }}>
                      <Grid className="detailsSubTitle">
                        {searchValueAvailable ? 1 : NoOfBookings}
                      </Grid>
                      <Grid
                        className="detailsTitle"
                        style={{
                          paddingBottom: "0.7em",
                          fontSize: OrderId ? "15px" : "11px",
                        }}
                      >
                        {OrderId ? "Booked" : "Booked Units"}
                      </Grid>
                    </Grid>

                    {!OrderId && <Divider orientation="vertical" flexItem />}

                    <Grid style={{ padding: "0.5em" }}>
                      <label className="detailsSubTitle">
                        {searchValueAvailable ? " " : NoOfRegistrations}
                      </label>
                      <Grid
                        className="detailsTitle"
                        style={{
                          paddingBottom: "0.7em",
                          fontSize: "11px",
                        }}
                      >
                        {OrderId ? "" : " Registered Units"}
                      </Grid>
                    </Grid>

                    {!OrderId && <Divider orientation="vertical" flexItem />}

                    <Grid style={{ padding: "0.5em" }}>
                      <Grid className="detailsSubTitle">
                        {searchValueAvailable ? "" : NoOfPossession}
                      </Grid>
                      <Grid
                        className="detailsTitle"
                        style={{
                          paddingBottom: "0.7em",
                          fontSize: "11px",
                        }}
                      >
                        {OrderId ? " " : "Possession Given"}
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* <Divider orientation="vertical" flexItem /> */}
                </Grid>
                <Grid sx={{ marginTop: "2em" }}>
                  <StatusCard
                    icon={
                      <Chart
                        options={circleInvoice.options}
                        series={circleInvoice.series}
                        type="radialBar"
                        height={110}
                      />
                    }
                    count={
                      searchValueAvailable
                        ? "₹" + customerDetails.DueAmount
                        : "₹" + customerDetails?.InvoiceAmount + "Cr"
                    }
                    title="Invoiced Amount"
                  />
                </Grid>
              </Grid>
              <Grid
                item
                xs={2}
                sm={2}
                md={2}
                sx={{
                  marginRight: "1em",
                  marginBottom: "2em",
                  "&.MuiGrid-item": {
                    paddingTop: "0em",
                    paddingLeft: "0em",
                  },
                }}
              >
                <Grid
                  className="circular-img-container"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    dispatch(
                      dashboardActions.setShouldShowCustDetails(
                        !reducerData.dashboard.shouldShowCustData
                      )
                    );
                  }}
                >
                  <label className="detailsSubTitle">
                    {searchValueAvailable ? numberOfCust : NoOfApplicants}
                  </label>
                  <label className="detailsTitle" style={{ fontSize: "11px" }}>
                    Applicants
                  </label>
                </Grid>

                <Grid sx={{ marginTop: "2em" }}>
                  <StatusCard
                    icon={
                      <Chart
                        options={circlePaid.options}
                        series={circlePaid.series}
                        type="radialBar"
                        height={110}
                      />
                    }
                    count={
                      searchValueAvailable
                        ? "₹" + getPaidAmt().toLocaleString()
                        : "₹" + customerDetails?.PaidAmount + "Cr"
                    }
                    title="Paid Amount"
                  />
                </Grid>
              </Grid>
              <Grid
                item
                xs={2}
                sm={2}
                md={2}
                sx={{
                  marginRight: "1em",
                  marginBottom: "2em",
                  "&.MuiGrid-item": {
                    paddingTop: "0em",
                    paddingLeft: "0em",
                  },
                }}
              >
                <Grid className=" circular-img-container">
                  <label className="detailsSubTitle">
                    {searchValueAvailable
                      ? customerDetails.AgreementValue
                      : "₹" + customerDetails?.ConsiderationAmount + " Crore"}
                  </label>
                  <label className="detailsTitle" style={{ fontSize: "11px" }}>
                    Consideration Amount
                  </label>
                </Grid>
                <Grid sx={{ marginTop: "2em" }}>
                  <StatusCard
                    icon={
                      <Chart
                        options={circleOut.options}
                        series={circleOut.series}
                        type="radialBar"
                        height={110}
                      />
                    }
                    count={
                      searchValueAvailable
                        ? "₹" + customerDetails.BalanceAmount
                        : "₹" + customerDetails?.BalanceAmount + "Cr"
                    }
                    title="Outstanding Amount"
                  />
                </Grid>
              </Grid>

              <HappinessIndexDonut
                circleUp={circleUp}
                customerDetails={customerDetails}
                searchValueAvailable={searchValueAvailable}
              />
            </Grid>
          </div>
        </div>

        <Grid
          style={{
            height: "9.3em",
            paddingTop: "0.10em",
            display: "flex",
            marginTop: "5em",
          }}
        >
          <Grid sx={{ width: "50%" }}>
            <AgingGraph />
          </Grid>
          <Grid sx={{ width: "50%" }}>
            <Graph />
          </Grid>
        </Grid>
      </>
    ) : (
      <CircularScreenLoader />
    );
  };

  return showCustomerDetails();
}
