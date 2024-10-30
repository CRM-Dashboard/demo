import React, { memo, useEffect } from "react";
import {
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";

const CreateUpdateDrawing = () => {
  const selectedDrawing = useSelector(
    (state) => state?.drawing?.selectedDrawing
  );
  const initialFormValues = {
    drawUid: "",
    name1: "",
    drawNo: "",
    version: "",
    drawTxt: "",
    stage: "",
    location: "",
    categ: "",
    remarks: "",
  };

  const validationSchema = Yup.object({
    drawUid: Yup.string()
      .min(5, "Must be at least 5 characters")
      .required("Drawing ID is required"),
    name1: Yup.string()
      .max(100, "Project name is too long")
      .required("Project is required"),
    drawNo: Yup.string().required("Drawing No is required"),
    version: Yup.string()
      .matches(/^[A-Z0-9]+$/, "Only uppercase letters and numbers are allowed")
      .required("Version is required"),
    drawTxt: Yup.string().required("Drawing Description is required"),
    stage: Yup.string().required("Stage is required"),
    location: Yup.string().required("Location is required"),
    categ: Yup.string().required("Category is required"),
    remarks: Yup.string().max(500, "Remarks cannot exceed 500 characters"),
  });

  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Form values", values);
      // Handle form submission here (e.g., sending selectedDrawing to an API)
    },
  });

  // Destructure values and onChange
  const { values, handleChange, handleSubmit, touched, errors } = formik;

  // Function to fetch selectedDrawing from external API
  const setData = () => {
    formik.setValues({
      drawUid: selectedDrawing.drawUid || "",
      name1: selectedDrawing.name1 || "",
      drawNo: selectedDrawing.drawNo || "",
      version: selectedDrawing.version || "",
      drawTxt: selectedDrawing.drawTxt || "",
      stage: selectedDrawing.stage || "",
      location: selectedDrawing.location || "",
      categ: selectedDrawing.categ || "",
      remarks: selectedDrawing.remarks || "",
    });
  };

  useEffect(() => {
    setData();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Grid
        container
        spacing={2}
        sx={{
          padding: 3,
          border: "1px solid #ddd",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Create or Update Drawing
          </Typography>
        </Grid>

        {/** Text Fields **/}
        <Grid item xs={12} md={6}>
          <TextField
            id="drawUid"
            name="drawUid"
            label="Drawing ID"
            fullWidth
            variant="outlined"
            value={values.drawUid}
            onChange={handleChange}
            error={touched.drawUid && Boolean(errors.drawUid)}
            helperText={touched.drawUid && errors.drawUid}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="name1"
            name="name1"
            label="Project"
            fullWidth
            variant="outlined"
            value={values.name1}
            onChange={handleChange}
            error={touched.name1 && Boolean(errors.name1)}
            helperText={touched.name1 && errors.name1}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="drawNo"
            name="drawNo"
            label="Drawing No"
            fullWidth
            variant="outlined"
            value={values.drawNo}
            onChange={handleChange}
            error={touched.drawNo && Boolean(errors.drawNo)}
            helperText={touched.drawNo && errors.drawNo}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="version"
            name="version"
            label="Version"
            fullWidth
            variant="outlined"
            value={values.version}
            onChange={handleChange}
            error={touched.version && Boolean(errors.version)}
            helperText={touched.version && errors.version}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="drawTxt"
            name="drawTxt"
            label="Drawing Description"
            fullWidth
            variant="outlined"
            value={values.drawTxt}
            onChange={handleChange}
            error={touched.drawTxt && Boolean(errors.drawTxt)}
            helperText={touched.drawTxt && errors.drawTxt}
          />
        </Grid>

        {/** Select Fields **/}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Stage</InputLabel>
            <Select
              id="stage"
              name="stage"
              value={values.stage}
              onChange={handleChange}
              error={touched.stage && Boolean(errors.stage)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={2}>Twenty</MenuItem>
              <MenuItem value={21}>Twenty one</MenuItem>
              <MenuItem value={22}>Twenty two</MenuItem>
            </Select>
            {touched.stage && errors.stage && (
              <Typography color="error" variant="caption">
                {errors.stage}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Location</InputLabel>
            <Select
              id="location"
              name="location"
              value={values.location}
              onChange={handleChange}
              error={touched.location && Boolean(errors.location)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={21}>Twenty one</MenuItem>
              <MenuItem value={22}>Twenty two</MenuItem>
            </Select>
            {touched.location && errors.location && (
              <Typography color="error" variant="caption">
                {errors.location}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Category</InputLabel>
            <Select
              id="categ"
              name="categ"
              value={values.categ}
              onChange={handleChange}
              error={touched.categ && Boolean(errors.categ)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={21}>Twenty one</MenuItem>
              <MenuItem value={22}>Twenty two</MenuItem>
            </Select>
            {touched.categ && errors.categ && (
              <Typography color="error" variant="caption">
                {errors.categ}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id="remarks"
            name="remarks"
            label="Remarks"
            fullWidth
            variant="outlined"
            value={values.remarks}
            onChange={handleChange}
            error={touched.remarks && Boolean(errors.remarks)}
            helperText={touched.remarks && errors.remarks}
          />
        </Grid>

        {/** Submit Buttons **/}
        <Grid
          item
          xs={12}
          container
          spacing={2}
          justifyContent="space-between"
          sx={{ mt: 2 }}
        >
          <Grid item xs={12} sm={4}>
            <Button variant="contained" color="primary" fullWidth type="submit">
              Upload Drawing
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" color="secondary" fullWidth>
              Download Drawing
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" color="success" fullWidth>
              View Drawing
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default memo(CreateUpdateDrawing);
