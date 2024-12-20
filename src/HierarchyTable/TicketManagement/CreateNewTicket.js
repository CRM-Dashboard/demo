/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Grid, Box, Typography, MenuItem } from "@mui/material";
import InputField from "../../crm/components/inputField/InputField";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";
import { useSelector } from "react-redux/es/hooks/useSelector";

const CreateNewTicket = forwardRef((props, ref) => {
  const [error, setError] = useState("Required");

  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const snackbar = UseCustomSnackbar();

  const createTicket = () => {
    const entryData = {
      PROJECT: [],
      TASK: [],
      TICKET: [
        {
          projectId: formik.values.projectId,
          category: formik.values.category,
          ticketDesc: formik.values.ticketDescription,
          remark: formik.values.remark,
        },
      ],
    };

    if (!formik.values.remark) {
      setError("Required");
    } else {
      setError("");
    }

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(entryData));

    if (Object.keys(formik.errors).length === 0 && error !== "Required") {
      // process.env.REACT_APP_SERVER_URL
      fetch(process.env.REACT_APP_SERVER_URL + `/api/activity/createProject`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            snackbar.showSuccess("Task created successfully!");
            props.setOpenCreateTicket(false);
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
    createTicket,
  }));

  const validationSchema = yup.object({
    ticketDescription: yup.string().required("Required"),
    category: yup.string().required("Required"),
    projectId: yup.string().required("Required"),
    remark: yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      ticketDescription: "",
      category: "",
      projectId: "",
      remark: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      createTicket(data);
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
              New Ticket
            </Typography>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}>
              {" "}
              Ticket Description{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="ticketDescription"
              name="ticketDescription"
              label="Ticket Description"
              value={formik.values.ticketDescription}
              onChange={(e) => {
                formik.setFieldValue("ticketDescription", e.target.value);
              }}
              error={Boolean(formik.errors.ticketDescription)}
              helperText={formik.errors.ticketDescription}
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
            <Typography sx={{ marginLeft: "1em" }}> Category </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              select
              id="category"
              name="category"
              label="Category"
              value={formik.values.category}
              onChange={(e) => {
                formik.setFieldValue("category", e.target.value);
              }}
              error={Boolean(formik.errors.category)}
              helperText={formik.errors.category}
              required
            >
              {props?.categories?.map((data) => {
                return <MenuItem value={data.categ}> {data.categTxt}</MenuItem>;
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}> Remarks </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <textarea
              id="remark"
              name="remark"
              label="Remark"
              style={{
                width: "25.5em",
                fontFamily: "Futura",
                paddingLeft: "0.5em",
                paddingTop: "0.5em",
                paddingRight: "0.5em",
              }}
              value={formik.values.remarks}
              onChange={(e) => {
                // formik.handleChange();
                formik.setFieldValue("remark", e.target.value);
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

export default CreateNewTicket;
