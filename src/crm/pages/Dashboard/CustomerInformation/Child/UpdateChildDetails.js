/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useImperativeHandle } from "react";
import * as yup from "yup";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { Grid, Box, MenuItem } from "@mui/material";
import DropdownConstants from "../../../../utils/DropdownConstants";
import InputField from "../../../../components/inputField/InputField";
import CrmDatePicker from "../../../../components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../../../components/snackbar/UseCustomSnackBar";
import GlobalFunctions from "./../../../../utils/GlobalFunctions";

const UpdateChildDetails = forwardRef((props, ref) => {
  const Genders = DropdownConstants.Gender;

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const projectId = reducerData?.dashboard?.project?.projectId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const IntrogativeQueConstant = DropdownConstants.IntrogativeQueConstant;
  const orderId = reducerData.searchBar.orderId;

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Update child details of customer",
      CHANGEIND: "U",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const saveChildDetails = () => {
    console.log("#################foemik.values", formik.values);
    const entryData = {
      personal: [],
      address: [],
      child: [
        {
          customerid: props.customerInfo.customerId,
          katr5: formik.values.haveChild,
          children: formik.values.noOfChild,
          child1_name: formik.values.child1Name,
          child1_dob: formik.values.child1Dob,
          child1_acad: formik.values.child1Acad,
          child2_name: formik.values.child2Name,
          child2_dob: formik.values.child2Dob,
          child2_acad: formik.values.child2Acad,
          child3_name: formik.values.child3Name,
          child3_dob: formik.values.child3Dob,
          child3_acad: formik.values.child3Acad,
          child1_gender: formik.values.child1Gender,
          child2_gender: formik.values.child2Gender,
          child3_gender: formik.values.child3Gender,
        },
      ],
      bank: [],
    };
    console.log("######entryData", entryData);

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("projectId", projectId);
    formData.append("entryData", JSON.stringify(entryData));

    fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/saveCustomer", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          saveLog();
          snackbar.showSuccess("Records updated successfully!");
          props.getUpdatedData();
          props.setChildInfoEditable(false);
        } else {
          snackbar.showError("Failed to update records!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with updating records", error);
      });
  };

  useImperativeHandle(ref, () => ({
    saveChildDetails,
  }));

  const validationSchema = yup.object({
    haveChild: yup.string(),
    noOfChild: yup.string(),
    child1Name: yup.string(),
    child1Gender: yup.string(),
    child1Dob: yup.date(),
    child1Acad: yup.string(),
    child2Name: yup.string(),
    child2Gender: yup.string(),
    child2Dob: yup.date(),
    child2Acad: yup.string(),
    child3Name: yup.string(),
    child3Gender: yup.string(),
    child3Dob: yup.date(),
    child3Acad: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      haveChild: props.customerInfo.child === "" ? "N" : "X",
      noOfChild: props.customerInfo.children ? props.customerInfo.children : "",
      child1Name: props.customerInfo.child1Name
        ? props.customerInfo.child1Name
        : "",
      child1Gender:
        props.customerInfo.child1Gender === "Male"
          ? 2
          : props.customerInfo.child1Gender === "Female"
          ? 1
          : " ",
      child1Dob:
        props.customerInfo.child1Dob === "0000-00-00"
          ? null
          : props.customerInfo.child1Dob,
      child1Acad: props.customerInfo.child1Acad
        ? props.customerInfo.child1Acad
        : "",
      child2Name: props.customerInfo.child2Name
        ? props.customerInfo.child2Name
        : "",
      child2Gender:
        props.customerInfo.child2Gender === "Male"
          ? 2
          : props.customerInfo.child2Gender === "Female"
          ? 1
          : " ",
      child2Dob:
        props.customerInfo.child2Dob === "0000-00-00"
          ? null
          : props.customerInfo.child2Dob,
      child2Acad: props.customerInfo.child2Acad
        ? props.customerInfo.child2Acad
        : "",
      child3Name: props.customerInfo.child3Name
        ? props.customerInfo.child3Name
        : "",
      child3Gender:
        props.customerInfo.child3Gender === "Male"
          ? 2
          : props.customerInfo.child3Gender === "Female"
          ? 1
          : " ",
      child3Dob:
        props.customerInfo.child3Dob === "0000-00-00"
          ? null
          : props.customerInfo.child3Dob,
      child3Aca: props.customerInfo.child3Acad
        ? props.customerInfo.child3Acad
        : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      saveChildDetails(data);
    },
  });

  return (
    <formik>
      <Box sx={{ paddingTop: "0.5em" }}>
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="haveChild"
              name="haveChild"
              label="Have Child?"
              value={formik.values.haveChild}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.haveChild)}
              helperText={formik.errors.haveChild}
              required
            >
              {IntrogativeQueConstant?.map((data) => {
                return <MenuItem value={data.Id}>{data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="noOfChild"
              name="Number Of Child"
              label="Number Of Child"
              value={formik.values.noOfChild}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="child1Nameaddress3"
              name="child1Name"
              label="Child 1 Name"
              value={formik.values.child1Name}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <CrmDatePicker
              id="child1Dob"
              name="child1Dob"
              label="Child 1 DOB"
              value={dayjs(formik.values.child1Dob)}
              onChange={(value) =>
                formik.setFieldValue("child1Dob", value, true)
              }
              error={
                formik.touched.child1Dob && Boolean(formik.errors.child1Dob)
              }
              helperText={formik.errors.child1Dob}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="child1Gender"
              name="child1Gender"
              label="Child 1 Gender"
              value={formik.values.child1Gender}
              //   onChange={(value) => {
              //     formik.setValues("child1Gender", value, true);
              //   }}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.child1Gender)}
              helperText={formik.errors.child1Gender}
              required
            >
              {Genders?.map((data) => {
                return <MenuItem value={data.Id}> {data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="child1Acad"
              name="child1Acad"
              label="Child 1 Academy"
              value={formik.values.child1Acad}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="child2Name"
              name="child2Name"
              label="Child 2 Name"
              value={formik.values.child2Name}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <CrmDatePicker
              id="child2Dob"
              name="child2Dob"
              label="Child 2 DOB"
              value={dayjs(formik.values.child2Dob)}
              onChange={(value) =>
                formik.setFieldValue("child2Dob", value, true)
              }
              error={
                formik.touched.child2Dob && Boolean(formik.errors.child2Dob)
              }
              helperText={formik.errors.child2Dob}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="child2Gender"
              name="child2Gender"
              label="Child 2 Gender"
              value={formik.values.child2Gender}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.child2Gender)}
              helperText={formik.errors.child2Gender}
              required
            >
              {Genders?.map((data) => {
                return <MenuItem value={data.Id}> {data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="child2Acad"
              name="child2Acad"
              label="Child 2 Academy"
              value={formik.values.child2Acad}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="child3Name"
              name="child3Name"
              label="Child 3 Name"
              value={formik.values.child3Name}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <CrmDatePicker
              id="child3Dob"
              name="child3Dob"
              label="Child 3 DOB"
              value={dayjs(formik.values.child3Dob)}
              onChange={(value) =>
                formik.setFieldValue("child3Dob", value, true)
              }
              error={
                formik.touched.child3Dob && Boolean(formik.errors.child3Dob)
              }
              helperText={formik.errors.child3Dob}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="child3Gender"
              name="child3Gender"
              label="Child 3 Gender"
              value={formik.values.child3Gender}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.child3Gender)}
              helperText={formik.errors.child3Gender}
              required
            >
              {Genders?.map((data) => {
                return <MenuItem value={data.Id}> {data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="child3Acad"
              name="child3Acad"
              label="Child 3 Academy"
              value={formik.values.child3Acad}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
      </Box>
    </formik>
  );
});

export default UpdateChildDetails;
