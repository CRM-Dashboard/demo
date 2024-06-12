import React, { useState, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import CrmModal from "../../../../components/crmModal/CrmModal";
import { Grid, Typography, Avatar } from "@mui/material";
import UpdateTransactionDetails from "./UpdateTransactionDetails";

export default function TransactionInformation({ customerInfo }) {
  const [isTransInfoEditable, setIsTransInfoEditable] = useState(false);

  const transRef = useRef(null);

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

  const validationSchema = Yup.object().shape({
    pendingUnit: Yup.string().required("Required"),
    pendingGst: Yup.number().required("Required"),
    pendingAmtTimeline: Yup.string().required("Required"),
    registrationDeviation: Yup.string().required("Required"),
    registerTimeline: Yup.string().required("Required"),
    ifSeflFunding: Yup.string().required("Required"),
  });

  const saveTransactionDetails = () => {
    if (transRef.current) {
      transRef.current.saveTransactionDetails();
    }
  };

  const formik = useFormik({
    initialValues: {
      pendingUnit: customerInfo?.pendAmt ? customerInfo?.pendAmt : "",
      pendingGst: customerInfo?.pendGst ? customerInfo?.pendGst : "",
      pendingAmtTimeline: customerInfo?.pendDt ? customerInfo?.pendDt : "",
      registrationDeviation: customerInfo?.regDev ? customerInfo?.regDev : "",
      registerTimeline: customerInfo?.devDt ? customerInfo?.devDt : "",
      ifSeflFunding: customerInfo?.selfPmt ? customerInfo?.selfPmt : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // const data = values;
      saveTransactionDetails();
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
              <Typography>{formik?.values?.pendingUnit}</Typography>
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
              <Typography>{formik?.values?.pendingGst}</Typography>
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
              <Typography>{formik?.values?.pendingAmtTimeline}</Typography>
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
                {formik?.values?.registrationDeviation === "X" ? "Yes" : "No"}
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
              <Typography>{formik?.values?.registerTimeline}</Typography>
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
              <Typography>
                {formik?.values?.ifSeflFunding === "X" ? "Yes" : "No"}
              </Typography>
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