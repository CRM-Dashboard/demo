/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, Typography, Avatar } from "@mui/material";
import CrmModal from "../../../../components/crmModal/CrmModal";
import GlobalFunctions from "../../../../utils/GlobalFunctions";
import UpdateTransactionDetails from "./UpdateTransactionDetails";
import DropdownConstants from "./../../../../utils/DropdownConstants";

export default function TransactionInformation() {
  // const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({});
  const [isTransInfoEditable, setIsTransInfoEditable] = useState(false);

  const transRef = useRef(null);
  const reducerData = useSelector((state) => state);
  const crmId = reducerData.dashboard.crmId;
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData?.dashboard?.project?.projectId;
  const selfFundingConstant = DropdownConstants.SelfFundingConstant;
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
  }, [isTransInfoEditable]);

  const saveTransactionDetails = () => {
    if (transRef.current) {
      transRef.current.saveTransactionDetails();
    }
  };

  const getSelfFund = (selfPmt) => {
    const finalData = selfFundingConstant.filter((data) => data.Id === selfPmt);
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
            Transaction Details
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
                  setIsTransInfoEditable(!isTransInfoEditable);
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
                Pending Unit Amount(Before Registration):
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {GlobalFunctions.getFormatedNumber(customerInfo?.pendAmt)}
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
                Pending GST Amount(Before Registration):
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {GlobalFunctions.getFormatedNumber(customerInfo?.pendGst)}
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
                Timeline for pending amounts(Before Registration):
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{customerInfo?.pendDt}</Typography>
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
                Registration Deviation:
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {customerInfo?.regDev === "X" ? "Yes" : "No"}
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
                Timeline for Registration:
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{customerInfo?.devDt}</Typography>
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
              <Typography style={titleStyle}>If Self Funding:</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{getSelfFund(customerInfo?.selfPmt)}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <br />
      </Grid>
      <CrmModal
        maxWidth="sm"
        show={isTransInfoEditable}
        handleShow={() => {
          setIsTransInfoEditable(false);
        }}
        primaryBtnText="Create"
        SecondaryBtnText="Close"
        secondarySave={() => {
          setIsTransInfoEditable(false);
        }}
        primarySave={() => {
          saveTransactionDetails();
        }}
        title="Transaction Details"
      >
        <UpdateTransactionDetails
          ref={transRef}
          customerInfo={customerInfo}
          setIsTransInfoEditable={setIsTransInfoEditable}
        />
      </CrmModal>
    </>
  );
}
