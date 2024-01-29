import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, Typography, Input, Avatar } from "@mui/material";

export default function ChildInformation() {
  const titleStyle = {
    "font-weight": "bold",
    "font-size": 14,
    marginLeft: "1.5em",
    marginTop: "0.8em",
  };
  const dataStyle = { "font-size": 14, marginLeft: "1.5em", paddinTop: "1em" };
  const gridStyle = { display: "flex", marginLeft: "-1em" };

  const validationSchema = Yup.object().shape({
    child1Name: Yup.string().required("Required"),
    child1Dob: Yup.date().required("Required"),
    child1Gender: Yup.number().required("Required"),
    child1Academic: Yup.string().required("Required"),
    child2Name: Yup.string().required("Required"),
    child2Dob: Yup.date().required("Required"),
    child2Gender: Yup.number().required("Required"),
    child2Academic: Yup.string().required("Required"),
    child3Name: Yup.string().required("Required"),
    child3Dob: Yup.date().required("Required"),
    child3Gender: Yup.number().required("Required"),
    child3Academic: Yup.string().required("Required"),
  });

  const saveChildDetails = () => {
    console.log("#######formik.values", formik.values);
  };

  const formik = useFormik({
    initialValues: {
      child1Name: "",
      child1Dob: new Date(),
      child1Gender: "",
      child1Academic: "",
      child2Name: "",
      child2Dob: new Date(),
      child2Gender: "",
      child2Academic: "",
      child3Name: "",
      child3Dob: new Date(),
      child3Gender: "",
      child3Academic: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      saveChildDetails();
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
              saveChildDetails();
            }}
          />
        </Avatar>
      </div>
      <div
        container
        // columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          marginLeft: "2em",
          paddingTop: "2em",
          paddingBottom: "4em",
        }}
      >
        <Typography
          style={{
            marginLeft: "1.5em",
            fontWeight: "bold",
            marginTop: "1em",
          }}
        >
          Child 1
        </Typography>
        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Name:</Typography>
            <Input
              id="child1Name"
              name="child1Name"
              style={dataStyle}
              value={formik?.values?.child1Name}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>DOB:</Typography>
            <Input
              id="child1Dob"
              name="child1Dob"
              style={dataStyle}
              value={formik?.values?.child1Dob}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Gender:</Typography>
            <Input
              id="child1Gender"
              name="child1Gender"
              style={dataStyle}
              value={formik?.values?.child1Gender}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Academic:</Typography>
            <Input
              id="child1Academic"
              name="child1Academic"
              style={dataStyle}
              value={formik?.values?.child1Academic}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
      </div>
      <div
        container
        // columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          marginLeft: "2em",
          paddingBottom: "4em",
        }}
      >
        <Typography
          style={{ marginLeft: "1.5em", fontWeight: "bold", marginTop: "1em" }}
        >
          Child 2
        </Typography>
        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Name:</Typography>
            <Input
              id="child2Name"
              name="child2Name"
              style={dataStyle}
              value={formik?.values?.child2Name}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>DOB:</Typography>
            <Input
              id="child2Dob"
              name="child2Dob"
              style={dataStyle}
              value={formik?.values?.child2Dob}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Gender:</Typography>
            <Input
              id="child2Gender"
              name="child2Gender"
              style={dataStyle}
              value={formik?.values?.child2Gender}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Academic:</Typography>
            <Input
              id="child2Academic"
              name="child2Academic"
              style={dataStyle}
              value={formik?.values?.child2Academic}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
      </div>
      <div
        container
        // columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          marginLeft: "2em",
          paddingBottom: "4em",
        }}
      >
        <Typography
          style={{ marginLeft: "1.5em", fontWeight: "bold", marginTop: "1em" }}
        >
          Child 3
        </Typography>
        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Name:</Typography>
            <Input
              id="child3Name"
              name="child3Name"
              style={dataStyle}
              value={formik?.values?.child3Name}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>DOB:</Typography>
            <Input
              id="child3Dob"
              name="child3Dob"
              style={dataStyle}
              value={formik?.values?.child3Dob}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Gender:</Typography>
            <Input
              id="child3Gender"
              name="child3Gender"
              style={dataStyle}
              value={formik?.values?.child3Gender}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Academic:</Typography>
            <Input
              id="child3Academic"
              name="child3Academic"
              style={dataStyle}
              value={formik?.values?.child3Academic}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
