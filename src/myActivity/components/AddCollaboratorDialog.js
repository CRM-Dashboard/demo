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
import api from "../../services/api";
import { useSelector } from "react-redux";

const AddCollaboratorDialog = ({
  open,
  onClose,
  onSubmit,
  assignData,
  deptData,
  selectedTicket,
}) => {
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);
  const addCollaborator = async (data) => {
    try {
      const url = `/api/ticket/add-collabrator`;
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("ticketId", selectedTicket?.ticketId);
      formData.append("data", JSON.stringify(data));
      console.log("data addd", data);
      const res = (await api.post(url, formData)).data;
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  // Validation schema for form validation
  const validationSchema = Yup.object({
    description: Yup.string()
      .required("Description is required")
      .max(200, "Description must be at most 200 characters"),
    comment: Yup.string().required("Comment is required"),
    dept: Yup.object().required("Please select a department"),
    assigned: Yup.object().nullable().required("Please select a collaborator"),
  });
  // assigned

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
            dept: "",
            assigned: null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            // Submit form data
            console.log("Form Submitted with values:", values);

            const { description, comment, dept, assigned } = values;

            const data = {
              activity_des: description,
              dept: dept.deptCode,
              assigned: assigned.id,
              comments: comment,
            };
            console.log("data", data);
            const res = await addCollaborator(data);
            console.log("dhsghdgh", res);
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
                      <Autocomplete
                        options={assignData || []}
                        getOptionLabel={(option) => option.name || ""}
                        value={values.assigned}
                        noOptionsText="No Options"
                        onChange={(_, newValue) => {
                          setFieldValue("assigned", newValue || null);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Assigned To"
                            name="assigned"
                            variant="outlined"
                            onBlur={handleBlur}
                            InputLabelProps={{ shrink: true }}
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
                      error={touched.dept && Boolean(errors.dept)}
                    >
                      <Autocomplete
                        options={deptData || []}
                        noOptionsText="No Options"
                        getOptionLabel={(option) => option.deptTxt || ""}
                        value={
                          deptData.find((dept) => dept.value === values.dept) ||
                          null
                        }
                        onChange={(_, newValue) => {
                          setFieldValue("dept", newValue ? newValue : "");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Department"
                            name="department"
                            onBlur={handleBlur}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                      {touched.dept && errors.dept && (
                        <FormHelperText>{errors.dept}</FormHelperText>
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
