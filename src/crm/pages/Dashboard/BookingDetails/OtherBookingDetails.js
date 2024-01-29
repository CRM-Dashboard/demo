import React, { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, Typography, Input, Tooltip, Avatar } from "@mui/material";

export default function OtherBookingDetails({ otherBookingDetails }) {
  const validationSchema = Yup.object().shape({
    balanceUnit: Yup.number().required("Required"),
    balanceGst: Yup.number().required("Required"),
    totalBalance: Yup.number().required("Required"),
    custCharges: Yup.number().required("Required"),
    custGst: Yup.number().required("Required"),
    applicationDate: Yup.number().required("Required"),
    holdDate: Yup.number().required("Required"),
    confirmDate: Yup.number().required("Required"),
    registerDate: Yup.number().required("Required"),
    crmUserId: Yup.number().required("Required"),
    holdy: Yup.number().required("Required"),
    warrantyExtended: Yup.number().required("Required"),
    specialPayment: Yup.number().required("Required"),
    scheme: Yup.number().required("Required"),
    salesManager: Yup.number().required("Required"),
    virtualAccount: Yup.number().required("Required"),
    taxVirtualAccount: Yup.number().required("Required"),
    mobilePrimary: Yup.number().required("Required"),
    emailPrimary: Yup.number().required("Required"),
    mobileAlternate: Yup.number().required("Required"),
    emailAlternate: Yup.string().required("Required"),
    customerPAN: Yup.number().required("Required"),
    reckonerRate: Yup.number().required("Required"),
  });

  const saveCostSheet = () => {
    console.log("#######formik.values", formik.values);
  };

  const formik = useFormik({
    initialValues: {
      balanceUnit: otherBookingDetails?.balUnit
        ? otherBookingDetails?.balUnit
        : "",
      balanceGst: otherBookingDetails?.balGst
        ? otherBookingDetails?.balGst
        : "",
      totalBalance: otherBookingDetails?.balTot
        ? otherBookingDetails?.balTot
        : "",
      custCharges: otherBookingDetails?.custom
        ? otherBookingDetails?.custom
        : "",
      custGst: otherBookingDetails?.customGst
        ? otherBookingDetails?.customGst
        : "",
      applicationDate: otherBookingDetails?.appDate
        ? otherBookingDetails?.appDate
        : "",
      holdDate: otherBookingDetails?.holdDate
        ? otherBookingDetails?.holdDate
        : "",
      confirmDate: otherBookingDetails?.confDate
        ? otherBookingDetails?.confDate
        : "",
      registerDate: otherBookingDetails?.regDate
        ? otherBookingDetails?.regDate
        : "",
      crmUserId: otherBookingDetails?.crmid ? otherBookingDetails?.crmid : "",
      holdy: otherBookingDetails?.holdyInd ? otherBookingDetails?.holdyInd : "",
      warrantyExtended: otherBookingDetails?.warrantyExt
        ? otherBookingDetails?.warrantyExt
        : "",
      specialPayment: otherBookingDetails?.specialPmt
        ? otherBookingDetails?.specialPmt
        : "",
      scheme: otherBookingDetails?.scheme ? otherBookingDetails?.scheme : "",
      salesManager: otherBookingDetails?.salesManager
        ? otherBookingDetails?.salesManager
        : "",
      virtualAccount: otherBookingDetails?.virtualAccount
        ? otherBookingDetails?.virtualAccount
        : "",
      taxVirtualAccount: otherBookingDetails?.taxVirtualAccount
        ? otherBookingDetails?.taxVirtualAccount
        : "",
      mobilePrimary: otherBookingDetails?.gst
        ? otherBookingDetails?.mobile1
        : "",
      emailPrimary: otherBookingDetails?.email1
        ? otherBookingDetails?.email1
        : "",
      mobileAlternate: otherBookingDetails?.mobile2
        ? otherBookingDetails?.mobile2
        : "",
      emailAlternate: otherBookingDetails?.email2
        ? otherBookingDetails?.email2
        : "",
      customerPAN: otherBookingDetails?.custPan
        ? otherBookingDetails?.custPan
        : "",
      reckonerRate: otherBookingDetails?.reckRate
        ? otherBookingDetails?.reckRate
        : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      saveCostSheet();
    },
  });

  const titleStyle = {
    "font-weight": "bold",
    "font-size": 14,
    marginLeft: "1em",
    paddinTop: "1em",
  };
  const dataStyle = { "font-size": 14, marginLeft: "1em" };
  const gridStyle = { display: "flex", marginLeft: "-1em" };

  useEffect(() => {
    console.log("######otherBookingDetails", otherBookingDetails);
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "2em",
        }}
      >
        <Avatar sx={{ cursor: "pointer" }}>
          <EditIcon
            onClick={() => {
              saveCostSheet();
            }}
          />
        </Avatar>
      </div>

      <Grid
        container
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          paddingLeft: "3em",
          paddingBottom: "1.5em",
        }}
      >
        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Balance (Unit):</Typography>
            <Input
              id="balanceUnit"
              name="balanceUnit"
              style={dataStyle}
              value={formik?.values?.balanceUnit}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Balance (GST):</Typography>
            <Input
              id="balanceGst"
              name="balanceGst"
              style={dataStyle}
              value={formik?.values?.balanceGst}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Total Balance:</Typography>
            <Input
              id="totalBalance"
              name="totalBalance"
              style={dataStyle}
              value={formik?.values?.totalBalance}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Customisation Charges:</Typography>
            <Input
              id="custCharges"
              name="custCharges"
              style={dataStyle}
              value={formik?.values?.custCharges}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Customisation GST:</Typography>
            <Input
              id="custGst"
              name="custGst"
              style={dataStyle}
              value={formik?.values?.custGst}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Application Date:</Typography>
            <Input
              id="applicationDate"
              name="applicationDate"
              style={dataStyle}
              value={formik?.values?.applicationDate}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Hold Date:</Typography>
            <Input
              id="holdDate"
              name="holdDate"
              style={dataStyle}
              value={formik?.values?.holdDate}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Confirmation Date:</Typography>
            <Input
              id="confirmDate"
              name="confirmDate"
              style={dataStyle}
              value={formik?.values?.confirmDate}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Registration Date:</Typography>
            <Input
              id="registerDate"
              name="registerDate"
              style={dataStyle}
              value={formik?.values?.registerDate}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>CRM User Id:</Typography>
            <Input
              id="crmUserId"
              name="crmUserId"
              style={dataStyle}
              value={formik?.values?.crmUserId}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Hold Y:</Typography>
            <Input
              id="holdy"
              name="holdy"
              style={dataStyle}
              value={formik.values.holdy}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Warranty Extended:</Typography>
            <Input
              id="warrantyExtended"
              name="warrantyExtended"
              style={dataStyle}
              value={formik.values.warrantyExtended}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Special Payment:</Typography>
            <Input
              id="specialPayment"
              name="specialPayment"
              style={dataStyle}
              value={formik.values.specialPayment}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Scheme:</Typography>
            <Input
              id="scheme"
              name="scheme"
              style={dataStyle}
              value={formik.values.scheme}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Sales Manager:</Typography>
            <Input
              id="salesManager"
              name="salesManager"
              style={dataStyle}
              value={formik.values.salesManager}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Virtual Account:</Typography>
            <Input
              id="virtualAccount"
              name="virtualAccount"
              style={dataStyle}
              value={formik?.values?.virtualAccount}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Tax Virtual Account:</Typography>
            <Input
              id="taxVirtualAccount"
              name="taxVirtualAccount"
              style={dataStyle}
              value={formik?.values?.taxVirtualAccount}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Mobile Primary:</Typography>
            <Input
              id="mobilePrimary"
              name="mobilePrimary"
              style={dataStyle}
              value={formik?.values?.mobilePrimary}
              onChange={formik.handleChange}
            />
          </Grid>{" "}
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Email Primary:</Typography>
            <Input
              id="emailPrimary"
              name="emailPrimary"
              style={dataStyle}
              value={formik?.values?.emailPrimary}
              onChange={formik.handleChange}
            />
          </Grid>{" "}
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Mobile Alternate:</Typography>
            <Input
              id="mobileAlternate"
              name="mobileAlternate"
              style={dataStyle}
              value={formik?.values?.mobileAlternate}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Email Alternate:</Typography>
            <Input
              id="emailAlternate"
              name="emailAlternate"
              style={dataStyle}
              value={formik?.values?.emailAlternate}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Customer PAN:</Typography>
            <Input
              id="customerPAN"
              name="customerPAN"
              style={dataStyle}
              value={formik?.values?.customerPAN}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Reckoner Rate:</Typography>
            <Input
              id="reckonerRate"
              name="reckonerRate"
              style={dataStyle}
              value={formik?.values?.reckonerRate}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
