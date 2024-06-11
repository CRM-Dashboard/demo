/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import moment from "moment";
import { useFormik } from "formik";
import GlobalFunctions from "../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Grid, Box, Typography, MenuItem } from "@mui/material";
import InputField from "../../components/inputField/InputField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import CrmDatePicker from "../../components/crmDatePicker/CrmDatePicker";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import MergeTypeOutlinedIcon from "@mui/icons-material/MergeTypeOutlined";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

const CreateNewActivity = forwardRef((props, ref) => {
  const [error, setError] = useState("Required");
  const [subActData, setSubActData] = useState(props.subActTypeData);

  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const snackbar = UseCustomSnackbar();

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Create Activity",
      CHANGEIND: "I",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const createActivity = () => {
    const entryData = {
      vbeln: orderId,
      act_mode: formik.values.activityMode,
      pltac: moment(formik.values.time.$d).format("HH:mm:ss"),
      erdat: formik.values.date,
      action: formik.values.action,
      remark: formik.values.remark,
      dmbtr: formik.values.amount,
      act_typ: formik.values.subActivity,
      dp_code: formik.values.dpCode,
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

      fetch(
        "https://gera-crm-server.azurewebsites.net//api/activity/createActivity",
        { method: "POST", body: formData }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            saveLog();
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
    time: yup.date().required("Required"),
    date: yup.date().required("Required"),
    action: yup.string().required("Required"),
    remark: yup.string().required("Required"),
    amount: yup.number().required("Required"),
    activityType: yup.string().required("Required"),
    subActivity: yup.number().required("Required"),
    dpCode: yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      activityMode: "",
      time: dayjs(),
      date: " ",
      action: "",
      remark: "",
      amount: "",
      activityType: "",
      subActivity: "",
      dpCode: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      createActivity(data);
    },
  });

  useEffect(() => {
    const subData = props.subActTypeData?.filter((data) => {
      return data.actTyp == formik.values.activityType;
    });
    setSubActData(subData);
  }, [formik.values.activityType]);

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
            <MergeTypeOutlinedIcon />
            <Typography sx={{ marginLeft: "1em" }}> Activity </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              select
              id="activityType"
              name="activityType"
              label="Activity"
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
            <MergeTypeOutlinedIcon />
            <Typography sx={{ marginLeft: "1em" }}> Sub-Activity </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              select
              id="subActivity"
              name="subActivity"
              label="Sub-Activity"
              value={formik.values.subActivity}
              onChange={(e) => {
                formik.setFieldValue("subActivity", e.target.value);
              }}
              error={Boolean(formik.errors.subActivity)}
              helperText={formik.errors.subActivity}
              required
            >
              {subActData?.map((data) => {
                return (
                  <MenuItem value={data.actSubtyp}>
                    {" "}
                    {data.actSubtypTxt}
                  </MenuItem>
                );
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <MergeTypeOutlinedIcon />
            <Typography sx={{ marginLeft: "1em" }}>
              {" "}
              Disposition Code{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              select
              id="dpCode"
              name="dpCode"
              label="Disposition Code"
              value={formik.values.dpCode}
              onChange={(e) => {
                formik.setFieldValue("dpCode", e.target.value);
              }}
              error={Boolean(formik.errors.dpCode)}
              helperText={formik.errors.dpCode}
              required
            >
              {props?.dpData?.map((data) => {
                return <MenuItem value={data.dpCode}> {data.dpTxt}</MenuItem>;
              })}
            </InputField>
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
              label="Action"
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
              label="Amount"
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
            <DriveFileRenameOutlineIcon />
            <Typography sx={{ marginLeft: "1em" }}> Remarks </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <textarea
              id="remark"
              name="remark"
              label="Remark"
              style={{
                width: "25.5em",
                fontFamily: "Futura, sans-serif",
                paddingLeft: "0.5em",
                paddingTop: "0.5em",
                paddingRight: "0.5em",
              }}
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
