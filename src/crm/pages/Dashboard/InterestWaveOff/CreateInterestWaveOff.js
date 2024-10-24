/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import GlobalFunctions from "./../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Grid, Box, Typography, MenuItem } from "@mui/material";
import InputField from "../../../components/inputField/InputField";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";

const CreateInterestWaveOff = forwardRef((props, ref) => {
  const [fieldData, setFieldData] = useState({});
  const [rsnToApprove, setRsnToApprove] = useState({});
  const [rsnToReject, setReasonToReject] = useState({});
  const [detailsTSend, setDetailsToSend] = useState([]);
  const [reasons, setReasons] = useState("");
  const [loading, setLoading] = useState(false);

  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const customerName = reducerData?.searchBar?.accountStatement?.CustomerName;
  const orderId = reducerData.searchBar.orderId;
  const snackbar = UseCustomSnackbar();

  const getData = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("orderId", orderId);

    fetch(
      process.env.REACT_APP_SERVER_URL +
        "/api/dashboard/interestWaiveOff/get_waiveint_create",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data[0]) {
          setFieldData(data[0]?.reqdata[0]);
          setLoading(false);
          const Data = data[0]?.reqdata[0];
          const apprReason = Object.keys(Data)
            .filter((key) => key.includes("arsn"))
            .map((key) => Data[key]);
          setRsnToApprove(apprReason);
          const rejectReason = Object.keys(Data)
            .filter((key) => key.includes("rrsn"))
            .map((key) => Data[key]);
          setReasonToReject(rejectReason);
          setReasons(data[0].rsndata);
        }
      });
    fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/so", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data[0]?.so[0]) {
          setDetailsToSend(data[0]?.so[0]);
        }
      });
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [orderId]);

  const saveLog = async (data) => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Create Interest Waveoff Request",
      CHANGEIND: "I",
      VALUE_OLD: {},
      VALUE_NEW: data,
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const saveReceipt = () => {
    const entryData = {
      vbeln: detailsTSend.vbeln,
      werks: detailsTSend.werks,
      building: detailsTSend.building,
      flatno: detailsTSend.flatno,
      project: detailsTSend.project,
      customer: customerName,
      cv_val: detailsTSend.cvVal,
      pmt_unit: detailsTSend.pmtUnit,
      bal_unit: detailsTSend.balUnit,
      int_amt: fieldData?.intAmt,
      int_bal: fieldData?.intBalance,
      int_waived: fieldData.intWaived,
      waive_rsn: formik.values.reason,
      waive_amt: formik.values.waiverAmt,
      matnr: detailsTSend.matnr,
      maktx: detailsTSend.maktx,
      remark: formik.values.remarks,
      arsn1: fieldData.arsn1,
      arsn2: fieldData.arsn2,
      arsn3: fieldData.arsn3,
      arsn4: fieldData.arsn4,
      rrsn1: fieldData.rrsn1,
      rrsn2: fieldData.rrsn2,
      rrsn3: fieldData.rrsn3,
      rrsn4: fieldData.rrsn4,
    };

    const Data = new FormData();
    Data.append("userName", userName);
    Data.append("passWord", passWord);
    Data.append("entryData", JSON.stringify(entryData));

    if (Object.keys(formik.errors).length === 0) {
      props.setDisabledCreateBtn(true);
      fetch(
        process.env.REACT_APP_SERVER_URL +
          `/api/dashboard/interestWaiveOff/post_waiveint_create`,
        {
          method: "POST",
          body: Data,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            saveLog(entryData);
            snackbar.showSuccess("Interest waived off created successfully!");
            props.setopenCreateForm(false);
            props.getTableData();
            props.setDisabledCreateBtn(false);
          }
        })
        .catch((error) => {
          if (error) {
            snackbar.showError("Error while creating. Please try again!");
          }
        });
    }
  };

  useImperativeHandle(ref, () => ({
    saveReceipt: formik.handleSubmit,
  }));

  const validationSchema = yup.object({
    reason: yup.string().required("Required"),
    interestDueAmt: yup.number(),
    interestWaivedOff: yup.number(),
    waiverRequested: yup.number(),
    balanceInterest: yup.number(),
    waiverAmt: yup.number().required("Required"),
    remarks: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      reason: "",
      interestDueAmt: 0,
      interestWaivedOff: 0,
      waiverRequested: 0,
      balanceInterest: 0,
      waiverAmt: "",
      remarks: "",
    },
    validationSchema,
    onSubmit: (values) => {
      saveReceipt();
    },
  });

  return !loading && reasons ? (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ paddingTop: "1.5em" }}>
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="interestDueAmt"
              name="interestDueAmt"
              label="Interest Due Amount"
              value={fieldData?.intAmt}
            />
          </Grid>

          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="interestWaivedOff"
              name="interestWaivedOff"
              label="Interest Waived Off"
              value={fieldData.intWaived}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="waiverRequested"
              name="waiverRequested"
              label="Waiver Requested"
              value={fieldData?.waiveReqed}
            />
          </Grid>

          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="balanceInterest"
              name="balanceInterest"
              label="Balance Interest"
              value={fieldData?.intBalance}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={8} sm={12} md={12}>
            <InputField
              id="waiverAmt"
              name="waiverAmt"
              label="Waiver Amount"
              value={formik.values.waiverAmt}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.waiverAmt)}
              helperText={formik.errors.waiverAmt}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={8} sm={12} md={12}>
            <InputField
              select
              id="reason"
              name="reason"
              label="Reason"
              value={formik.values.reason}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.reason)}
              helperText={formik.errors.reason}
            >
              <MenuItem value=""> Select Reason </MenuItem>
              {reasons?.map((rsn, index) => {
                return (
                  <MenuItem value={rsn.waiveRsn} key={index}>
                    {" "}
                    {rsn.ddtext}
                  </MenuItem>
                );
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={2} sm={3} md={3}>
            <Typography style={{ fontSize: "0.8em" }}>Remarks</Typography>
            <textarea
              id="remarks"
              name="remarks"
              label="Remarks"
              style={{
                width: "31.5em",
                height: "3.2em",
                padding: "0.5em",
                fontSize: "17px",
              }}
              value={formik.values.remarks}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
        <Typography>System Suggestion : </Typography>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <Grid>
              <Typography>Reasons to Approve :</Typography>
            </Grid>
            {rsnToApprove.map((rsns, index) => (
              <>
                <div style={{ color: "green" }}>
                  {rsns ? (
                    <>
                      <div key={index}>
                        <Typography> - {rsns}</Typography>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ))}
          </Grid>

          <Grid item xs={4} sm={6} md={6}>
            <Typography>Reasons to Reject :</Typography>

            {rsnToReject.map((rsns, index) => (
              <>
                <div style={{ color: "red" }}>
                  {rsns ? (
                    <>
                      <div key={index}>
                        <Typography> - {rsns}</Typography>
                        <br />
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ))}
          </Grid>
        </Grid>
      </Box>
    </form>
  ) : (
    <CircularScreenLoader isModal={true} />
  );
});

export default CreateInterestWaveOff;
