import React, { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, Typography, Input, Tooltip, Avatar } from "@mui/material";

export default function BasicInformation({ customerInfo }) {
  const validationSchema = Yup.object().shape({
    customerName: Yup.string().required("Required"),
    mobile: Yup.number().required("Required"),
    alterhateMobile: Yup.number().required("Required"),
    city: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    pincode: Yup.number().required("Required"),
    adharNumber: Yup.number().required("Required"),
    country: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    pan: Yup.string().required("Required"),
    email: Yup.string().required("Required"),
    dob: Yup.date().required("Required"),
    age: Yup.number().required("Required"),
    occupation: Yup.string().required("Required"),
    designation: Yup.string().required("Required"),
    company: Yup.string().required("Required"),
    maritalStatus: Yup.string().required("Required"),
    ethnicity: Yup.string().required("Required"),
    industry: Yup.string().required("Required"),
    workPlace: Yup?.string()?.required("Required"),
    childs: Yup?.number()?.required("required"),
    agreementAddr: Yup?.string()?.required("Required"),
  });

  const saveBasicDetails = () => {
    console.log("#######formik.values", formik.values);
  };

  const formik = useFormik({
    initialValues: {
      customerName: customerInfo?.customerName
        ? customerInfo?.customerName
        : "",
      mobile: customerInfo?.Mobile ? customerInfo?.Mobile : "",
      alterhateMobile: customerInfo?.alterhateMobile
        ? customerInfo?.alterhateMobile
        : "",
      city: customerInfo?.city ? customerInfo?.city : "",
      gender: customerInfo?.Gender ? customerInfo?.Gender : "",
      pincode: customerInfo?.pincode ? customerInfo?.pincode : "",
      adharNumber: customerInfo?.adharNumber ? customerInfo?.adharNumber : "",
      country: customerInfo?.Country ? customerInfo?.Country : "",
      state: customerInfo?.State ? customerInfo?.State : "",
      pan: customerInfo?.PAN ? customerInfo?.PAN : "",
      email: customerInfo?.Email ? customerInfo?.Email : "",
      dob: customerInfo?.DOB ? customerInfo?.DOB : "",
      age: customerInfo?.Age ? customerInfo?.Age : "",
      occupation: customerInfo?.Occupation ? customerInfo?.Occupation : "",
      designation: customerInfo?.Designation ? customerInfo?.Designation : "",
      company: customerInfo?.Company ? customerInfo?.Company : "",
      maritalStatus: customerInfo?.MaritalStatus
        ? customerInfo?.MaritalStatus
        : "",
      ethnicity: customerInfo?.Ethnicity ? customerInfo?.Ethnicity : "",
      industry: customerInfo?.Industry ? customerInfo?.Industry : "",
      workPlace: customerInfo?.WorkPlace ? customerInfo?.WorkPlace : "",
      childs: customerInfo?.childs ? customerInfo?.childs : "",
      agreementAddr: customerInfo?.agreementAddr
        ? customerInfo?.agreementAddr
        : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      saveBasicDetails();
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
    console.log("######customerInfo", customerInfo);
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
              saveBasicDetails();
            }}
          />
        </Avatar>
      </div>

      <Grid
        container
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          marginLeft: "2em",
          paddingTop: "2em",
          paddingBottom: "4em",
        }}
      >
        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Customer Name:</Typography>
            <Input
              id="customerName"
              name="customerName"
              style={dataStyle}
              value={formik?.values?.customerName}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Mobile:</Typography>
            <Input
              id="mobile"
              name="mobile"
              style={dataStyle}
              value={formik?.values?.mobile}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Alternate Mobile:</Typography>
            <Input
              id="alterhateMobile"
              name="alterhateMobile"
              style={dataStyle}
              value={formik?.values?.alterhateMobile}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>City:</Typography>
            <Input
              id="city"
              name="city"
              style={dataStyle}
              value={formik?.values?.city}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Pincode:</Typography>
            <Input
              id="pincode"
              name="pincode"
              style={dataStyle}
              value={formik?.values?.pincode}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Adhar Number:</Typography>
            <Input
              id="adharNumber"
              name="adharNumber"
              style={dataStyle}
              value={formik?.values?.adharNumber}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Country:</Typography>
            <Input
              id="country"
              name="country"
              style={dataStyle}
              value={formik?.values?.country}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>State:</Typography>
            <Input
              id="state"
              name="state"
              style={dataStyle}
              value={formik?.values?.state}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>PAN:</Typography>
            <Input
              id="pan"
              name="pan"
              style={dataStyle}
              value={formik?.values?.pan}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Email:</Typography>
            <Input
              id="email"
              name="email"
              style={dataStyle}
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>DOB:</Typography>
            <Input
              id="dob"
              name="dob"
              style={dataStyle}
              value={formik.values.dob}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Age:</Typography>
            <Input
              id="age"
              name="age"
              style={dataStyle}
              value={formik.values.age}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Occupation:</Typography>
            <Input
              id="occupation"
              name="occupation"
              style={dataStyle}
              value={formik.values.occupation}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Designation:</Typography>
            <Input
              id="designation"
              name="designation"
              style={dataStyle}
              value={formik.values.designation}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Gender:</Typography>
            <Input
              id="gender"
              name="gender"
              style={dataStyle}
              value={formik?.values?.gender}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Company:</Typography>
            <Input
              id="company"
              name="company"
              style={dataStyle}
              value={formik?.values?.company}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Marital Status:</Typography>
            <Input
              id="maritalStatus"
              name=""
              style={dataStyle}
              value={formik?.values?.maritalStatus}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Ethnicity:</Typography>
            <Input
              id="ethnicity"
              name="ethnicity"
              style={dataStyle}
              value={formik?.values?.ethnicity}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Industry:</Typography>
            <Input
              id="industry"
              name="industry"
              style={dataStyle}
              value={formik?.values?.industry}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Have Children:</Typography>
            <Input
              id="company"
              name="company"
              style={dataStyle}
              value={formik?.values?.company}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Work Place:</Typography>
            <Input
              id="workPlace"
              name="workPlace"
              style={dataStyle}
              value={formik?.values?.workPlace}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Number Of Children:</Typography>
            <Input
              id="childs"
              name="childs"
              style={dataStyle}
              value={formik?.values?.childs}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Agreement Address:</Typography>
            <Input
              id="agreementAddr"
              name="agreementAddr"
              style={dataStyle}
              value={formik?.values?.agreementAddr}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Address:</Typography>
            <Tooltip title={customerInfo?.Address} placement="top">
              <Input
                style={{
                  "&.MuiInputBase-input": {
                    width: "30em",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    boxSizing: "border-box",
                  },
                  boxSizing: "border-box",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  width: "30.5em",
                  marginLeft: "1em",
                  dataStyle,
                }}
                id="customerInfo"
                name="customerInfo"
                value={formik.values.address}
                onChange={formik.handleChange}
              />
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
