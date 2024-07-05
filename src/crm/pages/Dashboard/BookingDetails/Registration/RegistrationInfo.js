/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import Constants from "./../../../../utils/Constants";
import { Grid, Typography, Avatar } from "@mui/material";
import CrmModal from "../../../../components/crmModal/CrmModal";
import GlobalFunctions from "./../../../../utils/GlobalFunctions";
import UpdateRegistrationDetails from "./UpdateRegistrationDetails";
import UseCustomSnackbar from "../../../../components/snackbar/UseCustomSnackBar";
import CircularScreenLoader from "../../../../components/circularScreenLoader/CircularScreenLoader";

export default function RegistrationInfo() {
  const [loading, setLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState([]);
  const [isRegInfoEditable, setIsRegInfoEditable] = useState(false);

  const regRef = useRef(null);
  const snackbar = UseCustomSnackbar();
  const accessConstants = Constants.accessConstants;
  const reducerData = useSelector((state) => state);
  const OrderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const accessRoles = reducerData.LoginReducer.accessRoles;

  const titleStyle = {
    "font-weight": "bold",
    "font-size": 14,
    marginLeft: "1em",
    paddinTop: "1em",
  };

  const gridStyle = {
    display: "flex",
    marginLeft: "-1em",
    "& .MuiGrid-item": "7px",
  };

  const getData = () => {
    if (OrderId) {
      setLoading(true);
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
          setLoading(false);
          console.log("#########data[0]", data[0].so[0]);
          if (data[0].so[0].vbeln) {
            setRegisterInfo(data[0].so[0]);
          }
        });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const saveRegDetails = () => {
    if (regRef.current) {
      regRef.current.saveRegDetails();
    }
  };

  return (
    <>
      {!loading ? (
        <Grid
          style={{
            border: "1px solid white",
            borderRadius: "18px",
            marginTop: "1em",
            paddingTop: "1em",
            paddingLeft: "1em",
            backgroundColor: "white",
          }}
        >
          <Grid
            container
            columns={12}
            columnGap={4}
            spacing={2}
            sx={{ display: "flex" }}
          >
            <Grid
              item
              sm={6}
              md={6}
              lg={6}
              style={{
                fontSize: "1.5em",
                padding: "0.5em",
                fontWeight: "bold",
                marginLeft: "1em",
              }}
            >
              Registration Details
            </Grid>
            <Grid
              item
              sm={5}
              md={5}
              lg={5}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <Avatar sx={{ cursor: "pointer" }}>
                <EditIcon
                  onClick={() => {
                    if (
                      GlobalFunctions.allowAccessByRoles(
                        accessRoles,
                        accessConstants.registrationAccess
                      )
                    ) {
                      setIsRegInfoEditable(!isRegInfoEditable);
                      saveRegDetails();
                    } else {
                      snackbar.showError("Not Authorize!");
                    }
                  }}
                />
              </Avatar>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={4}
            sx={gridStyle}
            style={{ paddingTop: "0.5em" }}
          >
            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              style={{ paddingTop: "2em" }}
              sx={{
                display: "flex",
                "&.MuiGrid-item": { paddingTop: "7px" },
              }}
            >
              <Grid xs={8} sm={8} md={8}>
                <Typography style={titleStyle}>Ready Reckoner Rate</Typography>
              </Grid>
              <Grid xs={4} sm={4} md={4}>
                <Typography>{registerInfo?.reckRate}</Typography>
              </Grid>
            </Grid>

            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
            >
              <Grid xs={8} sm={8} md={8}>
                <Typography style={titleStyle}>
                  SDR/ESBTR Received Amount:
                </Typography>
              </Grid>
              <Grid xs={4} sm={4} md={4}>
                <Typography>{registerInfo?.zstamp}</Typography>
              </Grid>
            </Grid>

            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              sx={{
                display: "flex",
                "&.MuiGrid-item": { paddingTop: "7px" },
              }}
            >
              <Grid xs={8} sm={8} md={8}>
                <Typography style={titleStyle}>
                  Agreement Draft Accepted Date
                </Typography>
              </Grid>
              <Grid xs={4} sm={4} md={4}>
                <Typography>{registerInfo?.draftApprDt}</Typography>
              </Grid>
            </Grid>
            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
            >
              <Grid xs={8} sm={8} md={8}>
                <Typography style={titleStyle}>Registration Date:</Typography>
              </Grid>
              <Grid xs={4} sm={4} md={4}>
                <Typography>{registerInfo?.zzregdt}</Typography>
              </Grid>
            </Grid>

            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
            >
              <Grid xs={8} sm={8} md={8}>
                <Typography style={titleStyle}>Agreement Date:</Typography>
              </Grid>
              <Grid xs={4} sm={4} md={4}>
                <Typography>{registerInfo?.zzagmdt}</Typography>
              </Grid>
            </Grid>

            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
            >
              <Grid xs={8} sm={8} md={8}>
                <Typography style={titleStyle}>Registration Number:</Typography>
              </Grid>
              <Grid xs={4} sm={4} md={4}>
                <Typography>{registerInfo?.zzregno}</Typography>
              </Grid>
            </Grid>
            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
            >
              <Grid xs={8} sm={8} md={8}>
                <Typography style={titleStyle}>Haveli Number:</Typography>
              </Grid>
              <Grid xs={4} sm={4} md={4}>
                <Typography>{registerInfo?.zzhano}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <br />
        </Grid>
      ) : (
        <CircularScreenLoader />
      )}

      <CrmModal
        maxWidth="sm"
        title="Registration Details"
        show={isRegInfoEditable}
        handleShow={() => {
          setIsRegInfoEditable(false);
        }}
        primaryBtnText="Submit"
        SecondaryBtnText="Cancel"
        primarySave={() => {
          saveRegDetails();
        }}
        secondarySave={() => {
          setIsRegInfoEditable(false);
        }}
      >
        <UpdateRegistrationDetails
          ref={regRef}
          getData={getData}
          registerInfo={registerInfo}
          setIsRegInfoEditable={setIsRegInfoEditable}
        />
      </CrmModal>
    </>
  );
}
