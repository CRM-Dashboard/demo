/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useImperativeHandle } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { Grid, Box } from "@mui/material";
import InputField from "../../../../components/inputField/InputField";
import GlobalFunctions from "./../../../../utils/GlobalFunctions";
import UseCustomSnackbar from "../../../../components/snackbar/UseCustomSnackBar";

const UpdateBankDetails = forwardRef((props, ref) => {
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
      OBJECT: "Update bank details",
      CHANGEIND: "U",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const saveBankDetails = () => {
    console.log("#################foemik.values", formik.values);
    const entryData = {
      personal: [],
      address: [],
      child: [],
      transact: [],
      crm: [],
      bank: [
        {
          customerid: props.customerInfo.customerId,
          bank_acc_name: formik.values.bankAccountName,
          bank_acc_no: formik.values.bankAccountNumber,
          bank_name: formik.values.bankName,
          bank_addr: formik.values.bankAddress,
          ifsc: formik.values.ifsc,
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
          props.setIsBankInfoEditable(false);
        } else {
          snackbar.showError("Failed to update records!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with updating records", error);
      });
  };

  useImperativeHandle(ref, () => ({
    saveBankDetails,
  }));

  const validationSchema = yup.object({
    bankAccountName: yup.string(),
    bankAccountNumber: yup.string(),
    bankName: yup.number(),
    bankAddress: yup.string(),
    ifsc: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      bankAccountName: props.customerInfo.bankAccName
        ? props.customerInfo.bankAccName
        : "",
      bankAccountNumber: props.customerInfo.bankAccNo
        ? props.customerInfo.bankAccNo
        : "",
      bankName: props.customerInfo.bankName ? props.customerInfo.bankName : "",
      bankAddress: props.customerInfo.bankAddr
        ? props.customerInfo.bankAddr
        : "",
      ifsc: props.customerInfo.ifsc ? props.customerInfo.ifsc : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      saveBankDetails(data);
    },
  });

  return (
    <formik>
      <Box sx={{ paddingTop: "0.5em" }}>
        <Grid>
          <Grid>
            <InputField
              id="bankAccountName"
              name="bankAccountName"
              label="Bank Account Name"
              value={formik.values.bankAccountName}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              id="bankAccountNumber"
              name="bankAccountNumber"
              label="Bank Account Number"
              value={formik.values.bankAccountNumber}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              id="bankName"
              name="bankName"
              label="Bank Name"
              value={formik.values.bankName}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              id="bankAddress"
              name="bankAddress"
              label="Bank Address"
              value={formik.values.bankAddress}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              id="ifsc"
              name="ifsc"
              label="IFSC"
              value={formik.values.ifsc}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
      </Box>
    </formik>
  );
});

export default UpdateBankDetails;
