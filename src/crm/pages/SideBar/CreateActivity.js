import React, { forwardRef, useImperativeHandle } from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import { useFormik } from "formik";
import { Grid, Box, Typography, MenuItem } from "@mui/material";
import InputField from "../../components/inputField/InputField";
import CrmDatePicker from "../../components/crmDatePicker/CrmDatePicker";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import ChecklistRtlOutlinedIcon from "@mui/icons-material/ChecklistRtlOutlined";
import MergeTypeOutlinedIcon from "@mui/icons-material/MergeTypeOutlined";

const CreateActivity = forwardRef((props, ref) => {
  // const reducerData = useSelector((state) => state);
  // const orderId = reducerData.searchBar.orderId;
  // const snackbar = UseCustomSnackbar();

  const createActivity = () => {
    // const entryData = {
    //   amount: formik.values.amount,
    //   time: formik.values.time,
    //   startDate: formik.values.startDate,
    //   remarks: formik.values.remarks,
    //   activityType: formik.values.activityType,
    // };
  };

  useImperativeHandle(ref, () => ({
    createActivity,
  }));

  const validationSchema = yup.object({
    amount: yup.string(),
    time: yup.date(),
    startDate: yup.date(),
    remarks: yup.string(),
    activityType: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      amount: "",
      remarks: "",
      time: new Date(),
      startDate: new Date(),
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
            <Typography sx={{ marginLeft: "1em" }}> Amount</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="amount"
              name="amount"
              label="Amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <DateRangeOutlinedIcon />
            <Typography sx={{ marginLeft: "1em" }}> Start Date</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <CrmDatePicker
              id="startDate"
              name="startDate"
              label="Start Date"
              value={dayjs(formik.values.startDate)}
              onChange={(value) =>
                formik.setFieldValue("startDate", value, true)
              }
              error={
                formik.touched.startDate && Boolean(formik.errors.startDate)
              }
              helperText={formik.touched.startDate && formik.errors.startDate}
            />
          </Grid>
        </Grid>

        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <ChecklistRtlOutlinedIcon />
            <Typography sx={{ marginLeft: "1em" }}> Time </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="time"
              name="time"
              label="Time"
              value={formik.values.time}
              onChange={(e) => {
                formik.setFieldValue("time", e.target.value);
              }}
              error={Boolean(formik.errors.time)}
              helperText={formik.errors.time}
              required
            />
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
              <MenuItem value=""> {"Select activity type"} </MenuItem>
              <MenuItem value="Virtual Meeting">Virtual Meeting</MenuItem>
              <MenuItem value="Phone Call">Phone Call</MenuItem>
              <MenuItem value="On Site Visit">On Site Visit</MenuItem>
            </InputField>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <ChecklistRtlOutlinedIcon />
            <Typography sx={{ marginLeft: "1em" }}> Remarks </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <textarea
              id="remarks"
              name="remarks"
              label="Remarks"
              style={{ width: "25.5em" }}
              value={formik.values.remarks}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
      </Box>
    </formik>
  );
});

export default CreateActivity;
