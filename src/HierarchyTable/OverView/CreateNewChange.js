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
          projectId: props.selectedRows.projectId,
          trkorr: formik.values.requestNumber,
          ddText: formik.values.changeDescription,
          requester: formik.values.requester,
          priority: formik.values.priority,
          status: formik.values.status,
          requestDt: formik.values.requestDate,
          planStartDt: formik.values.planStartDate,
          planEndDt: formik.values.planEndDate,
          actStartDt: formik.values.actionStartDate,
          actEndDt: formik.values.actionEndDate,
          assigned: formik.values.assignedTo,
          changeType: formik.values.changeType,
          moduleSys: formik.values.module,
          objects: formik.values.object,
          tester: formik.values.tester,
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
    requestNumber: yup.number().required("Required"),
    changeDescription: yup.string().required("Required"),
    requester: yup.string().required("Required"),
    priority: yup.string().required("Required"),
    status: yup.number().required("Required"),
    requestDate: yup.date().required("Required"),
    planStartDate: yup.date().required("Required"),
    planEndDate: yup.date().required("Required"),
    actionStartDate: yup.date().required("Required"),
    actionEndDate: yup.date().required("Required"),
    assignedTo: yup.string().required("Required"),
    changeType: yup.number().required("Required"),
    module: yup.string().required("Required"),
    object: yup.string().required("Required"),
    tester: yup.string().required("Required"),
    notes: yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      changeDescription: "",
      priority: "",
      assignedTo: "",
      startDate: " ",
      remark: "",
      status: "",
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
            <Typography sx={{ marginLeft: "1em" }}> Requester </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              select
              id="requester"
              name="requester"
              label="requester"
              value={formik.values.requester}
              onChange={(e) => {
                formik.setFieldValue("requester", e.target.value);
              }}
              error={Boolean(formik.errors.requester)}
              helperText={formik.errors.requester}
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
            <Typography sx={{ marginLeft: "1em" }}> Request Date</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <CrmDatePicker
              id="requestDate"
              name="requestDate"
              label="Request Date"
              value={dayjs(formik.values.requestDate)}
              onChange={(value) =>
                formik.setFieldValue("requestDate", value, true)
              }
              error={
                formik.touched.requestDate && Boolean(formik.errors.requestDate)
              }
              helperText={formik.errors.requestDate}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}> Plan Start Date</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <CrmDatePicker
              id="planStartDate"
              name="planStartDate"
              label="Plan Start Date"
              value={dayjs(formik.values.planStartDate)}
              onChange={(value) =>
                formik.setFieldValue("planStartDate", value, true)
              }
              error={
                formik.touched.planStartDate &&
                Boolean(formik.errors.planStartDate)
              }
              helperText={formik.errors.planStartDate}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}> Plan End Date</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <CrmDatePicker
              id="planEndDate"
              name="planEndDate"
              label="Plan End Date"
              value={dayjs(formik.values.planEndDate)}
              onChange={(value) =>
                formik.setFieldValue("planEndDate", value, true)
              }
              error={
                formik.touched.planEndDate && Boolean(formik.errors.planEndDate)
              }
              helperText={formik.errors.planEndDate}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}>
              {" "}
              Action Start Date
            </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <CrmDatePicker
              id="actionStartDate"
              name="actionStartDate"
              label="Action Start Date"
              value={dayjs(formik.values.actionStartDate)}
              onChange={(value) =>
                formik.setFieldValue("actionStartDate", value, true)
              }
              error={Boolean(formik.errors.actionStartDate)}
              helperText={formik.errors.actionStartDate}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}> Action End Date</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <CrmDatePicker
              id="actionEndDate"
              name="actionEndDate"
              label="Action End Date"
              value={dayjs(formik.values.actionEndDate)}
              onChange={(value) =>
                formik.setFieldValue("actionEndDate", value, true)
              }
              error={Boolean(formik.errors.actionEndDate)}
              helperText={formik.errors.actionEndDate}
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
            <Typography sx={{ marginLeft: "1em" }}> Change Type </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              select
              id="changeType"
              name="changeType"
              label="Change Type "
              value={formik.values.changeType}
              onChange={(e) => {
                formik.setFieldValue("changeType", e.target.value);
              }}
              error={Boolean(formik.errors.changeType)}
              helperText={formik.errors.changeType}
              required
            >
              {props?.changeType?.map((data) => {
                return (
                  <MenuItem value={data.change}> {data.changeTxt}</MenuItem>
                );
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}> Module </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              select
              id="module"
              name="module"
              label="module"
              value={formik.values.module}
              onChange={(e) => {
                formik.setFieldValue("module", e.target.value);
              }}
              error={Boolean(formik.errors.module)}
              helperText={formik.errors.module}
              required
            >
              {props?.modules?.map((data) => {
                return (
                  <MenuItem value={data.module}> {data.moduleTxt}</MenuItem>
                );
              })}
            </InputField>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}> Object </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="object"
              name="object"
              label="Object"
              value={formik.values.object}
              onChange={(e) => {
                formik.setFieldValue("object", e.target.value);
              }}
              error={Boolean(formik.errors.object)}
              helperText={formik.errors.object}
              required
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}> Tester </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="tester"
              name="tester"
              label="Tester"
              value={formik.values.tester}
              onChange={(e) => {
                formik.setFieldValue("tester", e.target.value);
              }}
              error={Boolean(formik.errors.tester)}
              helperText={formik.errors.tester}
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
                // formik.handleChange();
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
