import React, { forwardRef, useImperativeHandle } from "react";
import dayjs from "dayjs";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { Grid, Box, MenuItem } from "@mui/material";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import InputField from "../../../components/inputField/InputField";
import CrmDatePicker from "../../../components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";

const createInvoice = forwardRef((props, ref) => {
  const validationSchema = Yup.object().shape({
    paymentTerm: Yup.string().required("Required"),
    invoiceDate: Yup.date().required("Required"),
  });

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName?.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: `Invoice Created by ${userName}`,
      CHANGEIND: "I",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const formik = useFormik({
    initialValues: {
      paymentTerm: "",
      invoiceDate: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // const data = values;
      saveInvoices();
    },
  });

  const saveInvoices = () => {
    props.setDisableSubmitBtn(true);
    const entryData = props.arrForInvoice;

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("orderId", orderId);
    formData.append(
      "date",
      dayjs(formik.values.invoiceDate).format("YYYYMMDD")
    );
    formData.append("paymentTerm", formik.values.paymentTerm);
    formData.append("entryData", JSON.stringify(entryData));

    fetch(
      process.env.REACT_APP_SERVER_URL +
        "/api/dashboard/paymentSchedule/createInvoice",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          saveLog();
          snackbar.showSuccess("Invoice Created successfully!");
          props.setDisableSubmitBtn(false);
          props.setOpenCreatenvoice(false);
          props.getData();
        } else {
          snackbar.showError("Failed to update records!");
          props.setDisableSubmitBtn(false);
          props.setOpenCreatenvoice(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with updating records", error);
      });
  };

  useImperativeHandle(ref, () => ({
    saveInvoices: formik.handleSubmit,
  }));

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ paddingTop: "0.5em" }}>
        <Grid>
          <Grid>
            <InputField
              select
              id="paymentTerm"
              name="paymentTerm"
              label="Payment Term"
              value={formik.values.paymentTerm}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.paymentTerm)}
              helperText={formik.errors.paymentTerm}
              required
            >
              {props.paymentTerms?.map((data) => {
                return <MenuItem value={data.zterm}>{data.text1}</MenuItem>;
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <CrmDatePicker
              id="invoiceDate"
              name="invoiceDate"
              label="Invoice Date"
              value={dayjs(formik.values.invoiceDate)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("invoiceDate", formattedDate, true);
              }}
              error={
                formik.touched.invoiceDate && Boolean(formik.errors.invoiceDate)
              }
              helperText={
                formik.touched.invoiceDate && formik.errors.invoiceDate
              }
            />
          </Grid>
        </Grid>
        <br />
      </Box>
    </form>
  );
});

export default createInvoice;
