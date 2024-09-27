import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import dayjs from "dayjs";
import * as Yup from "yup";
import moment from "moment";
import { useFormik } from "formik";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Grid, MenuItem, Typography } from "@mui/material";
import DropdownConstants from "../../../utils/DropdownConstants";
import InputField from "../../../components/inputField/InputField";
import CrmDatePicker from "../../../components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";
import GlobalFunctions from "../../../utils/GlobalFunctions";

const CreatePaymentReceipt = forwardRef((props, ref) => {
  const PaymentTowards = DropdownConstants.PaymentTowards;
  const PaymentModes = DropdownConstants.PaymentMode;
  const BankNames = DropdownConstants.BankNames;
  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;
  const snackbar = UseCustomSnackbar();
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const saveLog = async (data) => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName?.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Create Payment Receipt",
      CHANGEIND: "I",
      VALUE_OLD: {},
      VALUE_NEW: data,
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const savePaymentDetails = () => {
    const entryData = {
      towards: formik.values.paymentTowards,
      vbeln: orderId,
      pay_mode: formik.values.paymentMode,
      paid_on: moment(formik.values.dateOfInstrument.$d).format("DD-MM-YYYY"),
      utr_no: formik.values.chequeNumber,
      amount: formik.values.paymentAmount,
      bank: formik.values.bankName,
      branch: formik.values.branchName,
      city: formik.values.bankCity,
      remark: formik.values.remarks,
    };

    if (Object.keys(formik.errors).length === 0) {
      props.setDisabledCreateBtn(true);
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("entryData", JSON.stringify(entryData));

      fetch(
        process.env.REACT_APP_SERVER_URL +
          "/api/dashboard/paymentDetails/receipt_create",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            saveLog(entryData);
            snackbar.showSuccess("Payment details created successfully!");
            props.setopenCreateForm(false);
            props.getTableData();
            props.setDisabledCreateBtn(false);
          } else {
            snackbar.showError("Something went wrong. Please try agin!");
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
    chequeNumber: Yup.string().required("Required"),
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
    onSubmit: (values) => {
      savePaymentDetails();
    },
  });

  useImperativeHandle(ref, () => ({
    savePaymentDetails: formik.handleSubmit,
  }));

  // Pass form state and validation status to parent component
  useEffect(() => {
    props.setDisabledSaveBtn(!formik.isValid || !formik.dirty);
  }, [formik.isValid, formik.dirty, props]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <InputField
            select
            fullWidth
            id="paymentTowards"
            name="paymentTowards"
            label="Payment Towards"
            value={formik.values.paymentTowards}
            onChange={formik.handleChange}
            error={
              formik.touched.paymentTowards &&
              Boolean(formik.errors.paymentTowards)
            }
            helperText={
              formik.touched.paymentTowards && formik.errors.paymentTowards
            }
          >
            <MenuItem> {"Select payment towards"} </MenuItem>
            {PaymentTowards?.map((data) => (
              <MenuItem value={data.id} key={data.name}>
                {data.name}
              </MenuItem>
            ))}
          </InputField>
        </Grid>
        <Grid item xs={12}>
          <InputField
            select
            fullWidth
            id="paymentMode"
            name="paymentMode"
            label="Payment Mode"
            value={formik.values.paymentMode}
            onChange={formik.handleChange}
            error={
              formik.touched.paymentMode && Boolean(formik.errors.paymentMode)
            }
            helperText={formik.touched.paymentMode && formik.errors.paymentMode}
          >
            <MenuItem> {"Select payment mode"} </MenuItem>
            {PaymentModes?.map((code) => (
              <MenuItem value={code.id} key={code.name}>
                {code.name}
              </MenuItem>
            ))}
          </InputField>
        </Grid>
        <Grid item xs={12}>
          <CrmDatePicker
            fullWidth
            id="dateOfInstrument"
            name="dateOfInstrument"
            label="Date of Instrument"
            type="date"
            value={dayjs(formik.values.dateOfInstrument)}
            onChange={(value) =>
              formik.setFieldValue("dateOfInstrument", value, true)
            }
            error={
              formik.touched.dateOfInstrument &&
              Boolean(formik.errors.dateOfInstrument)
            }
            helperText={
              formik.touched.dateOfInstrument && formik.errors.dateOfInstrument
            }
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            fullWidth
            id="chequeNumber"
            name="chequeNumber"
            label="Cheque Number"
            value={formik.values.chequeNumber}
            onChange={formik.handleChange}
            error={
              formik.touched.chequeNumber && Boolean(formik.errors.chequeNumber)
            }
            helperText={
              formik.touched.chequeNumber && formik.errors.chequeNumber
            }
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            fullWidth
            id="paymentAmount"
            name="paymentAmount"
            label="Payment Amount"
            value={formik.values.paymentAmount}
            onChange={formik.handleChange}
            error={
              formik.touched.paymentAmount &&
              Boolean(formik.errors.paymentAmount)
            }
            helperText={
              formik.touched.paymentAmount && formik.errors.paymentAmount
            }
            required
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            fullWidth
            select
            id="bankName"
            name="bankName"
            label="Bank Name"
            value={formik.values.bankName}
            onChange={formik.handleChange}
            error={formik.touched.bankName && Boolean(formik.errors.bankName)}
            helperText={formik.touched.bankName && formik.errors.bankName}
          >
            <MenuItem> {"Select Bank Name"} </MenuItem>
            {BankNames?.map((data) => (
              <MenuItem value={data.id} key={data.name}>
                {data.name}
              </MenuItem>
            ))}
          </InputField>
        </Grid>
        <Grid item xs={12}>
          <InputField
            fullWidth
            id="branchName"
            name="branchName"
            label="Branch Name"
            value={formik.values.branchName}
            onChange={formik.handleChange}
            error={
              formik.touched.branchName && Boolean(formik.errors.branchName)
            }
            helperText={formik.touched.branchName && formik.errors.branchName}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            fullWidth
            id="bankCity"
            name="bankCity"
            label="Bank City"
            value={formik.values.bankCity}
            onChange={formik.handleChange}
            error={formik.touched.bankCity && Boolean(formik.errors.bankCity)}
            helperText={formik.touched.bankCity && formik.errors.bankCity}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography style={{ fontSize: "0.8em" }}>Remarks</Typography>
          <textarea
            fullWidth
            id="remarks"
            name="remarks"
            label="Remarks"
            style={{
              width: "31.5em",
              height: "3em",
              padding: "0.5em",
              fontSize: "17px",
            }}
            value={formik.values.remarks}
            onChange={formik.handleChange}
            error={formik.touched.remarks && Boolean(formik.errors.remarks)}
            helperText={formik.touched.remarks && formik.errors.remarks}
          />
          <Typography
            sx={{
              color: "red",
              fontSize: "13.5px",
              marginLeft: "0.2em",
            }}
          >
            {formik.errors.remarks}
          </Typography>
        </Grid>
      </Grid>
    </form>
  );
});

export default CreatePaymentReceipt;
