/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import UpdateChildDetails from "./UpdateChildDetails";
import { Grid, Typography, Avatar } from "@mui/material";
import CrmModal from "../../../../components/crmModal/CrmModal";
import CircularScreenLoader from "./../../../../components/circularScreenLoader/CircularScreenLoader";

export default function ChildInformation() {
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({});
  const [childInfoEditable, setChildInfoEditable] = useState(false);

  const childRef = useRef(null);
  const reducerData = useSelector((state) => state);
  const crmId = reducerData.dashboard.crmId;
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData?.dashboard?.project?.projectId;
  const custId = reducerData?.searchBar?.accountStatement.CustomerNumber;

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

  const getUpdatedData = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("crmId", crmId);
    formData.append("orderId", orderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("projectId", projectId);
    fetch(process.env.REACT_APP_SERVER_URL + `/api/dashboard/getcustomer`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data) {
          if (orderId) {
            const filteredArray = data[0]?.customerdata?.filter(
              (obj) => obj.customerId === custId
            );
            await setCustomerInfo(filteredArray[0]);
            setLoading(false);
          }
        }
      });
  };

  useEffect(() => {
    getUpdatedData();
  }, [childInfoEditable]);

  const saveChildDetails = () => {
    if (childRef.current) {
      childRef.current.saveChildDetails();
    }
  };

  return (
    <>
      {!loading && customerInfo ? (
        <>
          <Grid
            style={{
              border: "1px solid white",
              borderRadius: "18px",
              paddingTop: "1em",
              marginTop: "1em",
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
                Children Details
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
                      setChildInfoEditable(!childInfoEditable);
                      saveChildDetails();
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Have children? :</Typography>
                </Grid>
                <Grid xs={9} sm={9} md={9}>
                  <Typography>{customerInfo?.child}</Typography>
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>
                    Number of Children:
                  </Typography>
                </Grid>
                <Grid xs={5} sm={5} md={5}>
                  <Typography> {customerInfo?.children} </Typography>
                </Grid>
              </Grid>
            </Grid>
            <br />
          </Grid>
          <Grid
            style={{
              border: "1px solid white",
              borderRadius: "18px",
              paddingTop: "1em",
              marginTop: "1em",
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
                Child 1
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Name:</Typography>
                </Grid>
                <Grid xs={9} sm={9} md={9}>
                  <Typography>{customerInfo?.child1Name}</Typography>
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>DOB:</Typography>
                </Grid>
                <Grid xs={9} sm={9} md={9}>
                  <Typography>{customerInfo?.child1Dob}</Typography>
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Gender:</Typography>
                </Grid>
                <Grid xs={8} sm={8} md={8}>
                  <Typography> {customerInfo?.child1Gender} </Typography>
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Academic:</Typography>
                </Grid>
                <Grid xs={5} sm={5} md={5}>
                  <Typography> {customerInfo?.child1Acad} </Typography>
                </Grid>
              </Grid>
            </Grid>
            <br />
          </Grid>
          <Grid
            style={{
              border: "1px solid white",
              borderRadius: "18px",
              paddingTop: "1em",
              marginTop: "1em",
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
                Child 2
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Name:</Typography>
                </Grid>
                <Grid xs={9} sm={9} md={9}>
                  <Typography>{customerInfo?.child2Name}</Typography>
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>DOB:</Typography>
                </Grid>
                <Grid xs={9} sm={9} md={9}>
                  <Typography>{customerInfo?.child2Dob}</Typography>
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Gender:</Typography>
                </Grid>
                <Grid xs={8} sm={8} md={8}>
                  <Typography> {customerInfo?.child2Gender} </Typography>
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Academic:</Typography>
                </Grid>
                <Grid xs={5} sm={5} md={5}>
                  <Typography> {customerInfo?.child2Acad} </Typography>
                </Grid>
              </Grid>
            </Grid>
            <br />
          </Grid>
          <Grid
            style={{
              border: "1px solid white",
              borderRadius: "18px",
              paddingTop: "1em",
              marginTop: "1em",
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
                Child 3
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Name:</Typography>
                </Grid>
                <Grid xs={9} sm={9} md={9}>
                  <Typography>{customerInfo?.child3Name}</Typography>
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>DOB:</Typography>
                </Grid>
                <Grid xs={9} sm={9} md={9}>
                  <Typography>{customerInfo?.child3Dob}</Typography>
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Gender:</Typography>
                </Grid>
                <Grid xs={8} sm={8} md={8}>
                  <Typography> {customerInfo?.child3Gender} </Typography>
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Academic:</Typography>
                </Grid>
                <Grid xs={5} sm={5} md={5}>
                  <Typography> {customerInfo?.child3Acad} </Typography>
                </Grid>
              </Grid>
            </Grid>
            <br />
          </Grid>
        </>
      ) : (
        <CircularScreenLoader />
      )}

      <CrmModal
        maxWidth="md"
        title="Child Details"
        show={childInfoEditable}
        handleShow={() => {
          setChildInfoEditable(false);
        }}
        primaryBtnText="Submit"
        SecondaryBtnText="Cancel"
        primarySave={() => {
          saveChildDetails();
        }}
        secondarySave={() => {
          setChildInfoEditable(false);
        }}
      >
        <UpdateChildDetails
          ref={childRef}
          customerInfo={customerInfo}
          getUpdatedData={getUpdatedData}
          setChildInfoEditable={setChildInfoEditable}
        />
      </CrmModal>
    </>
  );
}
