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
import GlobalFunctions from "../../../../utils/GlobalFunctions";

const UpdateCrmDetails = forwardRef((props, ref) => {
  const IntrogativeQueConstant = DropdownConstants.IntrogativeQueConstant;

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const orderId = reducerData.searchBar.orderId;
  const projectId = reducerData?.dashboard?.project?.projectId;

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Update crm details of customer",
      CHANGEIND: "U",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const saveCrmDetails = () => {
    console.log("#################foemik.values", formik.values);
    const entryData = {
      personal: [],
      address: [],
      bank: [],
      child: [],
      transact: [],
      crm: [
        {
          orderId: orderId,
          customerid: props.customerInfo.customerId,
          refer_by: formik.values.refer_by,
          vip: formik.values.vip,
          hni: formik.values.hni,
          hard: formik.values.hard,
          antagon: formik.values.antagon,
          spec_cond: formik.values.spec_cond,
          cond: formik.values.cond,
          spec_mode: formik.values.spec_mode,
          comm_mode: formik.values.comm_mode,
          pur_rsn: formik.values.pur_rsn,
          concess: formik.values.concess,
          concess_dtl: formik.values.concess_dlt,
        },
      ],
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
          props.setIsCrmInfoEditable(false);
        } else {
          snackbar.showError("Failed to update records!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with updating records", error);
      });
  };

  useImperativeHandle(ref, () => ({
    saveCrmDetails,
  }));

  const validationSchema = yup.object({
    address: yup.string(),
    city: yup.string(),
    pincode: yup.number(),
    email: yup.string(),
    state: yup.string(),
    country: yup.string(),

    mobileNumber: yup.number(),
  });

  const formik = useFormik({
    initialValues: {
      refer_by: props?.customerInfo?.referBy === "" ? "N" : "X",
      vip: props.customerInfo?.vip === "" ? "N" : "X",
      hni: props.customerInfo?.hni === "" ? "N" : "X",
      hard: props.customerInfo?.hard === "" ? "N" : "X",
      antagon: props.customerInfo?.antagon === "" ? "N" : "X",
      spec_cond: props.customerInfo?.specCond === "" ? "N" : "X",
      cond: props.customerInfo?.cond ? props.customerInfo?.cond : "",
      spec_mode: props.customerInfo?.specMode === "" ? "N" : "X",
      comm_mode: props.customerInfo?.commMode
        ? props.customerInfo?.commMode
        : "",
      pur_rsn: props.customerInfo?.purRsn ? props.customerInfo?.purRsn : "",
      concess: props.customerInfo?.concess === "" ? "N" : "X",
      concess_dlt: props.customerInfo?.concessDtl
        ? props.customerInfo?.concessDtl
        : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      saveCrmDetails(data);
    },
  });

  return (
    <formik>
      <Box sx={{ paddingTop: "0.5em" }}>
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="refer_by"
              name="refer_by"
              label="Known to Or Refferred by promotors"
              value={formik.values.refer_by}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.refer_by)}
              helperText={formik.errors.vipCustomer}
              required
            >
              {IntrogativeQueConstant?.map((data) => {
                return <MenuItem value={data.Id}>{data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="vip"
              name="vip"
              label="Politician / Bureaucrat / Civil Servant / Lawyer"
              value={formik.values.vip}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.vip)}
              helperText={formik.errors.vip}
              required
            >
              {IntrogativeQueConstant?.map((data) => {
                return <MenuItem value={data.Id}>{data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="hni"
              name="hni"
              label=" HNI (Business / Highly Designated) "
              value={formik.values.hni}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.hni)}
              helperText={formik.errors.hni}
              required
            >
              {IntrogativeQueConstant?.map((data) => {
                return <MenuItem value={data.Id}>{data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="hard"
              name="hard"
              label="Hard to deal with"
              value={formik.values.hard}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.hard)}
              helperText={formik.errors.hard}
              required
            >
              {IntrogativeQueConstant?.map((data) => {
                return <MenuItem value={data.Id}>{data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="antagon"
              name="antagon"
              label="Was Antagonised during purchase"
              value={formik.values.antagon}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.antagon)}
              helperText={formik.errors.antagon}
              required
            >
              {IntrogativeQueConstant?.map((data) => {
                return <MenuItem value={data.Id}>{data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="spec_cond"
              name="spec_cond"
              label="Has requested for specific condition"
              value={formik.values.spec_cond}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.spec_cond)}
              helperText={formik.errors.spec_cond}
              required
            >
              {IntrogativeQueConstant?.map((data) => {
                return <MenuItem value={data.Id}>{data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="cond"
              name="cond"
              label="If yes, Nature of condition"
              value={formik.values.cond}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.cond)}
              helperText={formik.errors.cond}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="spec_mode"
              name="spec_mode"
              label="Has Requested for specific mode of communication"
              value={formik.values.spec_mode}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.spec_mode)}
              helperText={formik.errors.spec_mode}
              required
            >
              {IntrogativeQueConstant?.map((data) => {
                return <MenuItem value={data.Id}>{data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="comm_mode"
              name="comm_mode"
              label="If yes, mode of communication"
              value={formik.values.comm_mode}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.comm_mode)}
              helperText={formik.errors.comm_mode}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="pur_rsn"
              name="pur_rsn"
              label="Reason of purchase "
              value={formik.values.pur_rsn}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.pur_rsn)}
              helperText={formik.errors.pur_rsn}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="concess"
              name="concess"
              label="Special consessions if any(only related to services)"
              value={formik.values.concess}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.concess)}
              helperText={formik.errors.concess}
              required
            >
              {IntrogativeQueConstant?.map((data) => {
                return <MenuItem value={data.Id}>{data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="concess_dlt"
              name="concess_dlt"
              label="If Special consession is applicable then details "
              value={formik.values.concess_dlt}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.concess_dlt)}
              helperText={formik.errors.concess_dlt}
            />
          </Grid>
        </Grid>
      </Box>
    </formik>
  );
});

export default UpdateCrmDetails;
