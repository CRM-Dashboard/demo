/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import { useFormik } from "formik";
import { Grid, Box, Typography, MenuItem } from "@mui/material";
import InputField from "../../crm/components/inputField/InputField";
import CrmDatePicker from "../../crm/components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";
import { useSelector } from "react-redux/es/hooks/useSelector";

const CreateNewProject = forwardRef((props, ref) => {
  const [error, setError] = useState("Required");

  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const snackbar = UseCustomSnackbar();

  const createProject = () => {
    const entryData = {
      PROJECT: [
        {
          projectId: "",
          endDt: "",
          progress: "",
          projectName: formik.values.projName,
          projectDesc: formik.values.projDescription,
          projectMgr: formik.values.projManager,
          priority: formik.values.priority,
          stage: formik.values.stage,
          status: formik.values.status,
          startDt: formik.values.startDate,
          remark: formik.values.remark,
        },
      ],
      TASK: [],
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
      fetch(process.env.REACT_APP_SERVER_URL + `/api/activity/createProject`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            snackbar.showSuccess("Project created successfully!");
            props.setOpenCreateForm(false);
            props.getTableData();
          }
        })
        .catch((error) => {
          console.log("########error", error);
          if (error) {
            snackbar.showError(
              "Error while creating activity. Please try again!"
            );
          }
        });
    }
  };

  useImperativeHandle(ref, () => ({
    createProject,
  }));

  const validationSchema = yup.object({
    projName: yup.string().required("Required"),
    projDescription: yup.string().required("Required"),
    projManager: yup.string().required("Required"),
    priority: yup.string().required("Required"),
    stage: yup.string().required("Required"),
    status: yup.number().required("Required"),
    startDate: yup.date().required("Required"),
    remark: yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      projName: "",
      projDescription: "",
      projManager: "",
      priority: "",
      stage: "",
      status: "",
      startDate: " ",
      remark: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      createProject(data);
    },
  });

  useEffect(() => {
    console.log("statuses@@@@@@", props.statuses);
  }, []);

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
              New Project
            </Typography>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}> Project Name </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="projName"
              name="projName"
              label="Project Name"
              value={formik.values.projName}
              onChange={(e) => {
                formik.setFieldValue("projName", e.target.value);
              }}
              error={Boolean(formik.errors.projName)}
              helperText={formik.errors.projName}
              required
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}>
              {" "}
              Project Description{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="projDescription"
              name="projDescription"
              label="Project Description"
              value={formik.values.projDescription}
              onChange={(e) => {
                formik.setFieldValue("projDescription", e.target.value);
              }}
              error={Boolean(formik.errors.projDescription)}
              helperText={formik.errors.projDescription}
              required
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={2} sm={4} md={4} sx={{ display: "flex" }}>
            <Typography sx={{ marginLeft: "1em" }}>
              {" "}
              Project Manager{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              id="projManager"
              name="projManager"
              label="Project Manager"
              value={formik.values.projManager}
              onChange={(e) => {
                formik.setFieldValue("projManager", e.target.value);
              }}
              error={Boolean(formik.errors.projManager)}
              helperText={formik.errors.projManager}
              required
            >
              {/* {subActData?.map((data) => {
                return (
                  <MenuItem value={data.actSubtyp}>
                    {" "}
                    {data.actSubtypTxt}
                  </MenuItem>
                );
              })} */}
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
            <Typography sx={{ marginLeft: "1em" }}> Stage</Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <InputField
              select
              id="stage"
              name="stage"
              label="Stage"
              value={formik.values.stage}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.stage)}
              helperText={formik.errors.stage}
            >
              {props?.stages?.map((data) => {
                return <MenuItem value={data.stage}> {data.stageTxt}</MenuItem>;
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
            <Typography sx={{ marginLeft: "1em" }}> Remarks </Typography>
          </Grid>
          <Grid item xs={6} sm={8} md={8}>
            <textarea
              id="remark"
              name="remark"
              label="Remark"
              style={{
                width: "25.5em",
                fontFamily: "Futura, sans-serif",
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

export default CreateNewProject;
