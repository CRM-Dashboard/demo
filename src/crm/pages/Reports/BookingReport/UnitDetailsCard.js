import React from "react";
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
import CarRepairIcon from "@mui/icons-material/CarRepair";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import BlindsClosedIcon from "@mui/icons-material/BlindsClosed";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const UnitDetailsCard = ({ unitData }) => {
  const details = [
    {
      icon: <ApartmentIcon sx={{ color: "white" }} />,
      label: "Building",
      value: unitData?.building + ` (${unitData?.flatno})`,
    },
    {
      icon: <Crop32Icon sx={{ color: "white" }} />,
      label: "Carpet Area",
      value: `${unitData?.carea} ${
        unitData?.meins === "FT2" ? "sq.ft." : "sq.mt."
      }`,
    },
    {
      icon: <Crop54Icon sx={{ color: "white" }} />,
      label: "Saleable Area",
      value: `${unitData?.area} ${
        unitData?.meins === "FT2" ? "sq.ft." : "sq.mt."
      }`,
    },
    {
      icon: <BlindsClosedIcon sx={{ color: "white" }} />,
      label: "Floor",
      value: unitData?.floor?.split(" ")[0],
    },
    {
      icon: <SellIcon sx={{ color: "white" }} />,
      label: "Type",
      value: unitData?.class + ` (${unitData?.property})`,
    },
    {
      icon: <LocalParkingIcon sx={{ color: "white" }} />,
      label: "Parking Type",
      value: unitData?.prkType,
    },
    {
      icon: <EmojiTransportationIcon sx={{ color: "white" }} />,
      label: "Parking Floor",
      value: unitData?.flrText,
    },
    {
      icon: <CarCrashIcon sx={{ color: "white" }} />,
      label: "Parking Location",
      value: unitData?.parkinglocation,
    },
    {
      icon: <CarRepairIcon sx={{ color: "white" }} />,
      label: "Parking Area",
      value: unitData?.parkingareatext,
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ color: "white" }} />,
      label: "Parking Number",
      value: unitData?.parkno,
    },
    {
      icon: <GarageIcon sx={{ color: "white" }} />,
      label: "Parking in Sq.mt.",
      value: unitData?.parkaream2,
    },
    {
      icon: <HeightIcon sx={{ color: "white" }} />,
      label: "Parking Height",
      value: unitData?.parkheight,
    },
  ];

  return (
    <Card
      sx={{
        display: "flex",
        borderRadius: "18px",
        position: "sticky",
        height: "500px",
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        {/* Details in three columns */}
        <Grid container spacing={2} sx={{ marginTop: "0" }}>
          {[0, 1].map((colIndex) => (
            <Grid item xs={4} md={6} key={colIndex}>
              <List>
                {details
                  .slice(colIndex * 6, colIndex * 6 + 6)
                  .map((item, index) => (
                    <div key={index}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ backgroundColor: "#62B4FF" }}>
                            {item.icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box
                              sx={{ display: "flex", gap: 2, padding: "3px" }}
                            >
                              <Typography>{item.label}:</Typography>
                              <Typography sx={{ paddingLeft: "5px" }}>
                                {item.value}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </div>
                  ))}
              </List>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UnitDetailsCard;
