import React, { forwardRef, useImperativeHandle } from "react";
import dayjs from "dayjs";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { Grid, Box, MenuItem } from "@mui/material";
import GlobalFunctions from "../../../../utils/GlobalFunctions";
import DropdownConstants from "../../../../utils/DropdownConstants";
import InputField from "../../../../components/inputField/InputField";
import CrmDatePicker from "../../../../components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../../../components/snackbar/UseCustomSnackBar";

const UpdateLoanDetails = forwardRef((props, ref) => {
  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const orderId = reducerData.searchBar.orderId;
  const IntrogativeQueConstant = DropdownConstants.IntrogativeQueConstant;

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Loan details has been updated!",
      CHANGEIND: "U",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const saveLoanDetails = () => {
    console.log("#################foemik.values", formik.values);
    const entryData = {
      loan: [
        {
          orderId: orderId,
          zzlnocdt: formik.values.zzlnocdt, // "Loan NOC Date
          zzlbnknam: formik.values.zzlbnknam, //  "Loan bank name
          loan_san_dt: formik.values.loan_san_dt, //  "Loan sanction Date
          zsanc_amt_dmbtr: formik.values.zsanc_amt_dmbtr, //  "sanction amount
          zdisbrsmnt_date: formik.values.zdisbrsmnt_date, //  "disbursement date
          zopt_gcs: formik.values.zopt_gcs, //   "opted for gcs
          zmld_conn: formik.values.zmld_conn, // "mld connect
          zgcs_code: formik.values.zgcs_code, //  "gcs code
          zbank_gcs: formik.values.zbank_gcs, //  "bank for gcs
          zbank_mlb: formik.values.zbank_mlb, // "bank for mld
          self_fund: formik.values.selfFund,
          banker: formik.values.banker,
          banker_mail: formik.values.bankerMail,
          banker_mob: formik.values.bankerMobile,
        },
      ],
    };
    console.log("######entryData", entryData);

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("orderId", orderId);
    formData.append("entryData", JSON.stringify(entryData));

    fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/updateSo", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          saveLog();
          snackbar.showSuccess("Records updated successfully!");
          props.setIsLoanInfoEditable(false);
          props.getData();
        } else {
          snackbar.showError("Failed to update records!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with updating records", error);
      });
  };

  useImperativeHandle(ref, () => ({
    saveLoanDetails,
  }));

  const validationSchema = Yup.object().shape({
    zzlnocdt: Yup.date().required("Required"), // "Loan NOC Date
    zzlbnknam: Yup.string().required("Required"), //  "Loan bank name
    loan_san_dt: Yup.date().required("Required"), //  "Loan sanction Date
    zsanc_amt_dmbtr: Yup.number().required("Required"), //  "sanction amount
    zdisbrsmnt_date: Yup.date().required("Required"), //  "disbursement date
    zopt_gcs: Yup.string().required("Required"), //   "opted for gcs
    zmld_conn: Yup.string().required("Required"), // "mld connect
    zgcs_code: Yup.string().required("Required"), //  "gcs code
    zbank_gcs: Yup.string().required("Required"), //  "bank for gcs
    zbank_mlb: Yup.string().required("Required"),
    selfFund: Yup.string().required("Required"),
    banker: Yup.string().required("Required"),
    bankerMail: Yup.string().required("Required"),
    bankerMobile: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      zzlnocdt: props.loanDetails?.zzlnocdt ? props.loanDetails?.zzlnocdt : "",
      zzlbnknam: props.loanDetails?.zzlbnknam
        ? props.loanDetails?.zzlbnknam
        : "",
      loan_san_dt: props.loanDetails?.loanSanDt
        ? props.loanDetails?.loanSanDt
        : "",
      zsanc_amt_dmbtr: props.loanDetails?.zsancAmtDmbtr
        ? props.loanDetails?.zsancAmtDmbtr
        : "",
      zdisbrsmnt_date: props.loanDetails?.zdisbrsmntDate
        ? props.loanDetails?.zdisbrsmntDate
        : "",
      zopt_gcs: props.loanDetails?.zoptGcs ? props.loanDetails?.zoptGcs : "",
      zmld_conn: props.loanDetails?.zmldConn ? props.loanDetails?.zmldConn : "",
      zgcs_code: props.loanDetails?.zgcsCode ? props.loanDetails?.zgcsCode : "",
      zbank_gcs: props.loanDetails?.zbankGcs ? props.loanDetails?.zbankGcs : "",
      zbank_mlb: props.loanDetails?.zbankMlb ? props.loanDetails?.zbankMlb : "",
      selfFund: props.loanDetails?.selfFund ? props.loanDetails?.selfFund : "",
      banker: props.loanDetails?.banker ? props.loanDetails?.banker : "",
      bankerMail: props.loanDetails?.bankerMail
        ? props.loanDetails?.bankerMail
        : "",
      bankerMobile: props.loanDetails?.bankerMob
        ? props.loanDetails?.bankerMob
        : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // const data = values;
      saveLoanDetails();
    },
  });

  return (
    <formik>
      <Box sx={{ paddingTop: "0.5em" }}>
        <Grid>
          <Grid>
            <CrmDatePicker
              id="zzlnocdt"
              name="zzlnocdt"
              label="Loan NOC Date"
              value={dayjs(formik.values.zzlnocdt)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("zzlnocdt", formattedDate, true);
              }}
              error={formik.touched.zzlnocdt && Boolean(formik.errors.zzlnocdt)}
              helperText={formik.touched.zzlnocdt && formik.errors.zzlnocdt}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <CrmDatePicker
              id="loan_san_dt"
              name="loan_san_dt"
              label="Loan Sanction Date:"
              value={dayjs(formik.values.loan_san_dt)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("loan_san_dt", formattedDate, true);
              }}
              error={
                formik.touched.loan_san_dt && Boolean(formik.errors.loan_san_dt)
              }
              helperText={
                formik.touched.loan_san_dt && formik.errors.loan_san_dt
              }
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              id="zsanc_amt_dmbtr"
              name="zsanc_amt_dmbtr"
              label="Loan Sanction Amount"
              value={formik.values.zsanc_amt_dmbtr}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              select
              id="zopt_gcs"
              name="zopt_gcs"
              label="Opted For GCS"
              value={formik.values.zopt_gcs}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.zopt_gcs)}
              helperText={formik.errors.zopt_gcs}
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
            <InputField
              select
              id="zmld_conn"
              name="zmld_conn"
              label="MLD Connect"
              value={formik.values.zmld_conn}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.zmld_conn)}
              helperText={formik.errors.zmld_conn}
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
            <InputField
              select
              id="zgcs_code"
              name="zgcs_code"
              label="GCS Code"
              value={formik.values.zgcs_code}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.zgcs_code)}
              helperText={formik.errors.zgcs_code}
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
            <InputField
              select
              id="zbank_gcs"
              name="zbank_gcs"
              label="Bank for GCS"
              value={formik.values.zbank_gcs}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.zbank_gcs)}
              helperText={formik.errors.zbank_gcs}
              required
            >
              {props.gcs?.map((data) => {
                return (
                  <MenuItem value={data.domvalueL}>{data.ddtext}</MenuItem>
                );
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              select
              id="zbank_mlb"
              name="zbank_mlb"
              label="Bank for MLD"
              value={formik.values.zbank_mlb}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.zbank_mlb)}
              helperText={formik.errors.zbank_mlb}
              required
            >
              {props.mld?.map((data) => {
                return (
                  <MenuItem value={data.domvalueL}>{data.ddtext}</MenuItem>
                );
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              id="zzlbnknam"
              name="zzlbnknam"
              label="Bank Name"
              value={formik.values.zzlbnknam}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <CrmDatePicker
              id="zdisbrsmnt_date"
              name="zdisbrsmnt_date"
              label="Disbursement Date"
              value={dayjs(formik.values.zdisbrsmnt_date)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("zdisbrsmnt_date", formattedDate, true);
              }}
              error={
                formik.touched.zdisbrsmnt_date &&
                Boolean(formik.errors.zdisbrsmnt_date)
              }
              helperText={
                formik.touched.zdisbrsmnt_date && formik.errors.zdisbrsmnt_date
              }
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              select
              id="selfFund"
              name="selfFund"
              label="Self Fund"
              value={formik.values.selfFund}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.selfFund)}
              helperText={formik.errors.selfFund}
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
            <InputField
              id="banker"
              name="banker"
              label="Banker"
              value={formik.values.banker}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              id="bankerMail"
              name="bankerMail"
              label="Banker Mail"
              value={formik.values.bankerMail}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              id="bankerMobile"
              name="bankerMobile"
              label="Banker Mobile"
              value={formik.values.bankerMobile}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
      </Box>
    </formik>
  );
});

export default UpdateLoanDetails;
