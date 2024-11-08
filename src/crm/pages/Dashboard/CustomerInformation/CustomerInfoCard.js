/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import moment from "moment";
import "./CustomerInfoCard.css";
import { useSelector } from "react-redux";
import CakeIcon from "@mui/icons-material/Cake";
import MailIcon from "@mui/icons-material/Mail";
import WorkIcon from "@mui/icons-material/Work";
import CallIcon from "@mui/icons-material/Call";
import PersonIcon from "@mui/icons-material/Person";
import BankInformation from "./Bank/BankInformation";
import HappinessIndexDonut from "./HappinessIndexDonut";
import BasicInformation from "./Basic/BasicInformation";
import ChildInformation from "./Child/ChildInformation";
import CelebrationIcon from "@mui/icons-material/Celebration";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { Typography, Grid } from "@mui/material";

import CRMInformation from "./CRM/CRMInformation";

import CustomTabLayout from "../../../components/tabs/CustomTabLayout";
import CustomisationDetails from "./Customisation/CustomisationDetails";
import TransactionInformation from "./Transaction/TransactionInformation";
import {
  Card,
  CardContent,
  IconButton,
  Divider,
  ListItemAvatar,
  ListItem,
  List,
  Avatar,
} from "@mui/material";

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
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: "18px",
              boxShadow: 3,
              position: "sticky",
              top: "0em",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              {!loading && (
                <HappinessIndexDonut
                  circleUp={circleUp}
                  customerDetails={customerDetails}
                  searchValueAvailable={searchValueAvailable}
                />
              )}
              <Typography variant="h6" fontWeight="bold" mt={1}>
                {customerData?.customerName}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "12px",
                }}
              >
                <Avatar sx={{}}>
                  <WorkIcon sx={{ color: "black" }} />
                </Avatar>
                {customerData?.Occupation}{" "}
                {customerData?.industry && `(${customerData.industry})`}
              </Typography>
              <Typography
                sx={{ fontSize: "12px" }}
                variant="body2"
                color="textSecondary"
              >
                {customerData?.Designation}
              </Typography>
              <Typography
                sx={{ fontSize: "12px" }}
                variant="body2"
                color="textSecondary"
              >
                {customerData?.Company}, {customerData?.WorkPlace}
              </Typography>
            </CardContent>

            <CardContent sx={{ width: "100%", paddingLeft: "1em" }}>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {" "}
                      <CakeIcon sx={{ color: "black" }} />
                    </Avatar>
                  </ListItemAvatar>
                  <Typography sx={{ fontSize: "12px" }}>
                    {moment(customerData?.DOB).format("DD MMM YYYY")}
                  </Typography>
                </ListItem>
                <Divider />

                {customerData?.anniversary && (
                  <>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <CelebrationIcon sx={{ color: "black" }} />
                        </Avatar>
                      </ListItemAvatar>
                      <Typography sx={{ fontSize: "12px" }}>
                        {moment(customerData.anniversary).format("DD MMM YYYY")}
                      </Typography>
                    </ListItem>
                    <Divider />
                  </>
                )}

                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="comments">
                      <CallIcon sx={{ color: "black" }} />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      {" "}
                      <PhoneAndroidIcon color="black" sx={{ color: "black" }} />
                    </Avatar>
                  </ListItemAvatar>
                  <Typography sx={{ fontSize: "12px" }}>
                    {customerData?.Mobile}
                  </Typography>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {" "}
                      <MailIcon sx={{ color: "black" }} />
                    </Avatar>
                  </ListItemAvatar>
                  <Typography sx={{ fontSize: "12px" }}>
                    {customerData?.Email}
                  </Typography>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {" "}
                      <PersonIcon sx={{ color: "black" }} />
                    </Avatar>
                  </ListItemAvatar>
                  <Typography sx={{ fontSize: "12px" }}>
                    {customerData?.Age} Years, {customerData?.Gender}
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
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
