import React from "react";
import moment from "moment";
import "./CustomerInfoCard.css";
import CakeIcon from "@mui/icons-material/Cake";
import MailIcon from "@mui/icons-material/Mail";
import BankInformation from "./BankInformation";
import { Typography, Grid } from "@mui/material";
import BasicInformation from "./BasicInformation";
import ChildInformation from "./ChildInformation";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import CelebrationIcon from "@mui/icons-material/Celebration";
import TransactionInformation from "./TransactionInformation";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CustomTabLayout from "../../../components/tabs/CustomTabLayout";

const CustomerInfoCard = ({ customerInfo }) => {
  const tabs = [
    {
      label: "Basic Info",
      component: <BasicInformation customerInfo={customerInfo} />,
    },
    {
      label: "Child Info",
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
  ];

  const getAddress = (address) => {
    const separatedAddress = address.split(",").map((line) => line.trim());

    return (
      <>
        <div>
          {separatedAddress.map((line, index) => (
            <Typography fontSize="14px" style={{ paddingLeft: "1em" }}>
              {line}
            </Typography>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <Grid container spacing={4} sx={{ marginLeft: "0.5em" }}>
        <Grid
          item
          xs={4}
          sm={3}
          md={3}
          sx={{
            display: "flex",
            backgroundColor: "white",
            paddingBottom: "2em",
          }}
        >
          <Grid>
            <div style={{ display: "flex" }}>
              <div className="circularImg">
                <Typography
                  sx={{ padding: "0.52em", fontSize: "20px", color: "white" }}
                >
                  AB
                </Typography>{" "}
              </div>
              <div style={{ paddingTop: "1.5em" }}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {customerInfo?.customerName}{" "}
                </Typography>
                <Typography fontSize="12px">
                  {customerInfo?.Occupation}
                </Typography>
                <Typography fontSize="12px">
                  {customerInfo?.Designation}
                </Typography>
                <Typography fontSize="12px">
                  {customerInfo?.Company}, {customerInfo.WorkPlace}
                </Typography>
                <Typography fontSize="12px">
                  {customerInfo?.Industry}
                </Typography>
              </div>
            </div>
            {/* //personalDetails */}
            <div>
              <div
                className="d-flex"
                style={{ paddingTop: "2em", paddingLeft: "1em" }}
              >
                <CakeIcon fontSize="small" />
                <Typography fontSize="14px" style={{ paddingLeft: "1em" }}>
                  {" "}
                  {moment(customerInfo?.DOB).format("DD MMM YYYY")}
                </Typography>
              </div>

              <div
                className="d-flex"
                style={{ paddingTop: "0.5em", paddingLeft: "1em" }}
              >
                <CelebrationIcon fontSize="small" />
                <Typography fontSize="14px" style={{ paddingLeft: "1em" }}>
                  {" "}
                  {moment(customerInfo?.DOB).format("DD MMM YYYY")}
                </Typography>
              </div>
              <div
                className="d-flex"
                style={{ paddingTop: "0.5em", paddingLeft: "1em" }}
              >
                <PhoneAndroidIcon fontSize="small" />
                <Typography fontSize="14px" style={{ paddingLeft: "1em" }}>
                  {" "}
                  {customerInfo?.Mobile}
                </Typography>
              </div>
              <div
                className="d-flex"
                style={{ paddingTop: "0.5em", paddingLeft: "1em" }}
              >
                <MailIcon fontSize="small" />
                <Typography fontSize="14px" style={{ paddingLeft: "1em" }}>
                  {" "}
                  {customerInfo?.Email}
                </Typography>
              </div>
              <div
                className="d-flex"
                style={{ paddingTop: "0.5em", paddingLeft: "1em" }}
              >
                <PlaceIcon fontSize="small" />{" "}
                {getAddress(customerInfo?.Address)}
              </div>
              <Typography fontSize="14px" style={{ paddingLeft: "3.6em" }}>
                {" "}
                {customerInfo?.State}
              </Typography>
              <Typography fontSize="14px" style={{ paddingLeft: "3.6em" }}>
                {" "}
                {customerInfo?.Country}
              </Typography>
            </div>
            {/* OtherDetails */}
            <div
              style={{ paddingTop: "1em", paddingLeft: "1em", display: "flex" }}
            >
              <div>
                <PersonIcon fontSize="medium" />
              </div>
              <div>
                <Typography fontSize="14px" style={{ paddingLeft: "0.8em" }}>
                  {customerInfo?.Age} Years
                </Typography>
                <Typography fontSize="14px" style={{ paddingLeft: "0.8em" }}>
                  {customerInfo?.Gender}
                </Typography>
                <Typography fontSize="14px" style={{ paddingLeft: "0.8em" }}>
                  {customerInfo?.Ethnicity}
                </Typography>
              </div>
            </div>
            <></>
          </Grid>
        </Grid>

        <Grid
          item
          xs={4}
          sm={8}
          md={8}
          sx={{ marginLeft: "0.5em", backgroundColor: "white" }}
        >
          <div style={{ paddingTop: "1em" }}>
            <CustomTabLayout tabPanels={tabs} />
          </div>
        </Grid>
      </Grid>
    </>
  );
};
export default CustomerInfoCard;
