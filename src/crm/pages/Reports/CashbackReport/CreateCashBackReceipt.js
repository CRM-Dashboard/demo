import React, { forwardRef, useImperativeHandle } from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { Grid, Box, Typography, Button } from "@mui/material";
import GlobalFunctions from "./../../../utils/GlobalFunctions";
import InputField from "../../../components/inputField/InputField";
import CrmDatePicker from "../../../components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";

const CreateCashBackReceipt = forwardRef((props, ref) => {
  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Create Cashback receipt request",
      CHANGEIND: "",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const saveReceipt = () => {
    if (formik.values.remarks.trim().length > 0) {
      const entryData = {
        vbeln: props?.dataToUpdate?.orderId,
        cashback: props?.dataToUpdate?.cashback,
        werks: props?.dataToUpdate?.werks,
        building: props?.dataToUpdate?.building,
        flatno: props?.dataToUpdate?.flatno,
        project: props?.dataToUpdate?.project,
        customer: props?.dataToUpdate?.customer,
        amount: props?.dataToUpdate?.amount,
        remark: formik.values.remarks,
      };
      console.log("######entryData", entryData);

      const formData = new FormData();
      formData.append("entryData", JSON.stringify(entryData));
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      fetch(
        process.env.REACT_APP_SERVER_URL +
          `/api/dashboard/createCashbackRequest`,
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            props.getTableData();
            props.setopenCreateForm(false);
            saveLog();
            snackbar.showSuccess("Payment details created successfully!");
          }
        })
        .catch((error) => {
          if (error) {
            snackbar.showError(
              "Error while creating payment details. Please try again!"
            );
          }
        });
    } else {
      snackbar.showError("Please add remarks!");
    }
  };

  useImperativeHandle(ref, () => ({
    saveReceipt,
  }));

  const validationSchema = yup.object({
    applicationDate: yup.date(),
    projectName: yup.string(),
    customerName: yup.string(),
    building: yup.string(),
    unitNumber: yup.number(),
    delayDays: yup.number(),
    cashBackAmount: yup.number(),
    remarks: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      applicationDate: new Date(),
      projectName: props?.dataToUpdate?.project,
      customerName: props.dataToUpdate?.customer,
      building: props.dataToUpdate?.building,
      unitNumber: props.dataToUpdate?.flatno,
      delayDays: props?.dataToUpdate?.delay,
      cashBackAmount: props?.dataToUpdate?.amount,
      remarks: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      saveReceipt(data);
    },
  });

  return (
    <formik>
      <Box sx={{ paddingTop: "1.5em" }}>
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <CrmDatePicker
              id="applicationDate"
              name="applicationDate"
              label="Application Date"
              value={dayjs(formik.values.applicationDate)}
              error={
                formik.touched.applicationDate &&
                Boolean(formik.errors.applicationDate)
              }
              helperText={
                formik.touched.applicationDate && formik.errors.applicationDate
              }
              disabled
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="projectName"
              name="projectName"
              label="Project Name"
              value={formik.values.projectName}
              disabled
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="customerName"
              name="customerName"
              label="Customer Name"
              value={formik.values.customerName}
              disabled
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="building"
              name="building"
              label="Building"
              value={formik.values.building}
              disabled
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="unitNumber"
              name="unitNumber"
              label="Unit Number"
              value={formik.values.unitNumber}
              disabled
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="delayDays"
              name="delayDays"
              label="Delay Days"
              value={formik.values.delayDays}
              disabled
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="cashBackAmount"
              name="cashBackAmount"
              label="Cashback Amount"
              value={formik.values.cashBackAmount}
              disabled
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <Typography style={{ fontSize: "0.8em" }}>Remarks</Typography>
            <textarea
              id="remarks"
              name="remarks"
              label="Remarks"
              style={{ width: "100%", height: "70%" }}
              value={formik.values.remarks}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <Grid item xs={4} sm={6} md={6}>
          <Button
            sx={{ marginTop: "1.5em" }}
            variant="contained"
            disableElevation
            disableFocusRipple
            size="small"
            disabled={!props.requestNo}
            onClick={() => {
              props.setOpenFileUpload(true);
              props.getFilesCount();
            }}
          >
            Choose Files to Upload
          </Button>
          ,
        </Grid>
      </Box>
    </formik>
  );
});

export default CreateCashBackReceipt;
