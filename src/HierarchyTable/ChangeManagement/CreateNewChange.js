/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Grid, Box, Typography, MenuItem } from "@mui/material";
import InputField from "../../crm/components/inputField/InputField";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";

const CreateNewChange = forwardRef((props, ref) => {
  const [error, setError] = useState("Required");

  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const snackbar = UseCustomSnackbar();

  const createChange = () => {
    const entryData = {
      PROJECT: [],
      TASK: [],
      TICKET: [],
      CHANGE: [
        {
          projectId: formik.values.projectId,
          trkorr: formik.values.requestNumber,
          ddText: formik.values.changeDescription,
          requester: formik.values.requester,
          notes: formik.values.notes,
        },
      ],
    };
    if (!formik.values.notes) {
      setError("Required");
    } else {
      setError("");
    }

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(entryData));

    //process.env.REACT_APP_SERVER_URL +
    if (Object.keys(formik.errors).length === 0 && error !== "Required") {
      fetch(process.env.REACT_APP_SERVER_URL + `/api/activity/createProject`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            snackbar.showSuccess("Change created successfully!");
            props.setOpenCreateChange(false);
            props.getTableData();
          }
        })
        .catch((error) => {
          if (error) {
            snackbar.showError(
              "Error while creating activity. Please try again!"
            );
          }
        });
    }
  };

  useImperativeHandle(ref, () => ({
    createChange,
  }));

  const validationSchema = yup.object({
    projectId: yup.string().required("Required"),
    requestNumber: yup.number().required("Required"),
    changeDescription: yup.string().required("Required"),
    notes: yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      projectId: "",
      requestNumber: "",
      changeDescription: "",
      Notes: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      createChange(data);
    },
  });

  return (
    <formik>
      <Box sx={{ paddingTop: "1.5em" }}>
        <Grid container spacing={4}>
          <Grid
            item
            xs={4}
            sm={8}
            md={8}
            sx={{ display: "flex", fontWeight: "bold" }}
          >
            <Typography
              sx={{ marginLeft: "1em", fontWeight: "bold", fontSize: "25px" }}
            >
              New Change Request
            </Typography>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}> Request Number </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="requestNumber"
              name="requestNumber"
              label="Request Number"
              value={formik.values.requestNumber}
              onChange={(e) => {
                formik.setFieldValue("requestNumber", e.target.value);
              }}
              error={Boolean(formik.errors.requestNumber)}
              helperText={formik.errors.requestNumber}
              required
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}> Project </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              select
              id="projectId"
              name="projectId"
              label="Project"
              value={formik.values.projectId}
              onChange={(e) => {
                formik.setFieldValue("projectId", e.target.value);
              }}
              error={Boolean(formik.errors.projectId)}
              helperText={formik.errors.projectId}
              required
            >
              {props?.projects?.map((data) => {
                return (
                  <MenuItem value={data?.projectId} key={data?.projectName}>
                    {" "}
                    {data?.projectName}
                  </MenuItem>
                );
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}>
              {" "}
              Change Description{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="changeDescription"
              name="changeDescription"
              label="Change Description"
              value={formik.values.changeDescription}
              onChange={(e) => {
                formik.setFieldValue("changeDescription", e.target.value);
              }}
              error={Boolean(formik.errors.changeDescription)}
              helperText={formik.errors.changeDescription}
              required
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}> Notes </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <textarea
              id="notes"
              name="notes"
              label="Notes"
              style={{
                width: "25.5em",
                fontFamily: "Futura",
                paddingLeft: "0.5em",
                paddingTop: "0.5em",
                paddingRight: "0.5em",
              }}
              value={formik.values.notes}
              onChange={(e) => {
                formik.setFieldValue("notes", e.target.value);
                setError("");
              }}
            />
            {error && (
              <Typography style={{ color: "red", fontSize: "13px" }}>
                {error}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </formik>
  );
});

export default CreateNewChange;
