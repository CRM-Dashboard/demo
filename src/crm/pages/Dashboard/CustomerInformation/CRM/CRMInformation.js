/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import UpdateCrmDetails from "./UpdateCrmDetails";
import { Grid, Typography, Avatar } from "@mui/material";
import CrmModal from "../../../../components/crmModal/CrmModal";
import DropdownConstants from "../../../../utils/DropdownConstants";

export default function CRMInformation() {
  const [customerInfo, setCustomerInfo] = useState({});
  const [isCrmInfoEditable, setIsCrmInfoEditable] = useState(false);

  const crmRef = useRef(null);

  const reducerData = useSelector((state) => state);
  const crmId = reducerData.dashboard.crmId;
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData?.dashboard?.project?.projectId;
  const purchaseReason = DropdownConstants.PurchaseReasonConstant;
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
    // setLoading(true);
    const formData = new FormData();
    !orderId && formData.append("crmId", crmId);
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
            // setLoading(false);
          }
        }
      });
  };

  useEffect(() => {
    getUpdatedData();
  }, [isCrmInfoEditable]);

  const saveCrmDetails = () => {
    if (crmRef.current) {
      crmRef.current.saveCrmDetails();
    }
  };

  const getPurchaseReson = (reason) => {
    const finalData = purchaseReason.filter((data) => data.Id === reason);
    return finalData[0]?.Name;
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
            CRM Details
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
                  setIsCrmInfoEditable(!isCrmInfoEditable);
                  saveCrmDetails();
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
              <Typography style={titleStyle}>
                Known to Or Refferred by promotors
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {customerInfo?.referBy === "X" ? "Yes" : "No"}
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
                Politician / Bureaucrat / Civil Servant / Lawyer
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {customerInfo?.vip === "X" ? "Yes" : "No"}
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
                HNI (Business / Highly Designated)
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {customerInfo?.hni === "X" ? "Yes" : "No"}
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
              <Typography style={titleStyle}>Hard to deal with</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {customerInfo?.hard === "X" ? "Yes" : "No"}
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
                Was Antagonised during purchase
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {customerInfo?.antagon === "X" ? "Yes" : "No"}
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
                Has requested for specific condition
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {customerInfo?.specCond === "X" ? "Yes" : "No"}
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
                If yes, Nature of condition
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{customerInfo?.cond}</Typography>
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
                Has Requested for specific mode of communication
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {customerInfo?.specMode === "X" ? "Yes" : "No"}
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
                If yes, mode of communication
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{customerInfo?.commMode}</Typography>
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
              <Typography style={titleStyle}>Reason of purchase</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography> {getPurchaseReson(customerInfo?.purRsn)}</Typography>
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
                Special consessions if any(only related to services)
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {customerInfo?.concess === "X" ? "Yes" : "No"}
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
                If Special consession is applicable then details
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography> {customerInfo?.concessDtl}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <br />
      </Grid>
      <CrmModal
        maxWidth="md"
        title="CRM Details"
        show={isCrmInfoEditable}
        handleShow={() => {
          setIsCrmInfoEditable(false);
        }}
        primaryBtnText="Submit"
        SecondaryBtnText="Cancel"
        primarySave={() => {
          saveCrmDetails();
        }}
        secondarySave={() => {
          setIsCrmInfoEditable(false);
        }}
      >
        <UpdateCrmDetails
          ref={crmRef}
          customerInfo={customerInfo}
          setIsCrmInfoEditable={setIsCrmInfoEditable}
        />
      </CrmModal>
    </>
  );
}
