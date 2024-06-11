import React, { useState, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import CrmModal from "../../../../components/crmModal/CrmModal";
import { Grid, Typography, Avatar } from "@mui/material";
import UpdateCustomDetails from "../Customisation/UpdateCustomDetails";

export default function CustomisationDetails({ customerInfo }) {
  const [isCustomEditable, setIsCustomEditable] = useState(false);

  const customRef = useRef(null);

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
    customApplicable: Yup.string().required("Required"),
    natureOfCustom: Yup.number().required("Required"),
    customisationDetails: Yup.string().required("Required"),
    finalisedTerms: Yup.string().required("Required"),
    otherDetails: Yup.string().required("Required"),
  });

  const saveCustomDetails = () => {
    if (customRef.current) {
      customRef.current.saveCustomDetails();
    }
  };

  const formik = useFormik({
    initialValues: {
      customApplicable: customerInfo?.custom ? customerInfo?.custom : "",
      natureOfCustom: customerInfo?.customNature
        ? customerInfo?.customNature
        : "",
      customisationDetails: customerInfo?.pddMail ? customerInfo?.pddMail : "",
      finalisedTerms: customerInfo?.terms ? customerInfo?.terms : "",
      otherDetails: customerInfo?.otherDetail ? customerInfo?.otherDetail : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // const data = values;
      saveCustomDetails();
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
            Customisation Details
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
                  setIsCustomEditable(!isCustomEditable);
                  saveCustomDetails();
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
                Customisation Applicable
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {formik?.values?.customApplicable === "X" ? "Yes" : "No"}
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
                Nature of customisation in the unit
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{formik?.values?.natureOfCustom}</Typography>
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
                Details of customisation in the unit sent to PDD
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>
                {" "}
                {formik?.values?.customisationDetails === "X" ? "Yes" : "No"}
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
                Finalised Terms and condition
              </Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography> {formik?.values?.finalisedTerms}</Typography>
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
              <Typography style={titleStyle}>Any Other Details</Typography>
            </Grid>
            <Grid xs={4} sm={4} md={4}>
              <Typography>{formik?.values?.otherDetails}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <br />
      </Grid>
      <CrmModal
        maxWidth="sm"
        show={isCustomEditable}
        handleShow={() => {
          setIsCustomEditable(false);
        }}
        primaryBtnText="Update"
        SecondaryBtnText="Close"
        secondarySave={() => {
          setIsCustomEditable(false);
        }}
        primarySave={() => {
          saveCustomDetails();
        }}
        title="Customisation Details"
      >
        <UpdateCustomDetails
          ref={customRef}
          customerInfo={customerInfo}
          setIsCustomEditable={setIsCustomEditable}
        />
      </CrmModal>
    </>
  );
}
