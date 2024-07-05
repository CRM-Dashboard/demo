/* eslint-disable no-unreachable */
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
import { useDispatch } from "react-redux";
import GlobalFunctions from "./../../utils/GlobalFunctions";
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
  const snackbar = UseCustomSnackbar();

  const [subActData, setSubActData] = useState(props.subActTypeData);
  const [error, setError] = useState("Required");

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Create New Activity",
      CHANGEIND: "I",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const createActivity = () => {
    if (!formik.values.remark) {
      setError("Required");
    } else {
      setError("");
    }

    const entryData = {
      vbeln: orderId,
      act_mode: "02",
      pltac: moment(formik.values.time.$d).format("HH:mm:ss"),
      erdat: formik.values.date,
      action: formik.values.action,
      remark: formik.values.remark,
      dmbtr: formik.values.amount,
      act_typ: formik.values.activityType,
      act_subtyp: formik.values.subActivity,
      dp_code: formik.values.dpCode,
    };

    if (Object.keys(formik.errors).length === 0 && error !== "Required") {
      // props.setDisabledBtn(false);

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
            props.setCallAPI(false);
            props.setSid(0);
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
    } else {
      snackbar.showError("All fields are mandatory!");
    }
  };

  useImperativeHandle(ref, () => ({
    createActivity,
    handleContinue,
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

  const convertTime = (time24) => {
    // Splitting the time string into hours, minutes, and seconds
    const [hours, minutes, seconds] = time24.split(":");

    // Creating a Date object to format the time
    const time = new Date(0, 0, 0, hours, minutes, seconds);

    // Formatting the time into 12-hour clock format
    // const time12 = time.toLocaleString("en-US", {
    //   hour: "numeric",
    //   minute: "2-digit",
    //   second: "2-digit",
    //   hour12: true,
    // });

    // Formatting the time into the specified format
    const formattedTime = time.toISOString().slice(0, -5) + "Z";

    return formattedTime;
  };

  // useEffect(() => {
  //   const entryData = {
  //     vbeln: orderId,
  //     act_mode: formik.values.activityMode,
  //     pltac: moment(formik.values.time.$d).format("HH:mm:ss"),
  //     erdat: formik.values.date,
  //     action: formik.values.action,
  //     remark: formik.values.remark,
  //     dmbtr: formik.values.amount,
  //     act_typ: formik.values.activityType,
  //     act_subtyp: formik.values.subActivity,
  //     dp_code: formik.values.dpCode,
  //   };

  //   if (props.shouldShowFullForm) {
  //     props.setActivityData(entryData);
  //   }
  // }, [props.shouldShowFullForm]);

  // const getCurrentActType = (actTyp) => {
  //   const filteredData = props.actTypeData?.filter((actData) => {
  //     if (actData.typ === activityInfo?.act_typ) {
  //       return actData.typTxt;
  //     }
  //   });
  //   return filteredData;
  // };

  const formik = useFormik({
    initialValues: {
      activityMode: "02",
      time: activityInfo?.pltac ? convertTime(activityInfo?.pltac) : dayjs(),
      date: activityInfo.erdat
        ? moment(activityInfo.erdat.$d).format("YYYY-MM-DD")
        : " ",
      action: activityInfo?.action ? activityInfo?.action : "",
      remark: activityInfo?.remark ? activityInfo?.remark : "",
      amount: activityInfo?.dmbtr ? activityInfo?.dmbtr : "",
      activityType: activityInfo?.act_typ ? activityInfo.act_typ : "",
      subActivity: activityInfo?.act_subtyp ? activityInfo.act_subtyp : "",
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
    if (Object.keys(formik.errors).length === 0 && error !== "Required") {
      props.setDisabledBtn(false);
    }
  }, []);

  useEffect(() => {
    if (Sid) {
      props.setDisabledBtn(false);
    } else {
      props.setDisabledBtn(true);
    }
  }, [activityInfo]);

  useEffect(() => {
    const subData = props.subActTypeData?.filter((data) => {
      return data.actTyp === formik.values.activityType;
    });
    setSubActData(subData);
  }, [formik.values.activityType]);

  useEffect(() => {
    handleContinue();
  }, [formik.values]);

  const handleContinue = () => {
    if (formik.values.activityMode) {
      const entryData = {
        vbeln: orderId,
        act_mode: "02",
        pltac: moment(formik.values.time.$d).format("HH:mm:ss"),
        erdat: formik.values.date,
        action: formik.values.action,
        remark: formik.values.remark,
        dmbtr: formik.values.amount,
        act_typ: formik.values.activityType,
        act_subtyp: formik.values.subActivity,
        dp_code: formik.values.dpCode,
      };

      props.setActivityData(entryData);
      dispatch(searchbarActions.setActivityData(entryData));
    }
  };

  useEffect(() => {
    const entryData = {
      vbeln: orderId,
      act_mode: "02",
      pltac: moment(formik.values.time.$d).format("HH:mm:ss"),
      erdat: formik.values.date,
      action: formik.values.action,
      remark: formik.values.remark,
      dmbtr: formik.values.amount,
      act_typ: formik.values.activityType,
      act_subtyp: formik.values.subActivity,
      dp_code: formik.values.dpCode,
    };

    if (Object.keys(formik.errors).length === 0 && error !== "Required") {
      props.setActivityData(entryData);
      dispatch(searchbarActions.setActivityData(entryData));
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
              value={"02"}
              error={Boolean(formik.errors.activityMode)}
              helperText={formik.errors.activityMode}
              required
              disabled
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
                onChange={(value) =>
                  formik.setFieldValue("time", dayjs(value), true)
                }
                renderInput={(params) => (
                  <InputField
                    {...params}
                    error={Boolean(formik.errors.time)}
                    helperText={formik.errors.time}
                    sx={{
                      "& .MuiInputBase-input": {
                        height: "2em",
                        padding: 0,
                      },
                      width: "100%",
                    }}
                  />
                )}
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
                fontFamily: "Futura",
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
