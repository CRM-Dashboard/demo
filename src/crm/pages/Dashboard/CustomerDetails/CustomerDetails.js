/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import StatusCard from "../../../components/statusCard/StatusCard";
import AgingGraph from "./AgingGraph";
import Graph from "./Graph";
import { useSelector } from "react-redux/es/hooks/useSelector";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";
import dashboardActions from "../DashboardReducer.js/DashboardActions";
import HappinessIndexDonut from "./HappinessIndexDonut";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import { useDispatch } from "react-redux";
import "./CustomerDetails.css";

export default function CustomerDetails() {
  const [customerDetails, setCustomerDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [numberOfCust, setNumberOfCust] = useState(0);
  const [searchValueAvailable, setSearchValueAvailable] = useState(false);

  const dispatch = useDispatch();
  const reducerData = useSelector((state) => state);
  const OrderId = reducerData?.searchBar?.orderId;
  const projectId = reducerData?.dashboard?.project?.projectId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  // const searchValueAvailable = reducerData.searchBar.searchKey ? true : false;
  const mode = GlobalFunctions.getThemeBasedDatailsColour(
    reducerData.ThemeReducer.mode
  );

  const getDetails = () => {
    setLoading(true);
    if (projectId !== "undefined" || projectId) {
      fetch(
        `http://115.124.113.252:8000/sap/bc/react/crm/summary?sap-client=250&projectId=${projectId}&sap-user=${userName}&sap-password=${passWord}`
      )
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
      fetch(
        `/sap/bc/react/crm/customer?sap-client=250&projectId=${projectId}&sap-user=${userName}&sap-password=${passWord}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            const filteredArray = data.filter((obj) => obj.orderId === OrderId);
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
        <div className="col-12" style={{ height: "11.5em" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div className="col-2 circular-img-container">
              <label
                className="detailsTitle"
                style={{ color: mode, paddingBottom: "0.7em" }}
              >
                {OrderId ? "Booking Details" : "Number Of Bookings"}
              </label>
              <img
                alt="Bookings"
                src={require("../../../../assets/bookingsImg.jpg")}
                className="circular-img"
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
              ></img>
              <label className="detailsSubTitle" style={{ color: mode }}>
                {searchValueAvailable ? 1 : customerDetails?.NoOfBookings}
              </label>
            </div>
            <div className="col-2 circular-img-container">
              <label className="detailsTitle" style={{ color: mode }}>
                Applicants Details
              </label>
              <img
                alt="Customer"
                src={require("../../../../assets/customersImg.jpg")}
                className="circular-img"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(
                    dashboardActions.setShouldShowCustDetails(
                      !reducerData.dashboard.shouldShowCustData
                    )
                  );
                }}
              />
              <label className="detailsSubTitle" style={{ color: mode }}>
                {searchValueAvailable
                  ? numberOfCust
                  : customerDetails?.NoOfCustomers}
              </label>
            </div>
            <div className="col-2 circular-img-container">
              <label className="detailsTitle" style={{ color: mode }}>
                Consideration Amount
              </label>
              <img
                alt="considerationAmnt"
                src={require("../../../../assets/cv_image.jpg")}
                className="circular-img"
              />
              <label className="detailsSubTitle" style={{ color: mode }}>
                {searchValueAvailable
                  ? customerDetails.AgreementValue
                  : "₹" + customerDetails?.ConsiderationAmount + " Cr"}
              </label>
            </div>

            <HappinessIndexDonut />
          </div>
        </div>
        <div className="col-12">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="col-3">
              <StatusCard
                icon={
                  <Chart
                    options={circleInvoice.options}
                    series={circleInvoice.series}
                    type="radialBar"
                    height={120}
                  />
                }
                count={
                  searchValueAvailable
                    ? "₹" + customerDetails.DueAmount
                    : "₹" + customerDetails?.InvoiceAmount + "Cr"
                }
                title="Invoiced Amount"
              />
            </div>
            <div className="col-3">
              <StatusCard
                icon={
                  <Chart
                    options={circlePaid.options}
                    series={circlePaid.series}
                    type="radialBar"
                    height={120}
                  />
                }
                count={
                  searchValueAvailable
                    ? "₹" + getPaidAmt().toLocaleString()
                    : "₹" + customerDetails?.PaidAmount + "Cr"
                }
                title="Paid Amount"
              />
            </div>

            <div className="col-3">
              <StatusCard
                icon={
                  <Chart
                    options={circleOut.options}
                    series={circleOut.series}
                    type="radialBar"
                    height={120}
                  />
                }
                count={
                  searchValueAvailable
                    ? "₹" + customerDetails.BalanceAmount
                    : "₹" + customerDetails?.BalanceAmount + "Cr"
                }
                title="Outstanding Amount"
              />
            </div>

            <div className="col-3">
              <StatusCard
                icon={
                  <Chart
                    options={circleUp.options}
                    series={circleUp.series}
                    type="radialBar"
                    height={120}
                  />
                }
                count={
                  searchValueAvailable
                    ? "₹" + customerDetails.PossessionBalance
                    : "₹" + customerDetails?.UpcomingAmount + "Cr"
                }
                title="Balance till possession (Unbilled)"
              />
            </div>
          </div>
        </div>
        <div
          className="d-flex"
          style={{ height: "9.3em", paddingTop: "0.5em" }}
        >
          <div className="w-50">
            <AgingGraph />
          </div>
          <div className="w-50 h-100">
            <Graph />
          </div>
        </div>
      </>
    ) : (
      <CircularScreenLoader />
    );
  };

  return showCustomerDetails();
}
