/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useEffect, useState } from "react";
import dayjs from "dayjs";
import * as Yup from "yup";
import { useFormik } from "formik";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Grid, Typography, Button, MenuItem } from "@mui/material";
import InputField from "../../../components/inputField/InputField";
import CrmDatePicker from "../../../components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";

const CreateCancellationRequest = forwardRef((props, ref) => {
  const [formData, setFormData] = useState("");
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const getFormData = () => {
    if (orderId) {
      setLoading(true);

      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/cancel", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data[0]?.reqdata) {
            setFormData(data[0]?.reqdata[0]);
            formik.setFieldValue(
              "forfeitureAmount",
              data[0]?.reqdata[0].camount
            );
            setReasons(data[0]?.rsndata);
            setLoading(false);
          }
        });
    }
  };

  useEffect(() => {
    getFormData();
  }, [orderId]);

  useEffect(() => {
    getFormData();
  }, []);

  const getReason = () => {
    const data = reasons?.filter(
      (rsn) => rsn.augru === formik?.values?.cancellationReason
    );
    return data[0]?.creason;
  };

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Create Cancellation Request",
      CHANGEIND: "I",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const savePaymentDetails = () => {
    const entryData = {
      vbeln: formData?.vbeln,
      werks: formData?.werks,
      name1: formData?.name1,
      unit: formData?.unit,
      kunnr: formData?.kunnr,
      kunnr_name: formData?.kunnrName,
      consideration: formData?.consideration,
      augru: formik?.values?.cancellationReason,
      creason: getReason(),
      remark: formik?.values?.remark,
      camount: formik?.values?.forfeitureAmount,
      tcamount: formData?.tcamount,
      paid: formData?.paid,
      refund: formData?.refund,
      req_raiseby: formData?.reqRaiseby,
      req_raiseon: formData?.reqRaiseon,
      gjahr: formData?.gjahr,
      spmon: formData?.spmon,
      mon_stx: formData?.monStx,
      mon_ltx: formData?.monLtx,
      req_time: formData?.reqTime,
      strategy: formData?.strategy,
      rel_id: formData?.relId,
      can_deed: formik?.values?.cancellationDeedSigned ? "X" : "",
      can_deed_dt: formik?.values?.cancellationDeedDate,
      vbeln_new: formik?.values?.transferSalesOrder,
    };

    const Data = new FormData();
    Data.append("passWord", passWord);
    Data.append("userName", userName);
    Data.append("reqData", JSON.stringify(entryData));

    if (!formik.values.remark) {
      setError("Required");
    } else {
      setError("");
    }

    if (Object.keys(formik.errors).length === 0 && !error) {
      fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/cancelPost", {
        method: "POST",
        body: Data,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            saveLog();
            snackbar.showSuccess("Cancellation request created successfully!");
            formik.resetForm();
          }
        })
        .catch((error) => {
          if (error) {
            snackbar.showError(
              "Error while creating cancellation request. Please try again!"
            );
          }
        });
    }
  };

  const validationSchema = Yup.object().shape({
    bookingNumber: Yup.number(),
    applicationDate: Yup.date(),
    cancellationRaisedOn: Yup.date(),
    customer: Yup.string(),
    cancellationDeedSigned: Yup.string().required("Required"),
    project: Yup.number(),
    cancellationDeedDate: Yup.string().required("Required"),
    unitNumber: Yup.number(),
    handedToCrm: Yup.number(),
    consideration: Yup.number(),
    amountPaid: Yup.number(),
    forfeitureAmount: Yup.number().required("Required"),
    cashBackAmount: Yup.number(),
    totalForfeiture: Yup.number(),
    amountToBeRefund: Yup.number(),
    cancellationReason: Yup.string().required("Required"),
    remark: Yup.string().required("Required"),
    rejectionReason: Yup.string(),
    transferSalesOrder: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      bookingNumber: formData?.vbeln,
      applicationDate: formData?.appDate,
      cancellationRaisedOn: new Date(),
      customer: formData?.kunnrName,
      cancellationDeedSigned: "",
      project: "",
      cancellationDeedDate: "",
      unitNumber: "",
      handedToCrm: "",
      consideration: "",
      amountPaid: "",
      forfeitureAmount: formData?.camount,
      cashBackAmount: "",
      totalForfeiture: formData?.tcamount,
      amountToBeRefund: "",
      cancellationReason: "",
      remark: "",
      rejectionReason: "",
      transferSalesOrder: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      savePaymentDetails(data);
    },
  });

  useEffect(() => {
    const amt1 = formik?.values?.forfeitureAmount;
    const amt2 = formik?.values?.cashBackAmount;
    const sum = amt1 + amt2;
    if (formik?.values?.forfeitureAmount) {
      formik.setFieldValue("totalForfeiture", sum);
    }
  }, [formik?.values?.forfeitureAmount]);

  const fixedFieldStyle = { backgroundColor: "#E8E8E8" };

  return (
    <formik>
      {!loading ? (
        <Grid
          sx={{
            padding: "2em",
            backgroundColor: "white",
            paddingTop: "3em",
            marginTop: "1em",
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="bookingNumber"
                name="bookingNumber"
                label="Booking Number"
                value={formData.vbeln}
                style={fixedFieldStyle}
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="applicationDate"
                name="applicationDate"
                label="Application Date"
                value={dayjs(formData?.appDt).format("DD-MM-YYYY")}
                style={fixedFieldStyle}
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="cancellationRaisedOn"
                name="cancellationRaisedOn"
                label="Cancellation Raised On"
                style={fixedFieldStyle}
                value={dayjs(new Date()).format("DD-MM-YYYY")}
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="customer"
                name="customer"
                label="Customer"
                style={fixedFieldStyle}
                value={formData?.kunnrName}
              />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={4}>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="project"
                name="project"
                label="Project"
                style={fixedFieldStyle}
                value={formData?.name1}
              />
            </Grid>

            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="unitNumber"
                name="unitNumber"
                label="Unit Number"
                value={formData?.unit}
                style={fixedFieldStyle}
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="handedToCrm"
                name="handedToCrm"
                label="Handed To CRM"
                style={fixedFieldStyle}
                value={dayjs(formData?.zzhtcrm).format("DD-MM-YYYY")}
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="consideration"
                name="consideration"
                label="Consideration"
                style={fixedFieldStyle}
                value={formData?.consideration}
              />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={4}>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="amountPaid"
                name="amountPaid"
                label="Amount Paid"
                value={formData?.paid}
                style={fixedFieldStyle}
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="cashBackAmount"
                name="cashBackAmount"
                label="Cashback Amount"
                style={fixedFieldStyle}
                value={formData?.cashback}
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="totalForfeiture"
                name="totalForfeiture"
                label="Total Forfeiture"
                style={fixedFieldStyle}
                value={
                  formik.values.totalForfeiture
                    ? formik.values.totalForfeiture
                    : formData?.camount
                }
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="amountToBeRefund"
                name="amountToBeRefund"
                label="Amount To Be Refund"
                style={fixedFieldStyle}
                value={formData?.refund}
              />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={4}>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                select
                id="cancellationDeedSigned"
                name="cancellationDeedSigned"
                label="Cancellation Deed Signed"
                value={formik.values.cancellationDeedSigned}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.cancellationDeedSigned)}
                helperText={formik.errors.cancellationDeedSigned}
                required
              >
                <MenuItem value="" key="0">
                  {" "}
                  Select Cancellation Deed Signed
                </MenuItem>
                <MenuItem value="Yes" key="1">
                  {" "}
                  Yes{" "}
                </MenuItem>
                <MenuItem value="No" key="2">
                  {" "}
                  No{" "}
                </MenuItem>
              </InputField>
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <CrmDatePicker
                id="cancellationDeedDate"
                name="cancellationDeedDate"
                label="Cancellation Deed Date"
                value={dayjs(formik.values.cancellationDeedDate)}
                onChange={(value) =>
                  formik.setFieldValue("cancellationDeedDate", value, true)
                }
                error={Boolean(formik.errors.cancellationDeedDate)}
                helperText={formik.errors.cancellationDeedDate}
                required
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="forfeitureAmount"
                name="forfeitureAmount"
                label="Forfeiture Amount"
                value={formik?.values?.forfeitureAmount}
                onChange={(e) =>
                  formik.setFieldValue("forfeitureAmount", e.target.value)
                }
                error={Boolean(formik.errors.forfeitureAmount)}
                helperText={formik.errors.forfeitureAmount}
                required
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="transferSalesOrder"
                name="transferSalesOrder"
                label="Transfer Sales Order"
                value={formik.values.transferSalesOrder}
                error={Boolean(formik.errors.transferSalesOrder)}
                helperText={formik.errors.transferSalesOrder}
                onChange={formik.handleChange}
                required
              />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={4}>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                select
                id="cancellationReason"
                name="cancellationReason"
                label="Cancellation Reason"
                value={formik.values.cancellationReason}
                error={Boolean(formik.errors.cancellationReason)}
                helperText={formik.errors.cancellationReason}
                onChange={formik.handleChange}
                required
              >
                <MenuItem value=""> Select Cancellation Reason </MenuItem>
                {reasons?.map((rsn, index) => {
                  return (
                    <MenuItem value={rsn.augru} key={index}>
                      {" "}
                      {rsn?.creason}
                    </MenuItem>
                  );
                })}
              </InputField>
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={4}>
            <Grid item xs={2} sm={3} md={3}>
              <Typography style={{ fontSize: "0.8em" }}>Remark</Typography>
              <textarea
                id="remark"
                name="remark"
                label="Remark"
                style={{ width: "23.7em", height: "3.2em" }}
                value={formik.values.remark}
                onChange={formik.handleChange}
              />
              {error && (
                <Typography style={{ color: "red", fontSize: "13px" }}>
                  {error}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{
                "&.MuiButton-root": {
                  textTransform: "none",
                  backgroundColor: "#228B22",
                },
                margin: "1em",
                padding: "0.5em",
                paddingLeft: "1.5em",
                paddingRight: "1.5em",
              }}
              size="md"
              variant="contained"
              onClick={() => {
                savePaymentDetails();
              }}
            >
              {" "}
              Create{" "}
            </Button>
            <Button
              sx={{
                "&.MuiButton-root": {
                  textTransform: "none",
                  backgroundColor: "#ff0000",
                },
                margin: "1em",
                padding: "0.5em",
                paddingLeft: "1.5em",
                paddingRight: "1.5em",
              }}
              variant="contained"
              size="md"
              onClick={() => {
                formik.resetForm();
                formik.setFieldValue("forfeitureAmount", "");
              }}
            >
              {" "}
              Cancel{" "}
            </Button>
          </Grid>
        </Grid>
      ) : (
        <CircularScreenLoader />
      )}
    </formik>
  );
});

export default CreateCancellationRequest;
