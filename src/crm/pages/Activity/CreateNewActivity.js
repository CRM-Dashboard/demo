import React, { forwardRef, useImperativeHandle } from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import { useFormik } from "formik";
import { Grid, Box, Typography, MenuItem } from "@mui/material";
import InputField from "../../components/inputField/InputField";
import CrmDatePicker from "../../components/crmDatePicker/CrmDatePicker";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import ChecklistRtlOutlinedIcon from "@mui/icons-material/ChecklistRtlOutlined";
import MergeTypeOutlinedIcon from "@mui/icons-material/MergeTypeOutlined";

const CreateNewActivity = forwardRef((props, ref) => {
  // const [selectedFile, setSelectedFile] = useState(null);

  // const reducerData = useSelector((state) => state);
  // const orderId = reducerData.searchBar.orderId;
  // const snackbar = UseCustomSnackbar();

  const createActivity = () => {
    const entryData = {
      activity: formik.values.activity,
      owner: formik.values.schemeEnd,
      startTime: formik.values.owner,
      endTime: formik.values.endTime,
      status: formik.values.status,
      activityType: formik.values.activityType,
    };
    console.log("######entryData", entryData);

    // fetch(`/sap/bc/react/crm/receipt_create?sap-client=250`, {
    //   method: "POST",
    //   body: JSON.stringify(entryData),
    //   headers: {
    //     Accept: "application/json",
    //     Origin: "http://115.124.113.252:8000/",
    //     Referer: "http://115.124.113.252:8000/",
    //     "Content-Type": "application/json",
    //   },
    //   credentials: "include",
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (data) {
    //       snackbar.showSuccess("Payment details created successfully!");
    //     }
    //   })
    //   .catch((error) => {
    //     if (error) {
    //       snackbar.showError(
    //         "Error while creating payment details. Please try again!"
    //       );
    //     }
    //   });
  };

  useImperativeHandle(ref, () => ({
    createActivity,
  }));

  const validationSchema = yup.object({
    activity: yup.string(),
    owner: yup.string(),
    startTime: yup.date(),
    endTime: yup.date(),
    status: yup.string(),
    activityType: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      activity: "",
      owner: "",
      startTime: new Date(),
      endTime: new Date(),
      status: "",
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
            <Typography sx={{ marginLeft: "1em" }}> Activity</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="activity"
              name="activity"
              label="Activity"
              value={formik.values.activity}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <GroupOutlinedIcon />
            <Typography sx={{ marginLeft: "1em" }}> Owner</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="owner"
              name="owner"
              label="Owner"
              value={formik.values.owner}
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
            <DateRangeOutlinedIcon />
            <Typography sx={{ marginLeft: "1em" }}> End Date</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <CrmDatePicker
              id="endDate"
              name="endDate"
              label="End Date"
              value={dayjs(formik.values.endDate)}
              onChange={(value) => formik.setFieldValue("endDate", value, true)}
              error={formik.touched.endDate && Boolean(formik.errors.endDate)}
              helperText={formik.touched.endDate && formik.errors.endDate}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <ChecklistRtlOutlinedIcon />
            <Typography sx={{ marginLeft: "1em" }}> Status</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              select
              id="status"
              name="status"
              label="Status"
              value={formik.values.status}
              onChange={(e) => {
                formik.setFieldValue("status", e.target.value);
              }}
              error={Boolean(formik.errors.status)}
              helperText={formik.errors.status}
              required
            >
              <MenuItem value=""> {"Select status"} </MenuItem>
              <MenuItem value="Done">Done</MenuItem>
              <MenuItem value="In Process">In Process</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </InputField>
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
      </Box>
    </formik>
  );
});

export default CreateNewActivity;
