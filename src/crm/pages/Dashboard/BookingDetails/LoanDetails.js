import React, { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, Typography, Input, Tooltip, Avatar } from "@mui/material";

export default function LoanDetails({ loanDetails }) {
  const validationSchema = Yup.object().shape({
    loanNocDate: Yup.number().required("Required"),
    loanSanctionDate: Yup.number().required("Required"),
    loanSanctionAmount: Yup.number().required("Required"),
    optedForGcs: Yup.number().required("Required"),
    mldConnect: Yup.number().required("Required"),
    gcsCode: Yup.number().required("Required"),
    bankForGcs: Yup.number().required("Required"),
    bankForMld: Yup.number().required("Required"),
    loanBank: Yup.number().required("Required"),
    loanManager: Yup.number().required("Required"),
    loanManagerMobile: Yup.number().required("Required"),
    loanManagerEmail: Yup.number().required("Required"),
  });

  const saveCostSheet = () => {
    console.log("#######formik.values", formik.values);
  };

  const formik = useFormik({
    initialValues: {
      loanNocDate: loanDetails?.loanNocDate ? loanDetails?.loanNocDate : "",
      loanSanctionDate: loanDetails?.loanSanDt ? loanDetails?.loanSanDt : "",
      loanSanctionAmount: loanDetails?.loanSanAmt
        ? loanDetails?.loanSanAmt
        : "",
      optedForGcs: loanDetails?.optdGcs ? loanDetails?.optdGcs : "",
      mldConnect: loanDetails?.mldCon ? loanDetails?.mldCon : "",
      gcsCode: loanDetails?.gcsCod ? loanDetails?.gcsCod : "",
      bankForGcs: loanDetails?.bankGcs ? loanDetails?.bankGcs : "",
      bankForMld: loanDetails?.bankMld ? loanDetails?.bankMld : "",
      loanBank: loanDetails?.loanBank ? loanDetails?.loanBank : "",
      loanManager: loanDetails?.banker ? loanDetails?.banker : "",
      loanManagerMobile: loanDetails?.bankerMob ? loanDetails?.bankerMob : "",
      loanManagerEmail: loanDetails?.bankerMail ? loanDetails?.bankerMail : "",
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
    console.log("######loanDetails", loanDetails);
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
          paddingBottom: "4em",
        }}
      >
        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Loan NOC Date:</Typography>
            <Input
              id="loanNocDate"
              name="loanNocDate"
              style={dataStyle}
              value={formik?.values?.loanNocDate}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Loan Sanction Date:</Typography>
            <Input
              id="loanSanctionDate"
              name="loanSanctionDate"
              style={dataStyle}
              value={formik?.values?.loanSanctionDate}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Loan Sanction Amount:</Typography>
            <Input
              id="loanSanctionAmount"
              name="loanSanctionAmount"
              style={dataStyle}
              value={formik?.values?.loanSanctionAmount}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Opted For GCS:</Typography>
            <Input
              id="optedForGcs"
              name="optedForGcs"
              style={dataStyle}
              value={formik?.values?.optedForGcs}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>MLD Connect:</Typography>
            <Input
              id="mldConnect"
              name="mldConnect"
              style={dataStyle}
              value={formik.values.mldConnect}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>GCS Code: </Typography>
            <Input
              id="gcsCode"
              name="gcsCode"
              style={dataStyle}
              value={formik?.values?.gcsCode}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Bank For GCS:</Typography>
            <Input
              id="bankForGcs"
              name="bankForGcs"
              style={dataStyle}
              value={formik?.values?.bankForGcs}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Bank For MLD:</Typography>
            <Input
              id="bankForMld"
              name="bankForMld"
              style={dataStyle}
              value={formik?.values?.bankForMld}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Loan Bank:</Typography>
            <Input
              id="loanBank"
              name="loanBank"
              style={dataStyle}
              value={formik?.values?.loanBank}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Loan Manager:</Typography>
            <Input
              id="loanManager"
              name="loanManager"
              style={dataStyle}
              value={formik?.values?.loanManager}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Loan Manager Mobile:</Typography>
            <Input
              id="loanManagerMobile"
              name="loanManagerMobile"
              style={dataStyle}
              value={formik.values.loanManagerMobile}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Loan Manager Email:</Typography>
            <Input
              id="loanManagerEmail"
              name="loanManagerEmail"
              style={dataStyle}
              value={formik.values.loanManagerEmail}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
      </Grid>
    </>
  );
}
