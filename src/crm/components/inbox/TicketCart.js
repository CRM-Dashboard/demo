import React, { useEffect, memo, useRef, useState } from "react";
import { useFormik } from "formik";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  Chip,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DoneIcon from "@mui/icons-material/Done";
import PendingIcon from "@mui/icons-material/Pending";
import dayjs from "dayjs";
import CollaboratorsUI from "../../../myActivity/components/CollaboratorsUI";

const colorsSchema = {
  Open: "info",
  Closed: "success",
  "In Progress": "error",
  "Customer Action Pending": "warning",
  LOW: "secondary",
  MEDIUM: "warning",
  HIGH: "error",
  Default: "primary",
};

const TicketCart = ({
  ticketFields,
  onSubmit,
  onCancel,
  validationSchema,
  selectedTicket,
  tabname,
  deptData,
  assignData,
  getValuesFromForm,
}) => {
  const completeRef = useRef(null);
  const customerRef = useRef(null);
  const submitRef = useRef(null);
  const [btnClicked, setBtnClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: ticketFields.reduce((acc, field) => {
      acc[field.name] =
        field.defaultValue || (field.type === "date" ? null : "");
      return acc;
    }, {}),
    validationSchema: validationSchema || null,
    onSubmit: async (values, action) => {
      try {
        setIsLoading(true);
        let clickedButtonId = null;

        // Check which button is clicked by inspecting the refs
        if (
          completeRef.current &&
          completeRef.current === document.activeElement
        ) {
          clickedButtonId = completeRef.current.id; // Complete button clicked
          setBtnClicked(completeRef.current.id);
        } else if (
          customerRef.current &&
          customerRef.current === document.activeElement
        ) {
          clickedButtonId = customerRef.current.id; // Customer button clicked
          setBtnClicked(customerRef.current.id);
        } else if (
          submitRef.current &&
          submitRef.current === document.activeElement
        ) {
          clickedButtonId = submitRef.current.id; // Submit button clicked
          setBtnClicked(submitRef.current.id);
        }

        if (onSubmit) await onSubmit(values, clickedButtonId, tabname);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const { setValues, values } = formik;

  useEffect(() => {
    if (typeof getValuesFromForm === "function") {
      getValuesFromForm(values);
    }
  }, [values, getValuesFromForm]);

  const updateSelectedTicketValues = () => {
    const updatedValues = ticketFields.reduce((acc, field) => {
      const value = selectedTicket[field.name];
      if (field.type === "date" && value) {
        acc[field.name] = dayjs(value); // Convert to dayjs object for date pickers
      } else {
        acc[field.name] = value ?? ""; // Default to empty string for undefined values
      }
      return acc;
    }, {});
    setValues(updatedValues);
  };

  useEffect(() => {
    if (selectedTicket) {
      updateSelectedTicketValues();
    }
  }, [selectedTicket]);

  return (
    <Paper style={{ padding: "1rem", marginTop: "1rem", marginRight: "1rem" }}>
      <form
        onSubmit={formik.handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <Grid container spacing={2}>
          {ticketFields.map((field) => {
            const isReadOnly = [
              "createdDateTime",
              "priority",
              "statTxt",
              "sender",
            ].includes(field.name);

            return (
              <Grid
                item
                xs={12}
                sm={
                  field.name === "comments" ||
                  field.name === "description" ||
                  field.type === "typo"
                    ? 12
                    : 6
                }
                key={field.name}
              >
                {field.type === "typo" ? (
                  <Typography variant="body1" color="textSecondary">
                    <strong> {formik.values[field.name] || field.label}</strong>
                  </Typography>
                ) : field.name === "subject" ||
                  field.name === "name" ||
                  field.name === "maktx" ? (
                  <Typography variant="body1">
                    {field.name === "subject" ? (
                      <strong>{formik.values[field.name]}</strong>
                    ) : (
                      <>
                        <strong>{field.label}: </strong>
                        {formik.values[field.name]}
                      </>
                    )}
                  </Typography>
                ) : isReadOnly ? (
                  <Chip
                    label={
                      field.name === "createdDateTime"
                        ? new Date(formik.values[field.name]).toLocaleString(
                            "en-IN",
                            { timeZone: "Asia/Kolkata" }
                          )
                        : `${formik.values[field.name]}`
                    }
                    //
                    variant="filled"
                    color={
                      colorsSchema[formik.values[field.name]] ||
                      colorsSchema.Default
                    }
                  />
                ) : field.type === "select" ? (
                  <FormControl
                    fullWidth
                    error={
                      formik.touched[field.name] &&
                      Boolean(formik.errors[field.name])
                    }
                  >
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      label={field.label}
                      name={field.name}
                      value={formik.values[field.name]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {field.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched[field.name] &&
                      formik.errors[field.name] && (
                        <FormHelperText>
                          {formik.errors[field.name]}
                        </FormHelperText>
                      )}
                  </FormControl>
                ) : field.type === "date" ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label={field.label}
                      value={formik.values[field.name]}
                      onChange={(date) =>
                        formik.setFieldValue(field.name, date)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name={field.name}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched[field.name] &&
                            Boolean(formik.errors[field.name])
                          }
                          helperText={
                            formik.touched[field.name] &&
                            formik.errors[field.name]
                          }
                          fullWidth
                        />
                      )}
                    />
                  </LocalizationProvider>
                ) : (
                  <TextField
                    label={field.label}
                    multiline={true}
                    name={field.name}
                    type={field.type || "text"}
                    value={formik.values[field.name]}
                    onChange={formik.handleChange}
                    inputProps={{ readOnly: field.isDisabled }}
                    placeholder={
                      field.name === "comments"
                        ? "Add Comments"
                        : "Issue Description"
                    }
                    onBlur={formik.handleBlur}
                    sx={{ width: "100%" }}
                    fullWidth
                    error={
                      formik.touched[field.name] &&
                      Boolean(formik.errors[field.name])
                    }
                    helperText={
                      formik.touched[field.name] && formik.errors[field.name]
                    }
                  />
                )}
              </Grid>
            );
          })}
        </Grid>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {tabname !== "open" &&
            tabname !== "closed" &&
            deptData &&
            assignData && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              >
                <Typography>Collaborators</Typography>
                <CollaboratorsUI
                  deptData={deptData}
                  assignData={assignData}
                  selectedTicket={selectedTicket}
                />
              </Box>
            )}

          {tabname !== "closed" && (
            <>
              {tabname !== "open" && (
                <LoadingButton
                  startIcon={<PendingIcon />}
                  type="submit"
                  id="customer"
                  ref={customerRef}
                  color="primary"
                  variant="outlined"
                  disabled={isLoading && document.activeElement !== btnClicked}
                  loading={isLoading && document.activeElement === btnClicked}
                >
                  Customer Action Pending
                </LoadingButton>
              )}

              <LoadingButton
                startIcon={<DoneIcon />}
                type="submit"
                ref={completeRef}
                id="complete"
                color="primary"
                variant="outlined"
                disabled={isLoading && document.activeElement !== btnClicked}
                loading={isLoading && document.activeElement === btnClicked}
              >
                Complete
              </LoadingButton>
              <LoadingButton
                ref={submitRef}
                id="submit"
                type="submit"
                color="primary"
                variant="contained"
                disabled={isLoading && document.activeElement !== btnClicked}
                loading={isLoading && document.activeElement === btnClicked}
              >
                Submit
              </LoadingButton>
            </>
          )}
        </div>
      </form>
    </Paper>
  );
};

export default memo(TicketCart);
