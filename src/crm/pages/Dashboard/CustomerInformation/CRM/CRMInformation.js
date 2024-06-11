import React, { useState, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, Typography, Avatar } from "@mui/material";
import CrmModal from "../../../../components/crmModal/CrmModal";
import UpdateCrmDetails from "./UpdateCrmDetails";

export default function CRMInformation({ customerInfo }) {
  const [isCrmInfoEditable, setIsCrmInfoEditable] = useState(false);

  const crmRef = useRef(null);

  const titleStyle = {
    "font-weight": "bold",
    "font-size": 14,
    marginLeft: "1em",
    paddinTop: "1em",
  };
  const dataStyle = { "font-size": 14, marginLeft: "1em" };
  const gridStyle = {
    display: "flex",
    marginLeft: "-1em",
    "& .MuiGrid-item": "7px",
  };

  const validationSchema = Yup.object().shape({
    referedByPromotors: Yup.string().required("Required"),
    politician: Yup.string().required("Required"),
    hni: Yup.string().required("Required"),
    hardToDealWith: Yup.string().required("Required"),
    antagonised: Yup.string().required("Required"),
    requestedForCondition: Yup.string().required("Required"),
    natureOfCondition: Yup.string().required("Required"),
    requestedForMode: Yup.string().required("Required"),
    modeOfCommunication: Yup.string().required("Required"),
    reasonOfPurchase: Yup.string().required("Required"),
    concessions: Yup.string().required("Required"),
    concessionsDetails: Yup.string().required("Required"),
  });

  const saveCrmDetails = () => {
    if (crmRef.current) {
      crmRef.current.saveCrmDetails();
    }
  };

  const formik = useFormik({
    initialValues: {
      referedByPromotors: customerInfo?.referBy ? customerInfo?.referBy : "",
      politician: customerInfo?.vip ? customerInfo?.vip : "",
      hni: customerInfo?.hni ? customerInfo?.hni : "",
      hardToDealWith: customerInfo?.hard ? customerInfo?.hard : "",
      antagonised: customerInfo?.antagon ? customerInfo?.antagon : "",
      requestedForCondition: customerInfo?.specCond
        ? customerInfo?.specCond
        : "",
      natureOfCondition: customerInfo?.cond ? customerInfo?.cond : "",
      requestedForMode: customerInfo?.specMode ? customerInfo?.specMode : "",
      modeOfCommunication: customerInfo?.commMode ? customerInfo?.commMode : "",
      reasonOfPurchase: customerInfo?.purRsn ? customerInfo?.purRsn : "",
      concessions: customerInfo?.concess ? customerInfo?.concess : "",
      concessionsDetails: customerInfo?.concessDtl
        ? customerInfo?.concessDtl
        : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // const data = values;
      saveCrmDetails();
    },
  });

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
                {formik?.values?.referedByPromotors === "X" ? "Yes" : "No"}
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
                {formik?.values?.politician === "X" ? "Yes" : "No"}
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
                {formik?.values?.hni === "X" ? "Yes" : "No"}
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
                {formik?.values?.hardToDealWith === "X" ? "Yes" : "No"}
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
                {formik?.values?.antagonised === "X" ? "Yes" : "No"}
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
                {formik?.values?.requestedForCondition === "X" ? "Yes" : "No"}
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
              <Typography>{formik?.values?.natureOfCondition}</Typography>
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
                {formik?.values?.requestedForMode === "X" ? "Yes" : "No"}
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
              <Typography>{formik?.values?.modeOfCommunication}</Typography>
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
              <Typography> {formik?.values?.reasonOfPurchase}</Typography>
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
                {formik?.values?.concessions === "X" ? "Yes" : "No"}
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
              <Typography> {formik?.values?.concessionsDetails}</Typography>
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
