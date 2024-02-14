/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import dayjs from "dayjs";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux/es/hooks/useSelector";
import {
  Grid,
  Typography,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import InputField from "../../../components/inputField/InputField";
import CrmDatePicker from "../../../components/crmDatePicker/CrmDatePicker";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";

const CreateCancellationRequest = forwardRef((props, ref) => {
  const [formData, setFormData] = useState("");
  const [loading, setLoading] = useState(false);

  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;

  const getFormData = () => {
    if (orderId) {
      setLoading(true);
      fetch(`/sap/bc/react/crm/so?sap-client=250&vbeln=${orderId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Bookig Data@@@@@@@@@@@", data[0]);
          if (data[0].vbeln) {
            setFormData(data[0]);
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

  const savePaymentDetails = () => {
    const entryData = {
      bookingNumber: formik.values.bookingNumber,
      applicationDate: formik.values.applicationDate,
      cancellationRaisedOn: formik.values.cancellationRaisedOn,
      customer: formik.values.customer,
      cancellationDeedSigned: formik.values.cancellationDeedSigned,
      project: formik.values.project,
      cancellationDeedDate: formik.values.cancellationDeedDate,
      unitNumber: formik.values.unitNumber,
      handedToCrm: formik.values.handedToCrm,
      consideration: formik.values.consideration,
      amountPaid: formik.values.amountPaid,
      forfeitureAmount: formik.values.forfeitureAmount,
      cashBackAmount: formik.values.cashBackAmount,
      gst: formik.values.gst,
      gstAmount: formik.values.gstAmount,
      totalForfeiture: formik.values.totalForfeiture,
      amountToBeRefund: formik.values.amountToBeRefund,
      cancellationReason: formik.values.cancellationReason,
      remark: formik.values.remark,
      rejectionReason: formik.values.rejectionReason,
      transferSalesOrder: formik.values.transferSalesOrder,
    };
    console.log("##########errors", formik.errors);
    console.log("props##########", props, entryData);

    // if (Object.keys(formik.errors).length === 0) {
    //   fetch(`/sap/bc/react/crm/receipt_create?sap-client=250`, {
    //     method: "POST",
    //     body: JSON.stringify(entryData),
    //     headers: {
    //       Accept: "application/json",
    //       Origin: "http://115.124.113.252:8000/",
    //       Referer: "http://115.124.113.252:8000/",
    //       "Content-Type": "application/json",
    //     },
    //     credentials: "include",
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       if (data) {
    //         snackbar.showSuccess("Payment details created successfully!");
    //         props.setopenCreateForm(false);
    //         props.getTableData();
    //       }
    //     })
    //     .catch((error) => {
    //       console.log("error#######", error);
    //       if (error) {
    //         snackbar.showError(
    //           "Error while creating payment details. Please try again!"
    //         );
    //       }
    //     });
    // }
  };

  useImperativeHandle(ref, () => ({
    savePaymentDetails,
  }));

  const validationSchema = Yup.object().shape({
    bookingNumber: Yup.number(),
    applicationDate: Yup.date(),
    cancellationRaisedOn: Yup.date(),
    customer: Yup.string(),
    cancellationDeedSigned: Yup.string(),
    project: Yup.number(),
    cancellationDeedDate: Yup.string(),
    unitNumber: Yup.number(),
    handedToCrm: Yup.number(),
    consideration: Yup.number(),
    amountPaid: Yup.number(),
    forfeitureAmount: Yup.number(),
    cashBackAmount: Yup.number(),
    gst: Yup.number(),
    gstAmount: Yup.number(),
    totalForfeiture: Yup.number(),
    amountToBeRefund: Yup.number(),
    cancellationReason: Yup.string(),
    remark: Yup.string(),
    rejectionReason: Yup.string(),
    transferSalesOrder: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      bookingNumber: formData?.vbeln,
      applicationDate: formData?.appDate,
      cancellationRaisedOn: new Date(),
      customer: "",
      cancellationDeedSigned: "",
      project: "",
      cancellationDeedDate: "",
      unitNumber: "",
      handedToCrm: "",
      consideration: "",
      amountPaid: "",
      forfeitureAmount: "",
      cashBackAmount: "",
      gst: "",
      gstAmount: "",
      totalForfeiture: "",
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
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="applicationDate"
                name="applicationDate"
                label="Application Date"
                value={dayjs(formData?.appDate).format("DD-MM-YYYY")}
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="cancellationRaisedOn"
                name="cancellationRaisedOn"
                label="Cancellation Raised On"
                value={dayjs(new Date()).format("DD-MM-YYYY")}
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="customer"
                name="customer"
                label="Customer"
                value={formik.values.customer}
                error={Boolean(formik.errors.customer)}
                helperText={formik.errors.customer}
                onChange={formik.handleChange}
                required
              />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={4}>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="cancellationDeedSigned"
                name="cancellationDeedSigned"
                label="Cancellation Deed Signed"
                value={formik.values.cancellationDeedSigned}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.cancellationDeedSigned)}
                helperText={formik.errors.cancellationDeedSigned}
                required
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="project"
                name="project"
                label="Project"
                value={formData?.project}
              />
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
                id="unitNumber"
                name="unitNumber"
                label="Unit Number"
                value={formData?.flatno}
              />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={4}>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="handedToCrm"
                name="handedToCrm"
                label="Handed To CRM"
                value={dayjs(formData?.zzhtcrm).format("DD-MM-YYYY")}
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="consideration"
                name="consideration"
                label="Consideration"
                value={formData?.cvVal}
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="amountPaid"
                name="amountPaid"
                label="Amount Paid"
                value={formik.values.amountPaid}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.amountPaid)}
                helperText={formik.errors.amountPaid}
                required
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="forfeitureAmount"
                name="forfeitureAmount"
                label="Forfeiture Amount"
                value={formik.values.forfeitureAmount}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.forfeitureAmount)}
                helperText={formik.errors.forfeitureAmount}
                required
              />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={4}>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="cashBackAmount"
                name="cashBackAmount"
                label="Cashback Amount"
                value={formik.values.cashBackAmount}
                error={Boolean(formik.errors.cashBackAmount)}
                helperText={formik.errors.cashBackAmount}
                onChange={formik.handleChange}
                required
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3} sx={{ display: "flex" }}>
              <Grid item xs={2} sm={4} md={4}>
                <Typography variant="subtitle1">GST %</Typography>
              </Grid>
              <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
                <FormControlLabel
                  control={
                    <Radio
                      // checked={formik.values.isUrban === true}
                      onChange={() => {
                        formik.resetForm();
                        formik.setFieldValue("isUrban", true);
                      }}
                    />
                  }
                  label="0%"
                  // disabled={}
                />
                <FormControlLabel
                  control={
                    <Radio
                      // checked={formik.values.isUrban === true}
                      onChange={() => {
                        formik.resetForm();
                        formik.setFieldValue("isUrban", true);
                      }}
                    />
                  }
                  label="12%"
                  // disabled={}
                />
              </Grid>
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="gstAmount"
                name="gstAmount"
                label="GST Amount"
                value={formData?.gst}
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="totalForfeiture"
                name="totalForfeiture"
                label="Total Forfeiture"
                value={formik.values.totalForfeiture}
                error={Boolean(formik.errors.totalForfeiture)}
                helperText={formik.errors.totalForfeiture}
                onChange={formik.handleChange}
                required
              />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={4}>
            <Grid item xs={2} sm={3} md={3}>
              <InputField
                id="amountToBeRefund"
                name="amountToBeRefund"
                label="Amount To Be Refund"
                value={formik.values.amountToBeRefund}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.amountToBeRefund)}
                helperText={formik.errors.amountToBeRefund}
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
              <Typography style={{ fontSize: "0.8em" }}>Remark</Typography>
              <textarea
                id="remark"
                name="remark"
                label="Remark"
                style={{ width: "23.7em", height: "3.2em" }}
                value={formik.values.remark}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <Typography style={{ fontSize: "0.8em" }}>
                Rejection Reason
              </Typography>
              <textarea
                id="rejectionReason"
                name="rejectionReason"
                label="Rejection Reason"
                style={{ width: "23.7em", height: "3.2em" }}
                value={formik.values.rejectionReason}
                onChange={formik.handleChange}
              />
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
