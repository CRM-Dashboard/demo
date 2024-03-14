import React, { forwardRef, useImperativeHandle, useState } from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import { useFormik } from "formik";
import { Grid, Box, Typography, MenuItem } from "@mui/material";
import InputField from "../../components/inputField/InputField";
import CrmDatePicker from "../../components/crmDatePicker/CrmDatePicker";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";
import { useSelector } from "react-redux/es/hooks/useSelector";
import MergeTypeOutlinedIcon from "@mui/icons-material/MergeTypeOutlined";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const CreateNewActivity = forwardRef((props, ref) => {
  const [error, setError] = useState("Required");

  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const snackbar = UseCustomSnackbar();

  const createActivity = () => {
    const entryData = {
      vbeln: orderId,
      activityMode: formik.values.activityMode,
      time: formik.values.time,
      erdat: formik.values.date,
      action: formik.values.action,
      remark: formik.values.remark,
      amount: formik.values.amount,
      act_typ: formik.values.activityType,
      pltac: "",
    };

    if (!formik.values.remark) {
      setError("Required");
    } else {
      setError("");
    }

    if (Object.keys(formik.errors).length === 0 && error !== "Required") {
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("entryData", JSON.stringify(entryData));

      fetch("/api/activity/createActivity", { method: "POST", body: formData })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            snackbar.showSuccess("Activity created successfully!");
            props.setopenCreateForm(false);
            props.getTableData();
          }
        })
        .catch((error) => {
          if (error) {
            snackbar.showError(
              "Error while creating activity. Please try again!"
            );
          }
        });
    }
  };

  useImperativeHandle(ref, () => ({
    createActivity,
  }));

  const validationSchema = yup.object({
    activityMode: yup.string().required("Required"),
    time: yup.string().required("Required"),
    date: yup.date().required("Required"),
    action: yup.string().required("Required"),
    remark: yup.string().required("Required"),
    amount: yup.number().required("Required"),
    activityType: yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      activityMode: "",
      time: "",
      date: " ",
      action: "",
      remark: "",
      amount: "",
      activityType: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      createActivity(data);
    },
  });

  return (
    <formik>
      <Box sx={{ paddingTop: "1.5em" }}>
        <Grid container spacing={4}>
          <Grid
            item
            xs={4}
            sm={8}
            md={8}
            sx={{ display: "flex", fontWeight: "bold" }}
          >
            <Typography
              sx={{ marginLeft: "1em", fontWeight: "bold", fontSize: "25px" }}
            >
              New Activity
            </Typography>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <LocalActivityIcon />
            <Typography sx={{ marginLeft: "1em" }}> Action</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="action"
              name="action"
              label="action"
              value={formik.values.action}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.action)}
              helperText={formik.errors.action}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <GroupOutlinedIcon />
            <Typography sx={{ marginLeft: "1em" }}> Amount</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="amount"
              name="amount"
              label="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.amount)}
              helperText={formik.errors.amount}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <DateRangeOutlinedIcon />
            <Typography sx={{ marginLeft: "1em" }}> Date</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <CrmDatePicker
              id="date"
              name="date"
              label="Date"
              value={dayjs(formik.values.date)}
              onChange={(value) => formik.setFieldValue("date", value, true)}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.errors.date}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <DateRangeOutlinedIcon />
            <Typography sx={{ marginLeft: "1em" }}> Time</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                id="time"
                name="time"
                label="Time"
                value={formik.values.time}
                sx={{
                  "&.MuiInputBase-input": {
                    height: "2em",
                    padding: 0,
                  },
                  width: "100%",
                }}
                onChange={(value) => formik.setFieldValue("time", value, true)}
                error={Boolean(formik.errors.time)}
                helperText={formik.touched.time && formik.errors.time}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <MergeTypeOutlinedIcon />
            <Typography sx={{ marginLeft: "1em" }}> Activity Type </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              select
              id="activityType"
              name="activityType"
              label="Activity Type"
              value={formik.values.activityType}
              onChange={(e) => {
                formik.setFieldValue("activityType", e.target.value);
              }}
              error={Boolean(formik.errors.activityType)}
              helperText={formik.errors.activityType}
              required
            >
              {props.actTypeData?.map((data) => {
                return <MenuItem value={data.typ}> {data.typTxt}</MenuItem>;
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <InterpreterModeIcon />
            <Typography sx={{ marginLeft: "1em" }}> Activity Mode </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              select
              id="activityMode"
              name="activityMode"
              label="Activity Mode"
              value={formik.values.activityMode}
              onChange={(e) => {
                formik.setFieldValue("activityMode", e.target.value);
              }}
              error={Boolean(formik.errors.activityMode)}
              helperText={formik.errors.activityMode}
              required
            >
              {props.actModeData?.map((data) => {
                return <MenuItem value={data.mode}> {data.modeTxt}</MenuItem>;
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <DriveFileRenameOutlineIcon />
            <Typography sx={{ marginLeft: "1em" }}> Remarks </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <textarea
              id="remark"
              name="remark"
              label="Remark"
              style={{ width: "25.5em" }}
              value={formik.values.remarks}
              onChange={(e) => {
                // formik.handleChange();
                formik.setFieldValue("remark", e.target.value);
                setError("");
              }}
            />
            {error && (
              <Typography style={{ color: "red", fontSize: "13px" }}>
                {error}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </formik>
  );
});

export default CreateNewActivity;
