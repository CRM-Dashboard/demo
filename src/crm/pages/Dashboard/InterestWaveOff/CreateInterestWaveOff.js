import React, { forwardRef, useImperativeHandle } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Grid, Box, Typography } from "@mui/material";
import InputField from "../../../components/inputField/InputField";

const CreateInterestWaveOff = forwardRef((props, ref) => {
  // const reducerData = useSelector((state) => state);
  // const orderId = reducerData.searchBar.orderId;
  // const snackbar = UseCustomSnackbar();

  const saveReceipt = () => {
    const entryData = {
      reason: formik.values.reason,
      interestDueAmt: formik.values.interestDueAmt,
      interestWaivedOff: formik.values.interestWaivedOff,
      waiverRequested: formik.values.waiverRequested,
      balanceInterest: formik.values.balanceInterest,
      waiverAmt: formik.values.waiverAmt,
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
    reason: yup.string(),
    interestDueAmt: yup.number(),
    interestWaivedOff: yup.number(),
    waiverRequested: yup.number(),
    balanceInterest: yup.number(),
    waiverAmt: yup.number(),
    remarks: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      reason: "",
      interestDueAmt: 0,
      interestWaivedOff: 0,
      waiverRequested: 0,
      balanceInterest: 0,
      waiverAmt: 0,
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
            <InputField
              id="interestWaivedOff"
              name="interestWaivedOff"
              label="Interest Waived Off"
              value={formik.values.interestWaivedOff}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="waiverRequested"
              name="waiverRequested"
              label="Waiver Requested"
              value={formik.values.interestDueAmt}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="balanceInterest"
              name="balanceInterest"
              label="Balance Interest"
              value={formik.values.balanceInterest}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="interestDueAmt"
              name="interestDueAmt"
              label="Interest Due Amount"
              value={formik.values.interestDueAmt}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="waiverAmt"
              name="waiverAmt"
              label="Waiver Amount"
              value={formik.values.waiverAmt}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="reason"
              name="reason"
              label="Reason"
              value={formik.values.reason}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={8}>
          <Grid item xs={6} sm={8} md={8}>
            <Typography style={{ fontSize: "0.8em" }}>Remarks</Typography>
            <textarea
              id="remarks"
              name="remarks"
              label="Remarks"
              style={{ width: "53em" }}
              value={formik.values.remarks}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
      </Box>
    </formik>
  );
});

export default CreateInterestWaveOff;
