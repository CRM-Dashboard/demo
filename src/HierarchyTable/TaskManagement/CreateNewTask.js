/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Grid, Box, Typography, MenuItem } from "@mui/material";
import InputField from "../../crm/components/inputField/InputField";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";

const CreateNewTask = forwardRef((props, ref) => {
  const [error, setError] = useState("Required");

  const reducerData = useSelector((state) => state);

  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const snackbar = UseCustomSnackbar();

  const createTask = () => {
    const entryData = {
      PROJECT: [],
      TASK: [
        {
          projectId: formik.values.project,
          taskDesc: formik.values.taskDescription,
          assignedTo: formik.values.assignedTo,
          remark: formik.values.remark,
        },
      ],
      TICKET: [],
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
            props.setOpenCreateTask(false);
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
    createTask,
  }));

  const validationSchema = yup.object({
    // taskName: yup.string().required("Required"),
    taskDescription: yup.string().required("Required"),
    assignedTo: yup.string().required("Required"),
    remark: yup.string().required("Required"),
    project: yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      project: "",
      taskDescription: "",
      assignedTo: "",
      remark: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      createTask(data);
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
              New Task
            </Typography>
          </Grid>
        </Grid>
        {/* <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}> Task Name </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="taskName"
              name="taskName"
              label="Task Name"
              value={formik.values.taskName}
              onChange={(e) => {
                formik.setFieldValue("taskName", e.target.value);
              }}
              error={Boolean(formik.errors.taskName)}
              helperText={formik.errors.taskName}
              required
            />
          </Grid>
        </Grid> */}
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}>
              {" "}
              Task Description{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="taskDescription"
              name="taskDescription"
              label="Task Description"
              value={formik.values.taskDescription}
              onChange={(e) => {
                formik.setFieldValue("taskDescription", e.target.value);
              }}
              error={Boolean(formik.errors.taskDescription)}
              helperText={formik.errors.taskDescription}
              required
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}> Assigned To </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              select
              id="assignedTo"
              name="assignedTo"
              label="Assigned To"
              value={formik.values.assignedTo}
              onChange={(e) => {
                formik.setFieldValue("assignedTo", e.target.value);
              }}
              error={Boolean(formik.errors.assignedTo)}
              helperText={formik.errors.assignedTo}
              required
            >
              {props?.users?.map((data) => {
                return (
                  <MenuItem value={data?.bname} key={data?.bname}>
                    {" "}
                    {data?.name}
                  </MenuItem>
                );
              })}
            </InputField>
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
              id="project"
              name="project"
              label="Project"
              value={formik.values.project}
              onChange={(e) => {
                formik.setFieldValue("project", e.target.value);
              }}
              error={Boolean(formik.errors.project)}
              helperText={formik.errors.project}
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

export default CreateNewTask;
