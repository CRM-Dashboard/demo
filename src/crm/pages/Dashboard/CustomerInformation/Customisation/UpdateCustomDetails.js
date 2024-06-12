/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useImperativeHandle } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { Grid, Box, MenuItem } from "@mui/material";
import GlobalFunctions from "./../../../../utils/GlobalFunctions";
import DropdownConstants from "../../../../utils/DropdownConstants";
import InputField from "../../../../components/inputField/InputField";
import UseCustomSnackbar from "../../../../components/snackbar/UseCustomSnackBar";

const UpdateCustomDetails = forwardRef((props, ref) => {
  const IntrogativeQueConstant = DropdownConstants.IntrogativeQueConstant;

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const projectId = reducerData?.dashboard?.project?.projectId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const orderId = reducerData.searchBar.orderId;

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Update customisation details of customer",
      CHANGEIND: "U",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const saveCustomDetails = () => {
    const entryData = {
      personal: [],
      address: [],
      child: [],
      bank: [],
      transact: [],
      crm: [],
      custom: [
        {
          orderId: orderId,
          custom: formik.values.custom,
          custom_nature: formik.values.customNature,
          pdd_mail: formik.values.pdd_mail,
          terms: formik.values.terms,
          other_detail: formik.values.otherDetail,
        },
      ],
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
          props.setIsCustomEditable(false);
        } else {
          snackbar.showError("Failed to update records!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with updating records", error);
      });
  };

  useImperativeHandle(ref, () => ({
    saveCustomDetails,
  }));

  const validationSchema = yup.object({
    custom: yup.string(),
    customNature: yup.string(),
    pdd_mail: yup.string(),
    terms: yup.string(),
    otherDetail: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      custom: props?.customerInfo?.custom === "" ? "N" : "X",
      customNature: props.customerInfo.customNature
        ? props.customerInfo.customNature
        : "",
      pdd_mail: props?.customerInfo?.pddMail === "" ? "N" : "X",
      terms: props.customerInfo.terms ? props.customerInfo.terms : "",
      otherDetail: props.customerInfo.otherDetail
        ? props.customerInfo.otherDetail
        : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      saveCustomDetails(data);
    },
  });

  return (
    <formik>
      <Box sx={{ paddingTop: "0.5em" }}>
        <Grid>
          <Grid>
            <InputField
              select
              id="custom"
              name="custom"
              label="Custom Application"
              value={formik.values.custom}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.custom)}
              helperText={formik.errors.custom}
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
              id="customNature"
              name="customNature"
              label="Nature of customisation in the unit"
              value={formik.values.customNature}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.customNature)}
              helperText={formik.errors.customNature}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              select
              id="pdd_mail"
              name="pdd_mail"
              label="Details of customisation in the unit sent to PDD"
              value={formik.values.pdd_mail}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.pdd_mail)}
              helperText={formik.errors.pdd_mail}
              required
            >
              {IntrogativeQueConstant?.map((data) => {
                return <MenuItem value={data.Id}>{data.Name}</MenuItem>;
              })}
            </InputField>
            {/* <InputField
              id="pdd_mail"
              name="pdd_mail"
              label="Details of customisation in the unit sent to PDD"
              value={formik.values.pdd_mail}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.pdd_mail)}
              helperText={formik.errors.pdd_mail}
            /> */}
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              id="terms"
              name="terms"
              label="Finalised Terms and condition"
              value={formik.values.terms}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.terms)}
              helperText={formik.errors.terms}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              id="otherDetail"
              name="otherDetail"
              label="Any Other Details"
              value={formik.values.otherDetail}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.otherDetail)}
              helperText={formik.errors.otherDetail}
            />
          </Grid>
        </Grid>
        <br />
      </Box>
    </formik>
  );
});

export default UpdateCustomDetails;
