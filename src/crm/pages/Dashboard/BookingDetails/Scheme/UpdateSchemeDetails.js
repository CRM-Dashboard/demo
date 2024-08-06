import React, { forwardRef, useImperativeHandle, useState } from "react";
import dayjs from "dayjs";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import GlobalFunctions from "../../../../utils/GlobalFunctions";
import DropdownConstants from "../../../../utils/DropdownConstants";
import InputField from "../../../../components/inputField/InputField";
import CrmDatePicker from "../../../../components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../../../components/snackbar/UseCustomSnackBar";
import {
  Grid,
  Box,
  MenuItem,
  Checkbox,
  TextField,
  Autocomplete,
  FormControlLabel,
} from "@mui/material";

const UpdateSchemeDetails = forwardRef((props, ref) => {
  const [filteredOptions, setFilteredOptions] = useState(props.customers);

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
      OBJECT: "Scheme details has been updated!",
      CHANGEIND: "U",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const saveSchemeDetails = () => {
    console.log("#################foemik.values", formik.values);
    props.setDisableUpdateBtn(true);
    const entryData = {
      scheme: [
        {
          orderId: orderId,
          scheme: formik.values.scheme,
          scheme_start: formik.values.schemeStart, // "Loan NOC Date
          scheme_end: formik.values.schemeEnd, //  "Loan bank name
          scheme_cost: formik.values.schemeCost, //  "Loan sanction Date
          special_pmt: formik.values.specialPmt, //  "sanction amount
          holdy_ind: formik.values.holdyInd, //  "disbursement date
          ot_ind: formik.values.otInd === true ? "X" : "N", //   "opted for gcs
          reference: formik.values.reference, // "mld connect
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
          props.setIsSchemeInfoEditable(false);
          props.setDisableUpdateBtn(false);
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
    saveSchemeDetails,
  }));

  const validationSchema = Yup.object().shape({
    scheme: Yup.string().required("Required"),
    schemeStart: Yup.date().required("Required"),
    schemeEnd: Yup.date().required("Required"),
    schemeCost: Yup.number().required("Required"),
    specialPmt: Yup.string().required("Required"),
    holdyInd: Yup.string().required("Required"),
    otInd: Yup.string().required("Required"),
    reference: Yup.string().required("Required"),
    customer: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      scheme: props.schemeDetails?.scheme ? props.schemeDetails?.scheme : "",
      schemeStart:
        props.schemeDetails?.schemeStart === "0000-00-00"
          ? null
          : props.schemeDetails?.schemeStart,
      schemeEnd:
        props.schemeDetails?.schemeEnd === "0000-00-00"
          ? null
          : props.schemeDetails?.schemeEnd,
      schemeCost: props.schemeDetails?.schemeCost
        ? props.schemeDetails?.schemeCost
        : "",
      specialPmt: props?.schemeDetails?.specialPmt
        ? props.schemeDetails?.specialPmt
        : "",
      holdyInd: props.schemeDetails?.holdyInd
        ? props.schemeDetails?.holdyInd
        : "",
      otInd: props.schemeDetails?.otInd
        ? props.schemeDetails?.otInd === "X"
          ? true
          : false
        : false,
      reference: props.schemeDetails?.reference
        ? props.schemeDetails?.reference
        : "",
      customer: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // const data = values;
      saveSchemeDetails();
    },
  });

  const handleInputChange = (event, value) => {
    formik.setFieldValue("reference", value);
    const filtered = props.customers.filter((customer) =>
      customer.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleChange = (event, value) => {
    if (value) {
      formik.setFieldValue("customer", value.name);
      formik.setFieldValue("reference", value.customerId);
    } else {
      formik.setFieldValue("customer", "");
      formik.setFieldValue("reference", "");
    }
  };

  return (
    <formik>
      <Box sx={{ paddingTop: "0.5em" }}>
        <Grid>
          <Grid>
            <InputField
              id="scheme"
              name="scheme"
              label="Scheme"
              value={formik.values.scheme}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <CrmDatePicker
              id="schemeStart"
              name="schemeStart"
              label="Scheme Start Date:"
              value={dayjs(formik.values.schemeStart)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("schemeStart", formattedDate, true);
              }}
              error={
                formik.touched.schemeStart && Boolean(formik.errors.schemeStart)
              }
              helperText={
                formik.touched.schemeStart && formik.errors.schemeStart
              }
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <CrmDatePicker
              id="schemeEnd"
              name="schemeEnd"
              label="Scheme End Date"
              value={dayjs(formik.values.schemeEnd)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("schemeEnd", formattedDate, true);
              }}
              error={
                formik.touched.schemeEnd && Boolean(formik.errors.schemeEnd)
              }
              helperText={formik.touched.schemeEnd && formik.errors.schemeEnd}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              id="schemeCost"
              name="schemeCost"
              label="Scheme Cost"
              value={formik.values.schemeCost}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <InputField
              select
              id="specialPmt"
              name="specialPmt"
              label="Special Payment"
              value={formik.values.specialPmt}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.specialPmt)}
              helperText={formik.errors.specialPmt}
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
              id="holdyInd"
              name="holdyInd"
              label="Y Hold"
              value={formik.values.holdyInd}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.holdyInd)}
              helperText={formik.errors.holdyInd}
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
            <FormControlLabel
              control={
                <Checkbox
                  name="otInd"
                  id="otInd"
                  value={formik.values.otInd}
                  checked={formik.values.otInd}
                  onClick={(event) => {
                    formik.setFieldValue("otInd", event.target.checked);
                    console.log("##############otrInd", event.target.checked);
                  }}
                  onChange={(e) => {
                    console.log("##############otrInd", e.target.checked);
                  }}
                />
              }
              label="OTR / OTE Eligible"
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <Autocomplete
              options={filteredOptions}
              getOptionLabel={(option) => option.name}
              onInputChange={handleInputChange}
              onChange={handleChange}
              value={
                filteredOptions.find(
                  (option) => option.name === formik.values.customer
                ) || null
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Customer"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            {/* <InputField
              id="reference"
              name="reference"
              label="Reference"
              value={formik.values.reference}
              onChange={formik.handleChange}
            /> */}
          </Grid>
        </Grid>
        <br />
      </Box>
    </formik>
  );
});

export default UpdateSchemeDetails;
