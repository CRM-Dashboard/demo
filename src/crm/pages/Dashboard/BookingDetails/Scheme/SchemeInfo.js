import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import UpdateSchemeDetails from "./UpdateSchemeDetails";
import { Grid, Typography, Avatar } from "@mui/material";
import CrmModal from "../../../../components/crmModal/CrmModal";

export default function SchemeInfo() {
  //   const [gcs, setGcs] = useState([]);
  //   const [mld, setMld] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [schemeDetails, setSchemeDetails] = useState([]);
  const [isSchemeInfoEditable, setIsSchemeInfoEditable] = useState(false);

  const schemeRef = useRef(null);
  const reducerData = useSelector((state) => state);
  const OrderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData?.dashboard?.project?.projectId;

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
            setSchemeDetails(data[0].so[0]);
          }
        });
    }
  };

  const getCustomers = () => {
    if (OrderId) {
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      fetch(process.env.REACT_APP_SERVER_URL + "/api/topBar/cust_search", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setCustomers(data);
        });
    }
  };

  useEffect(() => {
    getData();
    getCustomers();
  }, []);

  const saveSchemeDetails = () => {
    if (schemeRef.current) {
      schemeRef.current.saveSchemeDetails();
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
            Scheme Details
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
                  setIsSchemeInfoEditable(!isSchemeInfoEditable);
                  saveSchemeDetails();
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
              <Typography style={titleStyle}>Scheme</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{schemeDetails.scheme}</Typography>
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
              <Typography style={titleStyle}>Scheme Start:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{schemeDetails.schemeStart}</Typography>
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
              <Typography style={titleStyle}>Scheme End:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{schemeDetails.schemeEnd}</Typography>
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
              <Typography style={titleStyle}>Scheme Cost:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{schemeDetails?.schemeCost}</Typography>
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
              <Typography style={titleStyle}>Special Payment:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {schemeDetails.specialPmt === "X" ? "Yes" : "No"}
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
              <Typography style={titleStyle}>Y Hold:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {schemeDetails.holdyInd === "X" ? "Yes" : "No"}
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
              <Typography style={titleStyle}>OTR / OTE Eligible:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {schemeDetails.otInd === "X" ? "Yes" : "No"}
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
              <Typography style={titleStyle}>Reference:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{schemeDetails.reference}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <br />
      </Grid>
      <CrmModal
        maxWidth="sm"
        title="Update Scheme Details"
        show={isSchemeInfoEditable}
        handleShow={() => {
          setIsSchemeInfoEditable(false);
        }}
        primaryBtnText="Submit"
        SecondaryBtnText="Cancel"
        primarySave={() => {
          saveSchemeDetails();
        }}
        secondarySave={() => {
          setIsSchemeInfoEditable(false);
        }}
      >
        <UpdateSchemeDetails
          ref={schemeRef}
          getData={getData}
          customers={customers}
          schemeDetails={schemeDetails}
          setIsSchemeInfoEditable={setIsSchemeInfoEditable}
        />
      </CrmModal>
    </>
  );
}
