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
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Grid, Box, Typography, MenuItem } from "@mui/material";
import InputField from "../../components/inputField/InputField";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import CrmDatePicker from "../../components/crmDatePicker/CrmDatePicker";
import MergeTypeOutlinedIcon from "@mui/icons-material/MergeTypeOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";
import searchbarActions from "./../SearchBar/SearchBarReducer/SearchBarActions";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

const CreateActivity = forwardRef((props, ref) => {
  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const activityInfo = reducerData.searchBar.activityData;
  const Sid = reducerData.searchBar.sid;
  const dispatch = useDispatch();
  const [subActData, setSubActData] = useState(props.subActTypeData);
  const snackbar = UseCustomSnackbar();
  const [error, setError] = useState("Required");

  const createActivity = () => {
    if (!formik.values.remark) {
      setError("Required");
    } else {
      setError("");
    }

    if (Object.keys(formik.errors).length === 0 && error !== "Required") {
      // props.setDisabledBtn(false);
      props.setDisabledTertiaryBtn(false);
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("entryData", JSON.stringify(props.activityData));

      fetch("/api/activity/createActivity", { method: "POST", body: formData })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            snackbar.showSuccess("Activity created successfully!");
            dispatch(searchbarActions.setActivityData({}));
            dispatch(searchbarActions.setSid(""));
            props.setOpenActivityModal(false);
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
    amount: yup.number(),
    activityType: yup.string().required("Required"),
    subActivity: yup.number().required("Required"),
    dpCode: yup.string().required("Required"),
  });

  const convertTimeToCustomFormat = (timeString) => {
    const parsedTime = moment(timeString, "HH:mm:ss");
    const isoFormat = parsedTime.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    return isoFormat;
  };

  const formik = useFormik({
    initialValues: {
      activityMode: activityInfo?.act_mode ? activityInfo?.act_mode : "",
      time: activityInfo?.pltac
        ? convertTimeToCustomFormat(activityInfo?.pltac)
        : dayjs(),
      date: activityInfo.erdat
        ? moment(activityInfo.erdat.$d).format("YYYY-MM-DD")
        : " ",
      action: activityInfo?.action ? activityInfo?.action : "",
      remark: activityInfo?.remark ? activityInfo?.remark : "",
      amount: activityInfo?.amount ? activityInfo?.amount : "",
      activityType: "",
      subActivity: activityInfo?.act_typ ? activityInfo.act_typ : "",
      dpCode: activityInfo?.dp_code ? activityInfo?.dp_code : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      createActivity(data);
    },
  });

  useEffect(() => {
    const subActData = props?.subActTypeData?.filter(
      (sub) => sub?.actSubtyp == activityInfo?.act_typ
    );
    setSubActData(subActData);
    formik.setFieldValue("activityType", subActData[0]?.actTyp);
    if (Object.keys(formik.errors).length === 0 && error !== "Required") {
      props.setDisabledBtn(false);
    }
  }, []);

  useEffect(() => {
    if (Sid) {
      props.setDisabledTertiaryBtn(true);
      props.setDisabledBtn(false);
    } else {
      // props.setDisabledTertiaryBtn(false);
      props.setDisabledBtn(true);
    }
  }, [activityInfo]);

  useEffect(() => {
    const subData = props.subActTypeData.filter((data) => {
      return data.actTyp === formik.values.activityType;
    });
    setSubActData(subData);
  }, [formik.values.activityType]);

  useEffect(() => {
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
    props.setActivityData(entryData);
    if (Object.keys(formik.errors).length === 0 && error !== "Required") {
      // props.setDisabledBtn(false);
      props.setDisabledTertiaryBtn(false);
      dispatch(searchbarActions.setActivityData(entryData));
    } else {
      // props.setDisabledBtn(true);
      props.setDisabledTertiaryBtn(true);
    }
  }, [formik.errors, error]);

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
                onChange={(value) => {
                  formik.setFieldValue("time", value, true);
                }}
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
              value={formik.values.remark}
              onChange={(e) => {
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

export default CreateActivity;
