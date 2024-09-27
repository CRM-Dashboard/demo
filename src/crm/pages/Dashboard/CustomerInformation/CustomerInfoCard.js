/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import moment from "moment";
import "./CustomerInfoCard.css";
import { useSelector } from "react-redux";
import CakeIcon from "@mui/icons-material/Cake";
import MailIcon from "@mui/icons-material/Mail";
import { Typography, Grid } from "@mui/material";
import CRMInformation from "./CRM/CRMInformation";
import PersonIcon from "@mui/icons-material/Person";
import BankInformation from "./Bank/BankInformation";
import HappinessIndexDonut from "./HappinessIndexDonut";
import BasicInformation from "./Basic/BasicInformation";
import ChildInformation from "./Child/ChildInformation";
import CelebrationIcon from "@mui/icons-material/Celebration";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CustomTabLayout from "../../../components/tabs/CustomTabLayout";
import CustomisationDetails from "./Customisation/CustomisationDetails";
import TransactionInformation from "./Transaction/TransactionInformation";

const CustomerInfoCard = ({
  customerInfo,
  titleData,
  occupations,
  countryData,
  stateData,
}) => {
  const [loading, setLoading] = useState(false);
  const [customerDetails, setCustomerDetails] = useState();
  const [searchValueAvailable, setSearchValueAvailable] = useState(false);

  const customerData = customerInfo;
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const accountStatement = reducerData.searchBar.accountStatement;

  const getDetails = () => {
    setLoading(true);
    // if (projectId) {
    const formData = new FormData();
    // formData.append("projectId", projectId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("crmId", userName);
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
    // }
  };

  useEffect(() => {
    getDetails();
  }, []);

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
    setSearchValueAvailable(reducerData.searchBar.searchKey ? true : false);
  }, [reducerData.searchBar.searchKey]);

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
        height: "100%",
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

  const tabs = [
    {
      label: "Basic Info",
      component: (
        <BasicInformation
          titleData={titleData}
          occupations={occupations}
          countryData={countryData}
          stateData={stateData}
        />
      ),
    },
    {
      label: "Child Details",
      component: <ChildInformation />,
    },
    {
      label: "Bank Details",
      component: <BankInformation />,
    },
    {
      label: "Transaction Details",
      component: <TransactionInformation />,
    },
    {
      label: "CRM Details",
      component: <CRMInformation />,
    },
    {
      label: "Customisation Details",
      component: <CustomisationDetails />,
    },
  ];

  // const getInitials = (name) => {
  //   if (!name) return "";

  //   const words = name.trim().split(/\s+/);
  //   const initials = words.map((word) => word[0].toUpperCase()).join("");
  //   return initials;
  // };

  return (
    <Grid>
      <Grid
        container
        columns={12}
        columnGap={2}
        spacing={2}
        sx={{
          marginLeft: "0.5em",
          padding: "3em",
        }}
        className="bgImage"
      >
        <Grid
          item
          xs={4}
          sm={3}
          md={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            paddingBottom: "2em",
            alignItems: "center",
            justifyContent: "center",
            height: "20%",
            border: "1px solid white",
            borderRadius: "18px",
            position: "sticky",
            top: "4em", // Adjust this value as needed
            alignSelf: "flex-start",
          }}
        >
          <Grid>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                {/* // className="circularImg" */}
                {/* <Typography
                    sx={{
                      // paddingLeft: "22%",
                      // paddingTop: "30%",
                      height: "3.5em",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "22px",
                      color: "white",
                    }}
                  >
                    {getInitials(customerData?.customerName)}
                  </Typography>{" "} */}
                {!loading && (
                  <HappinessIndexDonut
                    circleUp={circleUp}
                    customerDetails={customerDetails}
                    searchValueAvailable={searchValueAvailable}
                  />
                )}
              </div>
              <div className="showDataAtCenter">
                <div
                  style={{
                    paddingTop: "1em",
                  }}
                >
                  <Typography
                    fontSize="18px"
                    sx={{ fontWeight: "bold", paddingLeft: "1em" }}
                  >
                    {customerData?.customerName}{" "}
                  </Typography>
                  <Typography fontSize="16px" className="showDataAtCenter">
                    {customerData?.Occupation}{" "}
                    {customerData?.industry &&
                      "(" + customerData?.industry + ")"}
                  </Typography>
                  <Typography fontSize="16px" className="showDataAtCenter">
                    {customerData?.Designation}
                  </Typography>
                  <Typography fontSize="16px" className="showDataAtCenter">
                    {customerData?.Company}, {customerData.WorkPlace}
                  </Typography>
                </div>
              </div>
            </div>
            {/* //personalDetails */}
            <div>
              <div
                style={{
                  paddingTop: "2em",
                  paddingLeft: "1em",
                  display: "flex",
                }}
              >
                <CakeIcon fontSize="small" />
                <Typography fontSize="16px" style={{ paddingLeft: "1em" }}>
                  {" "}
                  {moment(customerData?.DOB).format("DD MMM YYYY")}
                </Typography>
              </div>

              <div
                style={{
                  paddingTop: "0.5em",
                  paddingLeft: "1em",
                  display: "flex",
                }}
              >
                <CelebrationIcon fontSize="small" />
                <Typography fontSize="16px" style={{ paddingLeft: "1em" }}>
                  {" "}
                  {customerData?.anniversary &&
                    moment(customerData?.anniversary).format("DD MMM YYYY")}
                </Typography>
              </div>

              <div
                style={{
                  paddingTop: "0.5em",
                  paddingLeft: "1em",
                  display: "flex",
                }}
              >
                <PhoneAndroidIcon fontSize="small" />
                <Typography fontSize="16px" style={{ paddingLeft: "1em" }}>
                  {" "}
                  {customerData?.Mobile}
                </Typography>
              </div>

              <div
                style={{
                  paddingTop: "0.5em",
                  paddingLeft: "1em",
                  display: "flex",
                }}
              >
                <MailIcon fontSize="small" />
                <Typography fontSize="16px" style={{ paddingLeft: "1em" }}>
                  {" "}
                  {customerData?.Email}
                </Typography>
              </div>

              <div
                style={{
                  paddingTop: "1em",
                  paddingLeft: "1em",
                  display: "flex",
                }}
              >
                <div>
                  <PersonIcon fontSize="medium" />
                </div>
                <div>
                  <Typography fontSize="16px" style={{ paddingLeft: "0.8em" }}>
                    {customerData?.Age} Years
                  </Typography>
                  <Typography fontSize="16px" style={{ paddingLeft: "0.8em" }}>
                    {customerData?.Gender}
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>

        <Grid item xs={7} sm={8} md={8}>
          <div>
            <CustomTabLayout tabPanels={tabs} />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default CustomerInfoCard;
