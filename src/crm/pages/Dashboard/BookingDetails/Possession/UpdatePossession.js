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

const UpdatePossession = forwardRef((props, ref) => {
  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const warrantyConstants = DropdownConstants.Warranty_Extension;

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Possession details has been updated!",
      CHANGEIND: "U",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const savePossessionDetails = () => {
    console.log("#################foemik.values", formik.values);
    const entryData = {
      possession: [
        {
          orderid: orderId,
          warranty_ext: formik.values.warranty_ext,
          zzpasdt: formik.values.zzpasdt,
          zmaintdt: formik.values.zmaintdt,
          zzwstdt: formik.values.zzwstdt,
          zzwendt: formik.values.zzwendt,
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
          props.setIsPossessionInfoEditable(false);
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
    savePossessionDetails,
  }));

  const validationSchema = Yup.object().shape({
    warranty_ext: Yup.string().required("Required"),
    zzpasdt: Yup.date().required("Required"),
    zmaintdt: Yup.date().required("Required"),
    zzwstdt: Yup.date().required("Required"),
    zzwendt: Yup.date().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      warranty_ext: props.possessionDetails?.warrantyExt
        ? props.possessionDetails?.warrantyExt
        : "",
      zzpasdt: props.possessionDetails?.zzpasdt
        ? props.possessionDetails?.zzpasdt
        : "",
      zmaintdt: props.possessionDetails?.zmaintdt
        ? props.possessionDetails?.zmaintdt
        : "",
      zzwstdt: props.possessionDetails?.zzwstdt
        ? props.possessionDetails?.zzwstdt
        : "",
      zzwendt: props?.possessionDetails?.zzwendt
        ? props.possessionDetails?.zzwendt
        : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // const data = values;
      savePossessionDetails();
    },
  });

  return (
    <formik>
      <Box sx={{ paddingTop: "0.5em" }}>
        <Grid>
          <Grid>
            <InputField
              select
              id="warranty_ext"
              name="warranty_ext"
              label="Warranty Extension"
              value={formik.values.warranty_ext}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.warranty_ext)}
              helperText={formik.errors.warranty_ext}
              required
            >
              {warrantyConstants?.map((data) => {
                return <MenuItem value={data.Id}>{data.Name}</MenuItem>;
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <CrmDatePicker
              id="zzpasdt"
              name="zzpasdt"
              label="Possession Date"
              value={dayjs(formik.values.zzpasdt)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("zzpasdt", formattedDate, true);
              }}
              error={formik.touched.zzpasdt && Boolean(formik.errors.zzpasdt)}
              helperText={formik.touched.zzpasdt && formik.errors.zzpasdt}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <CrmDatePicker
              id="zmaintdt"
              name="zmaintdt"
              label="Maintainance Start Date"
              value={dayjs(formik.values.zmaintdt)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("zmaintdt", formattedDate, true);
              }}
              error={formik.touched.zmaintdt && Boolean(formik.errors.zmaintdt)}
              helperText={formik.touched.zmaintdt && formik.errors.zmaintdt}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <CrmDatePicker
              id="zzwstdt"
              name="zzwstdt"
              label="Warranty Start Date"
              value={dayjs(formik.values.zzwstdt)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("zzwstdt", formattedDate, true);
              }}
              error={formik.touched.zzwstdt && Boolean(formik.errors.zzwstdt)}
              helperText={formik.touched.zzwstdt && formik.errors.zzwstdt}
            />
          </Grid>
        </Grid>
        <br />

        <Grid>
          <Grid>
            <CrmDatePicker
              id="zzwendt"
              name="zzwendt"
              label="Warranty End Date"
              value={dayjs(formik.values.zzwendt)}
              onChange={(value) => {
                const formattedDate = value
                  ? dayjs(value).format("YYYY-MM-DD")
                  : "";
                formik.setFieldValue("zzwendt", formattedDate, true);
              }}
              error={formik.touched.zzwendt && Boolean(formik.errors.zzwendt)}
              helperText={formik.touched.zzwendt && formik.errors.zzwendt}
            />
          </Grid>
        </Grid>
        <br />
      </Box>
    </formik>
  );
});

export default UpdatePossession;
