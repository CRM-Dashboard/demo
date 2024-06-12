import React, { useState } from "react";
import moment from "moment";
import "./CustomerInfoCard.css";
import { useSelector } from "react-redux";
import CRMInformation from "./CRM/CRMInformation";
import CakeIcon from "@mui/icons-material/Cake";
import MailIcon from "@mui/icons-material/Mail";
import BankInformation from "./Bank/BankInformation";
import { Typography, Grid } from "@mui/material";
import BasicInformation from "./Basic/BasicInformation";
import ChildInformation from "./Child/ChildInformation";
import PersonIcon from "@mui/icons-material/Person";
import CustomisationDetails from "./Customisation/CustomisationDetails";
import CelebrationIcon from "@mui/icons-material/Celebration";
import TransactionInformation from "./Transaction/TransactionInformation";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CustomTabLayout from "../../../components/tabs/CustomTabLayout";

const CustomerInfoCard = ({
  customerInfo,
  titleData,
  occupations,
  countryData,
  stateData,
}) => {
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const orderId = reducerData.searchBar.orderId;
  const projectId = reducerData?.dashboard?.project?.projectId;

  const [customerData, setCustomerData] = useState(customerInfo);

  const getUpdatedData = () => {
    if (projectId) {
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
            // setTitleData(data[0].titledata);
            // setCountryData(data[0].countrydata);
            // setOccupation(data[0].occupationdata);
            // setStateData(data[0].statedata);

            if (orderId) {
              const filteredArray = data[0]?.customerdata?.filter(
                (obj) => obj.orderId === orderId
              );
              const finalArray = filteredArray?.filter(
                (data) => data.customerId === customerInfo.customerId
              );

              setCustomerData(finalArray[0]);
            }
          }
        });
    }
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
          getUpdatedData={getUpdatedData}
        />
      ),
    },
    {
      label: "Child Details",
      component: (
        <ChildInformation
          customerInfo={customerData}
          getUpdatedData={getUpdatedData}
        />
      ),
    },
    {
      label: "Bank Details",
      component: <BankInformation customerInfo={customerData} />,
    },
    {
      label: "Transaction Details",
      component: <TransactionInformation customerInfo={customerData} />,
    },
    {
      label: "CRM Details",
      component: <CRMInformation customerInfo={customerData} />,
    },
    {
      label: "Customisation Details",
      component: <CustomisationDetails customerInfo={customerData} />,
    },
  ];

  const getInitials = (name) => {
    if (!name) return "";

    const words = name.trim().split(/\s+/);
    const initials = words.map((word) => word[0].toUpperCase()).join("");
    return initials;
  };

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
                    {getInitials(customerData?.customerName)}
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

              {/* <div
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
              </Typography> */}
            </div>
            {/* OtherDetails */}

            <></>
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
