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
      icon: <ApartmentIcon sx={{ color: "black" }} />,
      label: "Building",
      value: unitData?.building + ` (${unitData?.flatno})`,
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
      value: unitData?.class + ` (${unitData?.property})`,
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
  ];

  return (
    <Card
      sx={{
        display: "flex",
        // padding: "1em",
        borderRadius: "18px",
        position: "sticky",
        // top: "4em",
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
                          <Avatar>{item.icon}</Avatar>
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
