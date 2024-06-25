/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { Grid, Box, MenuItem } from "@mui/material";
import GlobalFunctions from "../../../../utils/GlobalFunctions";
import InputField from "../../../../components/inputField/InputField";
import UseCustomSnackbar from "../../../../components/snackbar/UseCustomSnackBar";

const UpdateAddressDetails = forwardRef((props, ref) => {
  const [states, setStates] = useState([]);

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
      OBJECT: "Update Address of customer",
      CHANGEIND: "U",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const saveAddressDetails = () => {
    const entryData = {
      personal: [],
      address: [
        {
          partner: props.customerInfo.partnerId,
          city: formik.values.city,
          postl_cod1: formik.values.pincode,
          str_suppl1: formik.values.address1,
          str_suppl2: formik.values.address2,
          str_suppl3: formik.values.address3,
          street: formik.values.street,
          country: formik.values.country,
          region: formik.values.state,
          mobile: formik.values.mobileNumber,
          mobile2: formik.values.alterMobileNumber,
          e_mail: formik.values.email,
        },
      ],
      child: [],
      bank: [],
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
          props.setIsAddressEditable(false);
          props.getUpdatedData();
        } else {
          snackbar.showError("Failed to update records!");
        }
      })
      .catch((error) => {
        console.error("There was a problem with updating records", error);
      });
  };

  useImperativeHandle(ref, () => ({
    saveAddressDetails,
  }));

  const validationSchema = yup.object({
    address: yup.string(),
    city: yup.string(),
    pincode: yup.number(),
    email: yup.string(),
    state: yup.string(),
    country: yup.string(),

    mobileNumber: yup.number(),
  });

  const formik = useFormik({
    initialValues: {
      address1: props.customerInfo.strSuppl1
        ? props.customerInfo.strSuppl1
        : "",
      address2: props.customerInfo.strSuppl2
        ? props.customerInfo.strSuppl2
        : "",
      address3: props.customerInfo.strSuppl3
        ? props.customerInfo.strSuppl3
        : "",
      street: props.customerInfo.street ? props.customerInfo.street : "",
      city: props.customerInfo.city ? props.customerInfo.city : "",
      pincode: props.customerInfo.postCode1 ? props.customerInfo.postCode1 : "",
      state: props.customerInfo.stateid ? props.customerInfo.stateid : "",
      country: props.customerInfo.countryid ? props.customerInfo.countryid : "",
      email: props.customerInfo.Email ? props.customerInfo.Email : "",

      mobileNumber: props.customerInfo.Mobile ? props.customerInfo.Mobile : "",
      alterMobileNumber: props.customerInfo.mobile2
        ? props.customerInfo.mobile2
        : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      saveAddressDetails(data);
    },
  });

  useEffect(() => {
    const allStates = props.stateData?.filter(
      (data) => data.CountryId === formik.values.country
    );
    setStates(allStates);
  }, [formik.values.country]);

  return (
    <formik>
      <Box sx={{ paddingTop: "0.5em" }}>
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="address1"
              name="address1"
              label="Address1"
              value={formik.values.address1}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="address2"
              name="address2"
              label="Address2"
              value={formik.values.address2}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="address3"
              name="address3"
              label="Address3"
              value={formik.values.address3}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="street"
              name="street"
              label="Street"
              value={formik.values.street}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="city"
              name="city"
              label="City"
              value={formik.values.city}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="pincode"
              name="pincode"
              label="Pin Code"
              value={formik.values.pincode}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="country"
              name="country"
              label="country"
              value={formik.values.country}
              //   onChange={(e) => {
              //     formik.setFieldValue("title", e.target.value);
              //   }}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.country)}
              helperText={formik.errors.country}
              required
            >
              {props.countryData?.map((data) => {
                return (
                  <MenuItem value={data.CountryId}>
                    {" "}
                    {data.CountryName}
                  </MenuItem>
                );
              })}
            </InputField>
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="state"
              name="state"
              label="State"
              value={formik.values.state}
              //   onChange={(e) => {
              //     formik.setFieldValue("title", e.target.value);
              //   }}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.state)}
              helperText={formik.errors.state}
              required
            >
              {states?.map((data) => {
                return (
                  <MenuItem value={data.StateId}> {data.StateName}</MenuItem>
                );
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="mobileNumber"
              name="mobileNumber"
              label="Mobile Number"
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="alterMobileNumber"
              name="alterMobileNumber"
              label="Alternate Mobile Number"
              value={formik.values.alterMobileNumber}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
      </Box>
    </formik>
  );
});

export default UpdateAddressDetails;
