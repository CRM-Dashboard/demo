import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  FormHelperText,
  Paper,
} from "@mui/material";
import * as Yup from "yup";
import { Formik, Field, Form } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import { LoadingButton } from "@mui/lab";

const AddCollaboratorDialog = ({ open, onClose, onSubmit }) => {
  // Example departments and collaborators data
  const departments = [
    { label: "Engineering", value: "engineering" },
    { label: "Marketing", value: "marketing" },
    { label: "Human Resources", value: "hr" },
    { label: "Finance", value: "finance" },
  ];

  const collaborators = [
    { name: "Alice Johnson", id: "1" },
    { name: "Bob Smith", id: "2" },
    { name: "Charlie Brown", id: "3" },
  ];

  // Validation schema for form validation
  const validationSchema = Yup.object({
    description: Yup.string()
      .required("Description is required")
      .max(200, "Description must be at most 200 characters"),
    comment: Yup.string().required("Comment is required"),
    department: Yup.string().required("Please select a department"),
    assigned: Yup.object().nullable().required("Please select a collaborator"),
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 12,
          padding: "20px",
          backgroundColor: "#f9f9f9",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" align="center" gutterBottom>
          Add Collaborator
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/* Formik Form */}
        <Formik
          initialValues={{
            description: "",
            comment: "",
            department: "",
            assigned: null,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            // Submit form data
            console.log("Form Submitted with values:", values);
            onSubmit(values);
            onClose(); // Close dialog after submit
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
            setFieldValue,
          }) => (
            <Form>
              <Paper style={{ padding: "1rem", marginTop: "1rem" }}>
                {/* <Typography variant="h6" gutterBottom>
                  Add Collaborator
                </Typography> */}
                <Grid container spacing={2}>
                  {/* Description Field */}
                  <Grid item xs={12}>
                    <TextField
                      label="Activity Description"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                    />
                  </Grid>

                  {/* Assigned To Field */}
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={touched.assigned && Boolean(errors.assigned)}
                    >
                      <InputLabel>Assigned To</InputLabel>
                      <Autocomplete
                        options={collaborators}
                        getOptionLabel={(option) => option.name || ""}
                        value={values.assigned}
                        onChange={(_, newValue) => {
                          setFieldValue("assigned", newValue || null);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Assigned To"
                            name="assigned"
                            onBlur={handleBlur}
                          />
                        )}
                      />
                      {touched.assigned && errors.assigned && (
                        <FormHelperText>{errors.assigned}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Department Field */}
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={touched.department && Boolean(errors.department)}
                    >
                      <InputLabel>Department</InputLabel>
                      <Autocomplete
                        options={departments}
                        getOptionLabel={(option) => option.label || ""}
                        value={
                          departments.find(
                            (dept) => dept.value === values.department
                          ) || null
                        }
                        onChange={(_, newValue) => {
                          setFieldValue(
                            "department",
                            newValue ? newValue.value : ""
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Department"
                            name="department"
                            onBlur={handleBlur}
                          />
                        )}
                      />
                      {touched.department && errors.department && (
                        <FormHelperText>{errors.department}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Comment Field */}
                  <Grid item xs={12}>
                    <TextField
                      label="Comment"
                      name="comment"
                      value={values.comment}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      multiline
                      rows={4}
                      fullWidth
                      error={touched.comment && Boolean(errors.comment)}
                      helperText={touched.comment && errors.comment}
                    />
                  </Grid>
                </Grid>

                {/* Submit Button */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "1rem",
                  }}
                >
                  <LoadingButton
                    type="submit"
                    color="primary"
                    variant="contained"
                  >
                    Submit
                  </LoadingButton>
                </div>
              </Paper>
            </Form>
          )}
        </Formik>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center", marginTop: "20px" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          size="large"
          style={{ textTransform: "none", borderRadius: 8 }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCollaboratorDialog;
