import React, { forwardRef, useImperativeHandle } from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import { useFormik } from "formik";
import { Grid, Box, MenuItem } from "@mui/material";
import UseCustomSnackbar from "../../../../components/snackbar/UseCustomSnackBar";
import InputField from "../../../../components/inputField/InputField";
import CrmDatePicker from "../../../../components/crmDatePicker/CrmDatePicker";
import DropdownConstants from "../../../../utils/DropdownConstants";
import GlobalFunctions from "./../../../../utils/GlobalFunctions";
import { useSelector } from "react-redux";

const UpdatePersonalDetails = forwardRef((props, ref) => {
  const snackbar = UseCustomSnackbar();
  const Genders = DropdownConstants.Gender;
  const IntrogativeQueConstant = DropdownConstants.IntrogativeQueConstant;
  const MaritalStatus = DropdownConstants.MaritalStatus;
  const reducerData = useSelector((state) => state);
  const projectId = reducerData?.dashboard?.project?.projectId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const orderId = reducerData.searchBar.orderId;

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Personal details of customer has been updated!",
      CHANGEIND: "U",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const savePersonalDetails = () => {
    const entryData = {
      personal: [
        {
          customerid: props.customerInfo.customerId,
          partner: props.customerInfo.partnerId,
          title: formik.values.title,
          fullname: formik.values.customerName,
          designation: formik.values.designation,
          dob: formik.values.birthday,
          occupation: formik.values.occupation,
          employer: formik.values.company,
          workplace: formik.values.workPlace,
          marital_status: formik.values.maritalStatus,
          sex: formik.values.gender,
          anniversary: formik.values.anniversary,
          salaried: formik.values.salaried,
          vip2: formik.values.vipCustomer,
          vip_rsn: formik.values.vipReason,
          cibil: formik.values.cibilScore,
          pan: formik.values.pan,
          ethnicity: formik.values.ethnicity,
          industry: formik.values.industry,
        },
      ],
      address: [],
      child: [],
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
          props.setIsPersonalDetailsEditable(false);
          props.getUpdatedData();
        } else {
          snackbar.showError("Failed to update records!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with updating records", error);
      });
  };

  useImperativeHandle(ref, () => ({
    savePersonalDetails,
  }));

  const validationSchema = yup.object({
    title: yup.string(),
    customerName: yup.string(),
    pan: yup.number(),
    maritalStatus: yup.string(),
    ethnicity: yup.string(),
    designation: yup.string(),
    occupation: yup.string(),
    industry: yup.string(),
    company: yup.string(),
    birthday: yup.date(),
    anniversary: yup.date(),
    workPlace: yup.string(),
    gender: yup.number(),
    salaried: yup?.string()?.required("required"),
    vipCustomer: yup?.string()?.required("required"),
    vipReason: yup?.string()?.required("required"),
    cibilScore: yup?.string()?.required("required"),
  });

  const formik = useFormik({
    initialValues: {
      title: props.customerInfo?.TitleId ? props.customerInfo.TitleId : "",
      customerName: props.customerInfo?.fullName
        ? props.customerInfo.fullName
        : "",
      pan: props.customerInfo?.PAN ? props.customerInfo?.PAN : "",
      maritalStatus: props.customerInfo?.marst ? props.customerInfo?.marst : "",
      ethnicity: props.customerInfo?.ethnicity
        ? props.customerInfo?.ethnicity
        : "",
      designation: props.customerInfo?.Designation
        ? props.customerInfo?.Designation
        : "",
      occupation: props.customerInfo?.occId ? props.customerInfo?.occId : "",
      industry: props.customerInfo?.industry
        ? props.customerInfo?.industry
        : "",
      company: props.customerInfo?.Company ? props.customerInfo?.Company : "",
      birthday: props.customerInfo?.DOB ? props.customerInfo?.DOB : "",
      anniversary: props.customerInfo?.anniversary
        ? props.customerInfo?.anniversary
        : "",
      workPlace: props.customerInfo?.workplace
        ? props.customerInfo?.workplace
        : "",
      gender: props.customerInfo?.sex ? props.customerInfo?.sex : "",
      address: props.customerInfo?.Address ? props.customerInfo?.Address : "",
      salaried:
        props?.customerInfo?.salaried === "X"
          ? props.customerInfo?.salaried
          : "N",
      vipCustomer:
        props.customerInfo?.vip2 === "X" ? props.customerInfo?.vip2 : "N",
      vipReason: props.customerInfo?.vipRsn ? props.customerInfo?.vipRsn : "",
      cibilScore: props.customerInfo?.cibil ? props.customerInfo?.cibil : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      savePersonalDetails(data);
    },
  });

  return (
    <formik>
      <Box sx={{ paddingTop: "0.5em" }}>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={2} md={2}>
            <InputField
              select
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              //   onChange={(e) => {
              //     formik.setFieldValue("title", e.target.value);
              //   }}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.title)}
              helperText={formik.errors.title}
              required
            >
              {props.titleData?.map((data) => {
                return (
                  <MenuItem value={data.TitleId}> {data.TitleName}</MenuItem>
                );
              })}
            </InputField>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <InputField
              id="customerName"
              name="customerName"
              label="Customer Name"
              value={formik.values.customerName}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="occupation"
              name="occupation"
              label="Occupation"
              value={formik.values.occupation}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.occupation)}
              helperText={formik.errors.occupation}
              required
            >
              {props.occupations?.map((data) => {
                return (
                  <MenuItem value={data.OccupationId}>
                    {" "}
                    {data.OccupationName}
                  </MenuItem>
                );
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="designation"
              name="designation"
              label="Designation"
              value={formik.values.designation}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="industry"
              name="industry"
              label="Industry"
              value={formik.values.industry}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="company"
              name="company"
              label="Company"
              value={formik.values.company}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="pan"
              name="pan"
              label="PAN"
              value={formik.values.pan}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <CrmDatePicker
              id="birthday"
              name="birthday"
              label="Birth Date"
              value={dayjs(formik.values.birthday)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("birthday", formattedDate, true);
              }}
              error={formik.touched.birthday && Boolean(formik.errors.birthday)}
              helperText={formik.touched.birthday && formik.errors.birthday}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <CrmDatePicker
              id="anniversary"
              name="anniversary"
              label="Anniversary"
              value={dayjs(formik.values.anniversary)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("anniversary", formattedDate, true);
              }}
              error={
                formik.touched.birthday && Boolean(formik.errors.anniversary)
              }
              helperText={formik.touched.birthday && formik.errors.anniversary}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="maritalStatus"
              name="maritalStatus"
              label="Marital Status"
              value={formik.values.maritalStatus}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.maritalStatus)}
              helperText={formik.errors.maritalStatus}
              required
            >
              {MaritalStatus?.map((data) => {
                return <MenuItem value={data.Id}> {data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="ethnicity"
              name="ethnicity"
              label="Ethnicity"
              value={formik.values.ethnicity}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="workPlace"
              name="workPlace"
              label="Work Place"
              value={formik.values.workPlace}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="gender"
              name="gender"
              label="Gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.gender)}
              helperText={formik.errors.gender}
              required
            >
              {Genders?.map((data) => {
                return <MenuItem value={data.Id}> {data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="salaried"
              name="salaried"
              label="Salaried"
              value={formik.values.salaried}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.salaried)}
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
              id="vipCustomer"
              name="vipCustomer"
              label="Vip Customer"
              value={formik.values.vipCustomer}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.vipCustomer)}
              helperText={formik.errors.vipCustomer}
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
              id="vipReason"
              name="vipReason"
              label="VIP Reason"
              value={formik.values.vipReason}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="cibilScore"
              name="cibilScore"
              label="Cibil Score"
              value={formik.values.cibilScore}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
      </Box>
    </formik>
  );
});

export default UpdatePersonalDetails;
