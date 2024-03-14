import React, { forwardRef, useImperativeHandle } from "react";
import dayjs from "dayjs";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Grid, Box, MenuItem, Typography } from "@mui/material";
import DropdownConstants from "../../../utils/DropdownConstants";
import InputField from "../../../components/inputField/InputField";
import CrmDatePicker from "../../../components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";

const CreatePaymentReceipt = forwardRef((props, ref) => {
  const PaymentTowards = DropdownConstants.PaymentTowards;
  const PaymentModes = DropdownConstants.PaymentMode;
  const BankNames = DropdownConstants.BankNames;
  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;
  const snackbar = UseCustomSnackbar();
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const savePaymentDetails = () => {
    const entryData = {
      towards: formik.values.paymentTowards,
      vbeln: orderId,
      pay_mode: formik.values.pay_mode,
      paid_on: formik.values.dateOfInstrument.$d,
      utr_no: formik.values.chequeNumber,
      amount: formik.values.paymentAmount,
      bank: formik.values.bankName,
      branch: formik.values.branchName,
      city: formik.values.bankCity,
      remark: formik.values.remarks,
    };

    if (Object.keys(formik.errors).length === 0) {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("entryData", JSON.stringify(entryData));

      fetch("/api/dashboard/paymentDetails/receipt_create", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            snackbar.showSuccess("Payment details created successfully!");
            props.setopenCreateForm(false);
            props.getTableData();
          }
        })
        .catch((error) => {
          if (error) {
            snackbar.showError(
              "Error while creating payment details. Please try again!"
            );
          }
        });
    }
  };

  useImperativeHandle(ref, () => ({
    savePaymentDetails,
  }));

  const validationSchema = Yup.object().shape({
    paymentTowards: Yup.string()
      .transform((originalValue) =>
        originalValue === "" ? null : originalValue
      )
      .required("Required"),
    paymentMode: Yup.string().required("Required"),
    dateOfInstrument: Yup.date().required("Required"),
    chequeNumber: Yup.number().required("Required"),
    paymentAmount: Yup.number()
      .typeError("Enter Numbers Only.")
      .required("Required"),
    bankName: Yup.string(),
    branchName: Yup.string(),
    bankCity: Yup.string(),
    remarks: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      paymentTowards: "",
      paymentMode: "",
      dateOfInstrument: "",
      chequeNumber: "",
      paymentAmount: "",
      bankName: "",
      branchName: "",
      bankCity: "",
      remarks: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      savePaymentDetails(data);
    },
  });

  return (
    <formik>
      <Box sx={{ paddingTop: "1.5em" }}>
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="paymentTowards"
              name="paymentTowards"
              label="Payment Towards"
              value={formik.values.paymentTowards}
              onChange={(e) => {
                formik.setFieldValue("paymentTowards", e.target.value);
              }}
              error={Boolean(formik.errors.paymentTowards)}
              helperText={formik.errors.paymentTowards}
              required
            >
              <MenuItem> {"Select payment towards"} </MenuItem>
              {PaymentTowards?.map((data) => (
                <MenuItem value={data.id} key={data.name}>
                  {data.name}
                </MenuItem>
              ))}
            </InputField>
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="paymentMode"
              name="paymentMode"
              label="Payment Mode"
              value={formik.values.paymentMode}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.paymentMode)}
              helperText={formik.errors.paymentMode}
              required
            >
              <MenuItem> {"Select payment mode"} </MenuItem>
              {PaymentModes?.map((code) => (
                <MenuItem value={code.id} key={code.name}>
                  {code.name}
                </MenuItem>
              ))}
            </InputField>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="paymentAmount"
              name="paymentAmount"
              label="Payment Amount"
              value={formik.values.paymentAmount}
              error={Boolean(formik.errors.paymentAmount)}
              helperText={formik.errors.paymentAmount}
              onChange={formik.handleChange}
              required
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <CrmDatePicker
              name="dateOfInstrument"
              label="Date of instrument"
              value={dayjs(formik.values.dateOfInstrument)}
              onChange={(value) =>
                formik.setFieldValue("dateOfInstrument", value, true)
              }
              error={Boolean(formik.errors.dateOfInstrument)}
              helperText={formik.errors.dateOfInstrument}
              required
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="chequeNumber"
              name="chequeNumber"
              label="Cheque Number"
              value={formik.values.chequeNumber}
              error={Boolean(formik.errors.chequeNumber)}
              helperText={formik.errors.chequeNumber}
              onChange={formik.handleChange}
              required
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="bankName"
              name="bankName"
              label="Bank Name"
              value={formik.values.bankName}
              onChange={formik.handleChange}
            >
              <MenuItem> {"Select Bank Name"} </MenuItem>
              {BankNames?.map((data) => (
                <MenuItem value={data.id} key={data.name}>
                  {data.name}
                </MenuItem>
              ))}
            </InputField>
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="branchName"
              name="branchName"
              label="Branch Name"
              value={formik.values.branchName}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="bankCity"
              name="bankCity"
              label="Bank City"
              value={formik.values.bankCity}
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

export default CreatePaymentReceipt;
