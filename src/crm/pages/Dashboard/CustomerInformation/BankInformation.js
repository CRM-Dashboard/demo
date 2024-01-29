import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, Typography, Input, Avatar } from "@mui/material";

export default function BankInformation() {
  const titleStyle = {
    "font-weight": "bold",
    "font-size": 14,
    marginLeft: "1.5em",
    marginTop: "0.8em",
  };
  const dataStyle = { "font-size": 14, marginLeft: "1.5em", paddinTop: "1em" };
  const gridStyle = { display: "flex", marginLeft: "-1em", marginTop: "0.5em" };

  const validationSchema = Yup.object().shape({
    accountName: Yup.string().required("Required"),
    accountNumber: Yup.number().required("Required"),
    bankName: Yup.string().required("Required"),
    bankAddress: Yup.string().required("Required"),
    ifsc: Yup.string().required("Required"),
  });

  const saveBankDetails = () => {
    console.log("#######formik.values", formik.values);
  };

  const formik = useFormik({
    initialValues: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      bankAddress: "",
      ifsc: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      saveBankDetails();
    },
  });

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
              saveBankDetails();
            }}
          />
        </Avatar>
      </div>

      <Grid container spacing={4} sx={gridStyle}>
        <Grid item xs={4} sm={3} md={3}>
          <Typography style={titleStyle}>Beneficiary/Account Name:</Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Input
            id="accountName"
            name="accountName"
            style={dataStyle}
            value={formik?.values?.accountName}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={gridStyle}>
        <Grid item xs={4} sm={3} md={3}>
          <Typography style={titleStyle}>Bank Account Number:</Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Input
            id="accountNumber"
            name="accountNumber"
            style={dataStyle}
            value={formik?.values?.accountNumber}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={gridStyle}>
        <Grid item xs={4} sm={3} md={3}>
          <Typography style={titleStyle}>Bank Name:</Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Input
            id="bankName"
            name="bankName"
            style={dataStyle}
            value={formik?.values?.bankName}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={gridStyle}>
        <Grid item xs={4} sm={3} md={3}>
          <Typography style={titleStyle}>Bank Address:</Typography>
        </Grid>{" "}
        <Grid item xs={4} sm={4} md={4}>
          <Input
            id="bankAddress"
            name="bankAddress"
            style={dataStyle}
            value={formik?.values?.bankAddress}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={gridStyle}>
        <Grid item xs={4} sm={3} md={3}>
          <Typography style={titleStyle}>IFSC:</Typography>
        </Grid>{" "}
        <Grid item xs={4} sm={4} md={4}>
          <Input
            id="ifsc"
            name="ifsc"
            style={dataStyle}
            value={formik?.values?.ifsc}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
    </>
  );
}
