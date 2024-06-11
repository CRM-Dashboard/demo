import React, { useRef, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, Typography, Avatar } from "@mui/material";
import CrmModal from "../../../../components/crmModal/CrmModal";
import UpdateChildDetails from "./UpdateChildDetails";

export default function ChildInformation({ customerInfo, getUpdatedData }) {
  const [childInfoEditable, setChildInfoEditable] = useState(false);

  const childRef = useRef(null);

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
    child: Yup.string().required("Required"),
    children: Yup.number().required("Required"),
    child1Name: Yup.string().required("Required"),
    child1Dob: Yup.string().required("Required"),
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
    if (childRef.current) {
      childRef.current.saveChildDetails();
    }
  };

  const formik = useFormik({
    initialValues: {
      child: customerInfo?.child ? customerInfo?.child : "",
      children: customerInfo?.children ? customerInfo?.children : "",
      child1Name: customerInfo?.child1Name ? customerInfo?.child1Name : "",
      child1Dob: customerInfo?.child1Dob ? customerInfo?.child1Dob : "",
      child1Gender: customerInfo?.child1Gender
        ? customerInfo?.child1Gender
        : "",
      child1Academic: customerInfo?.child1Acad ? customerInfo?.child1Acad : "",
      child2Name: customerInfo?.child2Name ? customerInfo?.child2Name : "",
      child2Dob: customerInfo?.child2Dob ? customerInfo?.child2Dob : "",
      child2Gender: customerInfo?.child2Gender
        ? customerInfo?.child2Gender
        : "",
      child2Academic: customerInfo?.child2Acad ? customerInfo?.child2Acad : "",
      child3Name: customerInfo?.child3Name ? customerInfo?.child3Name : "",
      child3Dob: customerInfo?.child3Dob ? customerInfo?.child3Dob : "",
      child3Gender: customerInfo?.child3Gender
        ? customerInfo?.child3Gender
        : "",
      child3Academic: customerInfo?.child3Acad ? customerInfo?.child3Acad : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // const data = values;
      saveChildDetails();
    },
  });

  return (
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
              <Typography>{formik?.values?.child}</Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
          >
            <Grid xs={3} sm={3} md={3}>
              <Typography style={titleStyle}>Number of Children:</Typography>
            </Grid>
            <Grid xs={5} sm={5} md={5}>
              <Typography> {formik?.values?.children} </Typography>
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
              <Typography>{formik?.values?.child1Name}</Typography>
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
              <Typography>{formik.values.child1Dob}</Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
          >
            <Grid xs={3} sm={3} md={3}>
              <Typography style={titleStyle}>Gender:</Typography>
            </Grid>
            <Grid xs={8} sm={8} md={8}>
              <Typography> {formik?.values?.child1Gender} </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
          >
            <Grid xs={3} sm={3} md={3}>
              <Typography style={titleStyle}>Academic:</Typography>
            </Grid>
            <Grid xs={5} sm={5} md={5}>
              <Typography> {formik?.values?.child1Academic} </Typography>
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
              <Typography>{formik?.values?.child2Name}</Typography>
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
              <Typography>{formik.values.child2Dob}</Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
          >
            <Grid xs={3} sm={3} md={3}>
              <Typography style={titleStyle}>Gender:</Typography>
            </Grid>
            <Grid xs={8} sm={8} md={8}>
              <Typography> {formik?.values?.child2Gender} </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
          >
            <Grid xs={3} sm={3} md={3}>
              <Typography style={titleStyle}>Academic:</Typography>
            </Grid>
            <Grid xs={5} sm={5} md={5}>
              <Typography> {formik?.values?.child2Academic} </Typography>
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
              <Typography>{formik?.values?.child3Name}</Typography>
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
              <Typography>{formik.values.child3Dob}</Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
          >
            <Grid xs={3} sm={3} md={3}>
              <Typography style={titleStyle}>Gender:</Typography>
            </Grid>
            <Grid xs={8} sm={8} md={8}>
              <Typography> {formik?.values?.child3Gender} </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
          >
            <Grid xs={3} sm={3} md={3}>
              <Typography style={titleStyle}>Academic:</Typography>
            </Grid>
            <Grid xs={5} sm={5} md={5}>
              <Typography> {formik?.values?.child3Academic} </Typography>
            </Grid>
          </Grid>
        </Grid>
        <br />
      </Grid>
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
