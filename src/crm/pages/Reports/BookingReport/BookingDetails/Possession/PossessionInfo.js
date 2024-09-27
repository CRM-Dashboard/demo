/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import UpdatePossession from "./UpdatePossession";
import Constants from "./../../../../../utils/Constants";
import { Grid, Typography, Avatar } from "@mui/material";
import CrmModal from "../../../../../components/crmModal/CrmModal";
import GlobalFunctions from "./../../../../../utils/GlobalFunctions";
import UseCustomSnackbar from "../../../../../components/snackbar/UseCustomSnackBar";

export default function PossessionInfo() {
  const [possessionDetails, setPossessionDetails] = useState([]);
  const [disableUpdateBtn, setDisableUpdateBtn] = useState(false);
  const [isPossessionInfoEditable, setIsPossessionInfoEditable] =
    useState(false);

  const posRef = useRef(null);
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
            setPossessionDetails(data[0].so[0]);
          }
        });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const savePossessionDetails = () => {
    if (posRef.current) {
      posRef.current.savePossessionDetails();
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
            Possession Details
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
                      accessConstants.possessionAccess
                    )
                  ) {
                    setIsPossessionInfoEditable(!isPossessionInfoEditable);
                    savePossessionDetails();
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
              <Typography style={titleStyle}>Warranty Extension</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{possessionDetails.warrantyExt}</Typography>
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
              <Typography style={titleStyle}>Possession date:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {getFormattedDate(possessionDetails.zzpasdt)}
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
              <Typography style={titleStyle}>
                Maintainance start date:
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {getFormattedDate(possessionDetails.zmaintdt)}
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
              <Typography style={titleStyle}>Warranty start date:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {getFormattedDate(possessionDetails?.zzwstdt)}
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
              <Typography style={titleStyle}>Warranty end date:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {getFormattedDate(possessionDetails.zzwendt)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <br />
      </Grid>
      <CrmModal
        maxWidth="sm"
        title="Update Scheme Details"
        show={isPossessionInfoEditable}
        handleShow={() => {
          setIsPossessionInfoEditable(false);
        }}
        primaryBtnText="Submit"
        SecondaryBtnText="Cancel"
        primarySave={() => {
          savePossessionDetails();
        }}
        disabled={disableUpdateBtn}
        secondarySave={() => {
          setIsPossessionInfoEditable(false);
        }}
      >
        <UpdatePossession
          ref={posRef}
          getData={getData}
          possessionDetails={possessionDetails}
          setDisableUpdateBtn={setDisableUpdateBtn}
          setIsPossessionInfoEditable={setIsPossessionInfoEditable}
        />
      </CrmModal>
    </>
  );
}
