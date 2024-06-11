/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useImperativeHandle } from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { Grid, Box } from "@mui/material";
import GlobalFunctions from "./../../../../utils/GlobalFunctions";
import InputField from "../../../../components/inputField/InputField";
import CrmDatePicker from "../../../../components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../../../components/snackbar/UseCustomSnackBar";

const UpdateRegistrationDetails = forwardRef((props, ref) => {
  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const orderId = reducerData.searchBar.orderId;
  const projectId = reducerData?.dashboard?.project?.projectId;

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Registration details has been updated!",
      CHANGEIND: "U",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const saveRegDetails = () => {
    console.log("#################foemik.values", formik.values);
    const entryData = {
      register: [
        {
          orderId: orderId,
          reck_rate: formik.values.reckRate,
          zstamp: formik.values.zstamp,
          draft_appr_dt: formik.values.draftApprDt,
          zzregdt: formik.values.regDate,
          zzregno: formik.values.regNo,
          zzhano: formik.values.zzhano,
          zzagmdt: formik.values.zzagmdt,
        },
      ],
    };
    console.log("######entryData", entryData);

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("projectId", projectId);
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
          props.setIsRegInfoEditable(false);
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
    saveRegDetails,
  }));

  const validationSchema = yup.object({
    reckRate: yup.number(),
    zstamp: yup.number(), //SDR/ESBTR Received Amount,
    draftApprDt: yup.date(), //Agreement Draft Accepted date
    regDate: yup.date(),
    zzagmdt: yup.date(), //Agreement date
    regNo: yup.number(),
    zzhano: yup.number(), //haveli number
  });

  const formik = useFormik({
    initialValues: {
      reckRate: props?.registerInfo?.reckRate
        ? props?.registerInfo?.reckRate
        : "", //Ready Reckoner Rate,
      zstamp: props?.registerInfo?.zstamp ? props?.registerInfo?.zstamp : "", //SDR/ESBTR Received Amount,
      draftApprDt: props?.registerInfo?.draftApprDt
        ? props?.registerInfo?.draftApprDt
        : "", //Agreement Draft Accepted date
      regDate: props?.registerInfo?.zzregdt ? props?.registerInfo?.zzregdt : "",
      zzagmdt: props?.registerInfo?.zzagmdt ? props?.registerInfo?.zzagmdt : "", //Agreement date
      regNo: props?.registerInfo?.zzregno ? props?.registerInfo?.zzregno : "",
      zzhano: props?.registerInfo?.zzhano ? props?.registerInfo?.zzhano : "", //haveli number
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      saveRegDetails(data);
    },
  });

  return (
    <formik>
      <Box sx={{ paddingTop: "0.5em" }}>
        <Grid>
          <Grid>
            <InputField
              id="reckRate"
              name="reckRate"
              label="Ready Reckoner Rate"
              value={formik.values.reckRate}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              id="zstamp"
              name="zstamp"
              label="SDR/ESBTR Received Amount"
              value={formik.values.zstamp}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <CrmDatePicker
              id="draftApprDt"
              name="draftApprDt"
              label="Agreement Draft Accepted Date"
              value={dayjs(formik.values.draftApprDt)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("draftApprDt", formattedDate, true);
              }}
              error={
                formik.touched.draftApprDt && Boolean(formik.errors.draftApprDt)
              }
              helperText={
                formik.touched.draftApprDt && formik.errors.draftApprDt
              }
            />
            {/* <InputField
              id="draftApprDt"
              name="draftApprDt"
              label="Agreement Draft Accepted Date"
              value={formik.values.draftApprDt}
              onChange={formik.handleChange}
            /> */}
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <CrmDatePicker
              id="regDate"
              name="regDate"
              label="Registration Date"
              value={dayjs(formik.values.regDate)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("regDate", formattedDate, true);
              }}
              error={formik.touched.regDate && Boolean(formik.errors.regDate)}
              helperText={formik.touched.regDate && formik.errors.regDate}
            />
            {/* <InputField
              id="regDate"
              name="regDate"
              label="Registration Date"
              value={formik.values.regDate}
              onChange={formik.handleChange}
            /> */}
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <CrmDatePicker
              id="zzagmdt"
              name="zzagmdt"
              label="Agreement Date"
              value={dayjs(formik.values.zzagmdt)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("zzagmdt", formattedDate, true);
              }}
              error={formik.touched.zzagmdt && Boolean(formik.errors.zzagmdt)}
              helperText={formik.touched.zzagmdt && formik.errors.zzagmdt}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              id="regNo"
              name="regNo"
              label="Registration Number"
              value={formik.values.regNo}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              id="zzhano"
              name="zzhano"
              label="Haveli Number"
              value={formik.values.zzhano}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
      </Box>
    </formik>
  );
});

export default UpdateRegistrationDetails;
