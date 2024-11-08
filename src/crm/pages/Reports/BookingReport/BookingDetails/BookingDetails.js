/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef } from "react";

import Timeline from "./TimeLine/Timeline";
import CostSheet from "./CostSheet/CostSheet";
import LoanInfo from "./Loan/LoanInfo";
import SchemeInfo from "./Scheme/SchemeInfo";
import SellIcon from "@mui/icons-material/Sell";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  Avatar,
  ListItemText,
  Divider,
  ListItemAvatar,
  Box,
} from "@mui/material";
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
import CustomTabLayout from "../../../../components/tabs/CustomTabLayout";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const BookingDetails = forwardRef((props, ref) => {
  const { unitData } = props;
  // const [unitData, setUnitData] = useState([]);

  // const reducerData = useSelector((state) => state);
  // const passWord = reducerData.LoginReducer.passWord;
  // const userName = reducerData.LoginReducer.userName;
  // const OrderId = reducerData.searchBar.orderId;

  // useEffect(() => {
  //   // setLoading(true);
  //   if (OrderId) {
  //     const formData = new FormData();
  //     formData.append("orderId", OrderId);
  //     formData.append("userName", userName);
  //     formData.append("passWord", passWord);
  //     fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/so", {
  //       method: "POST",
  //       body: formData,
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data[0].so[0].vbeln) {
  //           setUnitData(data[0].so[0]);
  //           // setLoading(false);
  //         }
  //       });
  //   }
  // }, [OrderId]);

  // const TitleStyles = {
  //   fontSize: "0.9rem",
  //   paddingLeft: "0.5em",
  //   paddingRight: "0.2em",
  // };

  const tabs = [
    {
      label: "TimeLine",
      component: <Timeline unitData={props?.unitData} />,
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
    <Grid sx={{ padding: "1em" }}>
      <Grid
        container
        columns={12}
        columnSpacing={1}
        // columnGap={2}
        // columnSpacing={2}
        // sx={{
        //   marginLeft: "1em",
        // }}
        className="bgImage"
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "1em",
            borderRadius: "18px",
            // border: "1px solid green",
            position: "sticky",
            top: "4em",
          }}
        >
          <CardContent>
            {/* Flat Number */}
            <Typography
              variant="h6"
              align="center"
              sx={{
                fontSize: "20px",
                color: "white",
                backgroundColor: "gray",
                borderRadius: "50%", // Makes it circular
                padding: "0.5em", // Adjusts internal spacing
                width: "4em", // Set width and height to same value to create circle
                height: "4em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center", // Centers content inside
                margin: "0 auto", // Centers the component horizontally
              }}
            >
              {unitData?.flatno}
            </Typography>

            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", marginTop: "1em", textAlign: "center" }}
            >
              {unitData?.property}
            </Typography>

            {/* List of details */}
            <List sx={{ marginTop: "2em" }}>
              {[
                {
                  icon: <ApartmentIcon sx={{ color: "black" }} />,
                  label: "Building",
                  value: unitData?.building,
                },
                {
                  icon: <Crop32Icon sx={{ color: "black" }} />,
                  label: "Carpet Area",
                  value: `${unitData?.carea} ${
                    unitData?.meins === "FT2" ? "sq.ft." : "sq.mt."
                  }`,
                },
                {
                  icon: <Crop54Icon sx={{ color: "black" }} />,
                  label: "Saleable Area",
                  value: `${unitData?.area} ${
                    unitData?.meins === "FT2" ? "sq.ft." : "sq.mt."
                  }`,
                },
                {
                  icon: <BlindsClosedIcon sx={{ color: "black" }} />,
                  label: "Floor",
                  value: unitData?.floor?.split(" ")[0],
                },
                {
                  icon: <SellIcon sx={{ color: "black" }} />,
                  label: "Type",
                  value: unitData?.class,
                },
                {
                  icon: <LocalParkingIcon sx={{ color: "black" }} />,
                  label: "Parking Type",
                  value: unitData?.prkType,
                },
                {
                  icon: <EmojiTransportationIcon sx={{ color: "black" }} />,
                  label: "Parking Floor",
                  value: unitData?.flrText,
                },
                {
                  icon: <CarCrashIcon sx={{ color: "black" }} />,
                  label: "Parking Location",
                  value: unitData?.parkinglocation,
                },
                {
                  icon: <CarRepairIcon sx={{ color: "black" }} />,
                  label: "Parking Area",
                  value: unitData?.parkingareatext,
                },
                {
                  icon: <AccountBalanceWalletIcon sx={{ color: "black" }} />,
                  label: "Parking Number",
                  value: unitData?.parkno,
                },
                {
                  icon: <GarageIcon sx={{ color: "black" }} />,
                  label: "Parking in Sq.mt.",
                  value: unitData?.parkaream2,
                },
                {
                  icon: <HeightIcon sx={{ color: "black" }} />,
                  label: "Parking Height",
                  value: unitData?.parkheight,
                },
              ].map((item, index) => (
                <div key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>{item.icon}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", gap: "2", padding: "3px" }}>
                          <Typography>{item.label} : </Typography>
                          <Typography sx={{ paddingLeft: "5px" }}>
                            {item.value}
                          </Typography>
                        </Box>
                      }
                      // secondary={item.value}
                    />
                    {/* <ListItemText primary={item.label} secondary={item.value} /> */}
                  </ListItem>
                  {index < 10 && <Divider />}
                </div>
              ))}
            </List>
          </CardContent>
        </Card>

        <Grid item xs={8} sm={8} md={8} lg={8}>
          <div>
            <CustomTabLayout tabPanels={tabs} />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
});
export default BookingDetails;
