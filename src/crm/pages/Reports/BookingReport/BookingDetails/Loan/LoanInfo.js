/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import UpdateLoanDetails from "./UpdateLoanDetails";
import Constants from "./../../../../../utils/Constants";
import { Grid, Typography, Avatar } from "@mui/material";
import CrmModal from "../../../../../components/crmModal/CrmModal";
import GlobalFunctions from "./../../../../../utils/GlobalFunctions";
import UseCustomSnackbar from "../../../../../components/snackbar/UseCustomSnackBar";

export default function LoanInfo() {
  const [gcs, setGcs] = useState([]);
  const [mld, setMld] = useState([]);
  const [loanDetails, setLoanDetails] = useState([]);
  const [disableUpdateBtn, setDisableUpdateBtn] = useState(false);
  const [isLoanInfoEditable, setIsLoanInfoEditable] = useState(false);

  const loanRef = useRef(null);
  const accessConstants = Constants.accessConstants;
  const reducerData = useSelector((state) => state);
  const OrderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const accessRoles = reducerData.LoginReducer.accessRoles;
  const snackbar = UseCustomSnackbar();

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
            setLoanDetails(data[0].so[0]);
            setGcs(data[0].gcs);
            setMld(data[0].mld);
          }
        });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const saveLoanDetails = () => {
    if (loanRef.current) {
      loanRef.current.saveLoanDetails();
    }
  };

  const getFormattedDate = (date) => {
    if (date !== "0000-00-00") {
      return moment(date).format("DD-MM-YYYY");
    } else {
      return "0000-00-00";
    }
  };

  return (
    <>
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
            Loan Details
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
                      accessConstants.schemeAccess
                    )
                  ) {
                    setIsLoanInfoEditable(!isLoanInfoEditable);
                    saveLoanDetails();
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
              <Typography style={titleStyle}>Loan NOC Date</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{getFormattedDate(loanDetails.zzlnocdt)}</Typography>
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
              <Typography style={titleStyle}>Loan Sanction Date:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{getFormattedDate(loanDetails.loanSanDt)}</Typography>
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
              <Typography style={titleStyle}>Loan Sanction Amount:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {GlobalFunctions.getFormatedNumber(loanDetails.zsancAmtDmbtr)}
              </Typography>
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
              <Typography style={titleStyle}>Opted For GCS:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {loanDetails?.zoptGcs === "X" ? "Yes" : "No"}
              </Typography>
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
              <Typography style={titleStyle}>MLD Connect:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {loanDetails.zmldConn === "X" ? "Yes" : "No"}
              </Typography>
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
              <Typography style={titleStyle}>GCS Code:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {loanDetails.zgcsCode === "X" ? "Yes" : "No"}
              </Typography>
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
              <Typography style={titleStyle}>Bank For GCS:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{loanDetails.zbankGcs}</Typography>
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
              <Typography style={titleStyle}>Bank For MLD:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{loanDetails.zbankMlb}</Typography>
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
              <Typography style={titleStyle}>Bank Name:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{loanDetails.zzlbnknam}</Typography>
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
              <Typography style={titleStyle}>Disbursement Date:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {getFormattedDate(loanDetails.zdisbrsmntDate)}
              </Typography>
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
              <Typography style={titleStyle}>Self Fund:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {loanDetails.selfFund === "X" ? "Yes" : "No"}
              </Typography>
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
              <Typography style={titleStyle}>Banker:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{loanDetails.banker}</Typography>
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
              <Typography style={titleStyle}>Banker Email:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{loanDetails.bankerMail}</Typography>
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
              <Typography style={titleStyle}>Banker Mobile:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{loanDetails.bankerMob}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <br />
      </Grid>
      <CrmModal
        maxWidth="sm"
        title="Loan Details"
        show={isLoanInfoEditable}
        handleShow={() => {
          setIsLoanInfoEditable(false);
        }}
        primaryBtnText="Submit"
        SecondaryBtnText="Cancel"
        primarySave={() => {
          saveLoanDetails();
        }}
        disabled={disableUpdateBtn}
        secondarySave={() => {
          setIsLoanInfoEditable(false);
        }}
      >
        <UpdateLoanDetails
          gcs={gcs}
          mld={mld}
          ref={loanRef}
          getData={getData}
          loanDetails={loanDetails}
          setDisableUpdateBtn={setDisableUpdateBtn}
          setIsLoanInfoEditable={setIsLoanInfoEditable}
        />
      </CrmModal>
    </>
  );
}
