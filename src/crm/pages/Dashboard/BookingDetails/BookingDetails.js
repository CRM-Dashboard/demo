/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import Timeline from "./TimeLine/Timeline";
import CostSheet from "./CostSheet/CostSheet";
import LoanInfo from "./Loan/LoanInfo";
import { useSelector } from "react-redux";
import SchemeInfo from "./Scheme/SchemeInfo";
import SellIcon from "@mui/icons-material/Sell";
import { Typography, Grid } from "@mui/material";
import Crop32Icon from "@mui/icons-material/Crop32";
import Crop54Icon from "@mui/icons-material/Crop54";
import GarageIcon from "@mui/icons-material/Garage";
import HeightIcon from "@mui/icons-material/Height";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import PossessionInfo from "./Possession/PossessionInfo";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import ApartmentIcon from "@mui/icons-material/Apartment";
import RegistrationInfo from "./Registration/RegistrationInfo";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import BlindsClosedIcon from "@mui/icons-material/BlindsClosed";
import CustomTabLayout from "../../../components/tabs/CustomTabLayout";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const BookingDetails = () => {
  const [unitData, setUnitData] = useState([]);

  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const OrderId = reducerData.searchBar.orderId;

  useEffect(() => {
    // setLoading(true);
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
            setUnitData(data[0].so[0]);
            // setLoading(false);
          }
        });
    }
  }, [OrderId]);

  const tabs = [
    {
      label: "TimeLine",
      component: <Timeline unitData={unitData} />,
    },
    {
      label: "Registration Details",
      component: <RegistrationInfo />,
    },
    {
      label: "Cost Sheet",
      component: <CostSheet />,
    },
    {
      label: "Loan Details",
      component: <LoanInfo />,
    },
    {
      label: "Scheme Details",
      component: <SchemeInfo />,
    },
    {
      label: "Possession Details",
      component: <PossessionInfo />,
    },
  ];

  return (
    <Grid>
      <Grid
        container
        columns={12}
        columnGap={2}
        columnSpacing={2}
        sx={{
          marginLeft: "1em",
        }}
        className="bgImage"
      >
        <Grid
          item
          xs={4}
          sm={3}
          md={3}
          sx={{
            "&.MuiGrid-item": { paddingLeft: "0px" },
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
          <Grid sx={{ margin: "1em" }}>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="circularImg">
                  <Typography
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
                    {unitData.flatno}
                  </Typography>{" "}
                </div>
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
                    {unitData?.property}{" "}
                  </Typography>
                </div>
              </div>
            </div>
            {/* //personalDetails */}

            <div>
              <div
                style={{
                  paddingTop: "2em",
                  display: "flex",
                }}
              >
                <ApartmentIcon fontSize="small" />

                <Grid container columns={12}>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography> Building: </Typography>
                  </Grid>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography> {unitData?.building}</Typography>
                  </Grid>
                </Grid>
              </div>

              <div
                style={{
                  paddingTop: "0.5em",
                  display: "flex",
                }}
              >
                <Crop32Icon fontSize="small" />

                <Grid container columns={12}>
                  <Grid item sm={6} md={6} lg={6}>
                    {" "}
                    <Typography>Carpet Area: </Typography>
                  </Grid>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>
                      {unitData?.carea}
                      {unitData?.meins === "FT2" ? "sq.ft." : "sq.mt."}
                    </Typography>
                  </Grid>
                </Grid>
              </div>

              <div
                style={{
                  paddingTop: "0.5em",
                  display: "flex",
                }}
              >
                <Crop54Icon fontSize="small" />
                <Grid container columns={12}>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>Saleable Area:</Typography>
                  </Grid>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>
                      {unitData?.area}
                      {unitData?.meins === "FT2" ? "sq.ft." : "sq.mt."}{" "}
                    </Typography>
                  </Grid>
                </Grid>
              </div>

              <div
                style={{
                  paddingTop: "0.5em",
                  display: "flex",
                }}
              >
                <BlindsClosedIcon fontSize="small" />
                <Grid container columns={12}>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>Floor:</Typography>
                  </Grid>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>{unitData?.floor?.split(" ")[0]} </Typography>
                  </Grid>
                </Grid>
              </div>

              <div
                style={{
                  paddingTop: "0.5em",
                  display: "flex",
                }}
              >
                <SellIcon fontSize="small" />
                <Grid container columns={12}>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>Type:</Typography>
                  </Grid>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>{unitData?.class} </Typography>
                  </Grid>
                </Grid>
              </div>

              <div
                style={{
                  paddingTop: "0.5em",
                  display: "flex",
                }}
              >
                <LocalParkingIcon fontSize="small" />
                <Grid container columns={12}>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>Parking Type:</Typography>
                  </Grid>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>{unitData?.prkType} </Typography>
                  </Grid>
                </Grid>
              </div>

              <div
                style={{
                  paddingTop: "0.5em",
                  display: "flex",
                }}
              >
                <EmojiTransportationIcon fontSize="small" />
                <Grid container columns={12}>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>Parking floor:</Typography>
                  </Grid>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>{unitData?.flrText} </Typography>
                  </Grid>
                </Grid>
              </div>

              <div
                style={{
                  paddingTop: "0.5em",
                  display: "flex",
                }}
              >
                <CarCrashIcon fontSize="small" />
                <Grid container columns={12}>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>Parking location:</Typography>
                  </Grid>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>{unitData?.parkinglocation} </Typography>
                  </Grid>
                </Grid>
              </div>

              <div
                style={{
                  paddingTop: "0.5em",
                  display: "flex",
                }}
              >
                <CarRepairIcon fontSize="small" />
                <Grid container columns={12}>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>Parking Area:</Typography>
                  </Grid>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>{unitData?.parkingareatext} </Typography>
                  </Grid>
                </Grid>
              </div>

              <div
                style={{
                  paddingTop: "0.5em",
                  display: "flex",
                }}
              >
                <AccountBalanceWalletIcon fontSize="small" />
                <Grid container columns={12}>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>Parking Number:</Typography>
                  </Grid>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>{unitData?.parkno} </Typography>
                  </Grid>
                </Grid>
              </div>

              <div
                style={{
                  paddingTop: "0.5em",
                  display: "flex",
                }}
              >
                <GarageIcon fontSize="small" />
                <Grid container columns={12}>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>Parking in Sq.mt.:</Typography>
                  </Grid>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>{unitData?.parkaream2} </Typography>
                  </Grid>
                </Grid>
              </div>

              <div
                style={{
                  paddingTop: "0.5em",
                  display: "flex",
                }}
              >
                <HeightIcon fontSize="small" />
                <Grid container columns={12}>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>Parking height:</Typography>
                  </Grid>
                  <Grid item sm={6} md={6} lg={6}>
                    <Typography>{unitData?.parkheight} </Typography>
                  </Grid>
                </Grid>
              </div>

              {/* // "prkType": "Single Covered Car Park", parking Type
  //               "flrText": "GROUND FLOOR", parking floor
  //               "parkinglocation": "", parking location
  //               "parkingareatext": "",parking area
  //               "parkno": "", parking no
  //               "parkaream2": "",parking in m2
  //               "parkheight": "",parking height */}
            </div>

            <></>
          </Grid>
        </Grid>

        <Grid item xs={8} sm={7} md={7} lg={7}>
          <div>
            <CustomTabLayout tabPanels={tabs} />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default BookingDetails;
