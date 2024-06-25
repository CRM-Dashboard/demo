/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useImperativeHandle } from "react";
import * as yup from "yup";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { Grid, Box, MenuItem } from "@mui/material";
import InputField from "../../../../components/inputField/InputField";
import CrmDatePicker from "../../../../components/crmDatePicker/CrmDatePicker";
import DropdownConstants from "./../../../../utils/DropdownConstants";
import UseCustomSnackbar from "../../../../components/snackbar/UseCustomSnackBar";
import GlobalFunctions from "../../../../utils/GlobalFunctions";

const UpdateTransactionDetails = forwardRef((props, ref) => {
  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const orderId = reducerData.searchBar.orderId;
  const projectId = reducerData?.dashboard?.project?.projectId;
  const selfFundingConstant = DropdownConstants.SelfFundingConstant;
  const IntrogativeQueConstant = DropdownConstants.IntrogativeQueConstant;

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Update transsaction details of customer",
      CHANGEIND: "U",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const saveTransactionDetails = () => {
    const entryData = {
      personal: [],
      address: [],
      child: [],
      bank: [],
      transact: [
        {
          orderId: orderId,
          pend_amt: formik.values.pendAmt,
          pend_gst: formik.values.pendGst,
          pend_dt: formik.values.pendDt,
          reg_dev: formik.values.regDev,
          dev_dt: formik.values.devDt,
          self_pmt: formik.values.selfPmt,
        },
      ],
      crm: [],
      custom: [],
    };
    console.log("######entryData", entryData);

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("projectId", projectId);
    formData.append("entryData", JSON.stringify(entryData));

    fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/saveCustomer", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          saveLog();
          snackbar.showSuccess("Records updated successfully!");
          props.setIsTransInfoEditable(false);
        } else {
          snackbar.showError("Failed to update records!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with updating records", error);
      });
  };

  useImperativeHandle(ref, () => ({
    saveTransactionDetails,
  }));

  const validationSchema = yup.object({
    pendAmt: yup.number(),
    pendGst: yup.number(),
    pendDt: yup.date(),
    regDev: yup.string(),
    devDt: yup.date(),
    selfPmt: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      pendAmt: props.customerInfo.pendAmt ? props.customerInfo.pendAmt : "",
      pendGst: props.customerInfo.pendGst ? props.customerInfo.pendGst : "",
      pendDt: props.customerInfo.pendDt ? props.customerInfo.pendDt : "",
      regDev: props?.customerInfo?.regDev === "" ? "N" : "X",
      devDt: props.customerInfo.devDt ? props.customerInfo.devDt : "",
      selfPmt: props.customerInfo.selfPmt,
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      saveTransactionDetails(data);
    },
  });

  return (
    <formik>
      <Box sx={{ paddingTop: "0.5em" }}>
        <Grid>
          <Grid>
            <InputField
              id="pendAmt"
              name="pendAmt"
              label="Pending Unit Amount(Before Registration)"
              value={formik.values.pendAmt}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              id="pendGst"
              name="pendGst"
              label="Pending GST Amount(Before Registration)"
              value={formik.values.pendGst}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <CrmDatePicker
              id="pendDt"
              name="pendDt"
              label="Timeline for pending amounts(Before Registration)"
              value={dayjs(formik.values.pendDt)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("pendDt", formattedDate, true);
              }}
              error={formik.touched.pendDt && Boolean(formik.errors.pendDt)}
              helperText={formik.touched.pendDt && formik.errors.pendDt}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              select
              id="regDev"
              name="regDev"
              label="Registration Deviation"
              value={formik.values.regDev}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.regDev)}
              helperText={formik.errors.regDev}
              required
            >
              {IntrogativeQueConstant?.map((data) => {
                return <MenuItem value={data.Id}>{data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <CrmDatePicker
              id="devDt"
              name="devDt"
              label="Timeline for Registration"
              value={dayjs(formik.values.devDt)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("devDt", formattedDate, true);
              }}
              error={formik.touched.devDt && Boolean(formik.errors.devDt)}
              helperText={formik.touched.devDt && formik.errors.devDt}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              select
              id="selfPmt"
              name="selfPmt"
              label="If Self Funding"
              value={formik.values.selfPmt}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.selfPmt)}
              helperText={formik.errors.selfPmt}
              required
            >
              {selfFundingConstant?.map((data) => {
                return <MenuItem value={data.Id}>{data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />
      </Box>
    </formik>
  );
});

export default UpdateTransactionDetails;
