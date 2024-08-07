/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import { useFormik } from "formik";
import { Grid, Box, Typography, MenuItem } from "@mui/material";
import InputField from "../../crm/components/inputField/InputField";
import CrmDatePicker from "../../crm/components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";
import { useSelector } from "react-redux/es/hooks/useSelector";

const CreateNewTicket = forwardRef((props, ref) => {
  const [error, setError] = useState("Required");
  //   const [subActData, setSubActData] = useState(props.subActTypeData);

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
          endDt: "",
          priority: formik.values.priority,
          ticketDesc: formik.values.ticketDescription,
          assignedTo: formik.values.assignedTo,
          startDt: formik.values.startDate,
          remark: formik.values.remark,
          status: formik.values.status,
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
    // taskName: yup.string().required("Required"),
    ticketDescription: yup.string().required("Required"),
    priority: yup.string().required("Required"),
    assignedTo: yup.string().required("Required"),
    projectId: yup.string().required("Required"),
    startDate: yup.date().required("Required"),
    remark: yup.string().required("Required"),
    status: yup.number().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      //   taskName: "",
      ticketDescription: "",
      priority: "",
      assignedTo: "",
      startDate: " ",
      projectId: "",
      remark: "",
      status: "",
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
            <Typography sx={{ marginLeft: "1em" }}> Start Date</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <CrmDatePicker
              id="startDate"
              name="startDate"
              label="Start Date"
              value={dayjs(formik.values.startDate)}
              onChange={(value) =>
                formik.setFieldValue("startDate", value, true)
              }
              error={
                formik.touched.startDate && Boolean(formik.errors.startDate)
              }
              helperText={formik.errors.startDate}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}> Status </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              select
              id="status"
              name="status"
              label="Status"
              value={formik.values.status}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.status)}
              helperText={formik.errors.status}
            >
              {props?.statuses?.map((data) => {
                return (
                  <MenuItem value={data.status}> {data.statusTxt}</MenuItem>
                );
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}> Priority </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              select
              id="priority"
              name="priority"
              label="Priority"
              value={formik.values.priority}
              onChange={(e) => {
                formik.setFieldValue("priority", e.target.value);
              }}
              error={Boolean(formik.errors.priority)}
              helperText={formik.errors.priority}
              required
            >
              {props?.priorities?.map((data) => {
                return (
                  <MenuItem value={data.priority}> {data.priority}</MenuItem>
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

export default CreateNewTicket;
