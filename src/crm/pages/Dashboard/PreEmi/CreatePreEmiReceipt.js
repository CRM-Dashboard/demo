/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import moment from "moment";
import { Formik, useFormik } from "formik";
import GlobalFunctions from "./../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Grid, Box, Typography, MenuItem, Button } from "@mui/material";
import InputField from "../../../components/inputField/InputField";
import CrmDatePicker from "../../../components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";

const CreatePreEmiReceipt = forwardRef((props, ref) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [schemeStart, setSchemeStart] = useState(null);
  const [schemeEnd, setSchemeEnd] = useState(null);
  const [soDetails, setSoDetails] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Track the submission state

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const OrderId = reducerData.searchBar.orderId;
  const projectId = reducerData.dashboard.project.projectId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const custData = reducerData.searchBar.accountStatement;

  useEffect(() => {
    if (OrderId) {
      const formData = new FormData();
      formData.append("orderId", OrderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      if (Object.keys(formik.errors).length === 0 && error !== "Required") {
        fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/so", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data[0].so[0].vbeln) {
              setSoDetails(data);
              if (
                data[0].so[0].schemeStart === "0000-00-00" ||
                data[0].so[0].schemeEnd === "0000-00-00"
              ) {
                props.setopenCreateForm(false);
                snackbar.showError(
                  "Please set Scheme start and Scheme end date!"
                );
                setSchemeEnd(null);
                setSchemeStart(null);
              } else {
                setSchemeEnd(data[0].so[0].schemeEnd);
                setSchemeStart(data[0].so[0].schemeStart);
              }
            }
          });
      }
    }
  }, []);

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: OrderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Create Pre Emi / Rental Assurance",
      CHANGEIND: "I",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const saveReceipt = async () => {
    // Check for formik errors
    if (Object.keys(formik.errors).length > 0) {
      return; // Exit the function if there are errors
    }

    setIsSubmitting(true); // Set submitting state to true

    const entryData = {
      vbeln: OrderId,
      pmt_req_typ: formik.values.repayType,
      werks: projectId,
      building: soDetails[0]?.building,
      unit: soDetails[0]?.flatno,
      proj_name: soDetails[0]?.project,
      cust_name: custData.CustomerName,
      amount: formik.values.amount,
      remark: formik.values.remarks,
      onbehalf: formik.values.onBehalf,
      panno: formik.values.onBehalfPan,
      spmon: moment(formik.values.schemeMonth?.$d).format("YYYYMM"),
    };

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(entryData));

    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER_URL + `/api/dashboard/preEmi/create_repay`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (data) {
        await saveLog();
        snackbar.showSuccess("Pre EMI/ Rental receipt created successfully!");
        setError("");
        props.setopenCreateForm(false);
        props.getTableData();
      }
    } catch (error) {
      snackbar.showError(
        "Error while creating Pre EMI/ Rental receipt. Please try again!"
      );
      props.setopenCreateForm(false);
    } finally {
      setIsSubmitting(false); // Reset submitting state to false
      props.setDisabledCreateBtn(false); // Enable the create button
    }
  };

  const validationSchema = yup.object({
    schemeStart: yup.string(),
    schemeEnd: yup.string(),
    repayType: yup.string().required("Required"),
    schemeMonth: yup.string().required("Required"),
    amount: yup.number().required("Required"),
    onBehalf: yup.string(),
    onBehalfPan: yup.string(),
    remarks: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      schemeStart: dayjs(schemeStart),
      schemeEnd: dayjs(schemeEnd),
      repayType: "",
      schemeMonth: null,
      amount: "",
      onBehalf: "",
      onBehalfPan: "",
      remarks: "",
    },
    validationSchema,
    onSubmit: (values) => {
      saveReceipt();
    },
  });

  useImperativeHandle(ref, () => ({
    saveReceipt: formik.handleSubmit,
  }));

  useEffect(() => {
    props.setDisabledCreateBtn(
      !(formik.isValid && formik.dirty) || isSubmitting
    );
  }, [formik.isValid, formik.dirty, isSubmitting, props]);

  useEffect(() => {
    const inputDate = new Date(formik.values.schemeMonth);
    const startDate = new Date(schemeStart);
    const endDate = new Date(schemeEnd);

    const isDateInRange = (currentDate, startDate, endDate) => {
      return currentDate >= startDate && currentDate <= endDate;
    };

    const isSameMonthAndYear = (date1, date2) => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth()
      );
    };

    const isValidDate =
      isDateInRange(inputDate, startDate, endDate) ||
      isSameMonthAndYear(inputDate, startDate) ||
      isSameMonthAndYear(inputDate, endDate);

    // if (!isValidDate) {
    //   formik.setFieldError(
    //     "schemeMonth",
    //     "Month should be in the range of the start scheme and end scheme."
    //   );
    //   snackbar.showError(
    //     "Month should be in the range of the start scheme and end scheme."
    //   );
    // }
  }, [formik.values.schemeMonth, schemeStart, schemeEnd]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ paddingTop: "1.5em" }}>
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <CrmDatePicker
              id="schemeStart"
              name="schemeStart"
              label="Scheme Start"
              value={dayjs(schemeStart)}
              error={Boolean(formik.errors.schemeStart)}
              helperText={formik.errors.schemeStart}
              disabled
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <CrmDatePicker
              name="schemeEnd"
              label="Scheme End"
              value={dayjs(schemeEnd)}
              error={Boolean(formik.errors.schemeEnd)}
              helperText={formik.errors.schemeEnd}
              disabled
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="repayType"
              name="repayType"
              label="Repay Type"
              value={formik.values.repayType}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.repayType)}
              helperText={formik.errors.repayType}
              required
            >
              <MenuItem> {"Select Repay Type"} </MenuItem>
              <MenuItem value={1} key="Pre EMI">
                Pre EMI
              </MenuItem>
              <MenuItem value={2} key="Rental Assurance">
                Rental Assurance
              </MenuItem>
            </InputField>
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <CrmDatePicker
              id="schemeMonth"
              name="schemeMonth"
              label="Month"
              format="MMMM YYYY"
              views={["month", "year"]}
              value={formik.values.schemeMonth}
              onChange={(value) =>
                formik.setFieldValue("schemeMonth", value, true)
              }
              minDate={dayjs(schemeStart)}
              maxDate={dayjs(schemeEnd)}
              error={Boolean(formik.errors.schemeMonth)}
              helperText={formik.errors.schemeMonth}
              isRequired
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="amount"
              name="amount"
              label="Amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.amount)}
              helperText={formik.errors.amount}
              required
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="onBehalf"
              name="onBehalf"
              label="On Behalf"
              error={Boolean(formik.errors.onBehalf)}
              helperText={formik.errors.onBehalf}
              value={formik.values.onBehalf}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="onBehalfPan"
              name="onBehalfPan"
              label="On Behalf PAN"
              value={formik.values.onBehalfPan}
              error={Boolean(formik.errors.onBehalfPan)}
              helperText={formik.errors.onBehalfPan}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <Typography style={{ fontSize: "0.9em" }}>Remarks</Typography>
            <textarea
              id="remarks"
              name="remarks"
              label="Remarks"
              style={{
                width: "23.5em",
                padding: "0.5em",
                fontSize: "17px",
              }}
              value={formik.values.remarks}
              onChange={formik.handleChange}
            />
            <Typography sx={{ color: "red", fontSize: "11px" }}>
              {error}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
});

export default CreatePreEmiReceipt;
