import React, { forwardRef, useImperativeHandle } from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import { useFormik } from "formik";
// import { useSelector } from "react-redux";
import { Grid, Box, Typography } from "@mui/material";
// import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";
import InputField from "../../../components/inputField/InputField";
import CrmDatePicker from "../../../components/crmDatePicker/CrmDatePicker";

const CreateCashBackReceipt = forwardRef((props, ref) => {
  // const reducerData = useSelector((state) => state);
  // const orderId = reducerData.searchBar.orderId;
  // const snackbar = UseCustomSnackbar();

  const saveReceipt = () => {
    const entryData = {
      applicationDate: formik.values.applicationDate,
      projectName: formik.values.projectName,
      customerName: formik.values.customerName,
      building: formik.values.building,
      unitNumber: formik.values.unitNumber,
      delayDays: formik.values.delayDays,
      cashBackAmount: formik.values.cashBackAmount,
      remarks: formik.values.remarks,
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
      projectName: "",
      customerName: "",
      building: "",
      unitNumber: 0,
      delayDays: 0,
      cashBackAmount: 0,
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
              onChange={(value) =>
                formik.setFieldValue("applicationDate", value, true)
              }
              error={
                formik.touched.applicationDate &&
                Boolean(formik.errors.applicationDate)
              }
              helperText={
                formik.touched.applicationDate && formik.errors.applicationDate
              }
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="projectName"
              name="projectName"
              label="projectName"
              value={formik.values.projectName}
              onChange={formik.handleChange}
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
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="building"
              name="building"
              label="Building"
              value={formik.values.building}
              onChange={formik.handleChange}
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
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="delayDays"
              name="delayDays"
              label="Delay Days"
              value={formik.values.delayDays}
              onChange={formik.handleChange}
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
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <Typography style={{ fontSize: "0.8em" }}>Remarks</Typography>
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

export default CreateCashBackReceipt;
