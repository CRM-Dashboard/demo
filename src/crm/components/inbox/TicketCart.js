import React, { useEffect, memo } from "react";
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
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DoneIcon from "@mui/icons-material/Done";
import PendingIcon from "@mui/icons-material/Pending";
import dayjs from "dayjs";

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
}) => {
  const formik = useFormik({
    initialValues: ticketFields.reduce((acc, field) => {
      acc[field.name] =
        field.defaultValue || (field.type === "date" ? null : "");
      return acc;
    }, {}),
    validationSchema: validationSchema || null,
    onSubmit: (values) => {
      console.log("onSubmit called with values:", values);
      if (onSubmit) onSubmit(values);
    },
  });

  const { setValues } = formik;

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
            console.log("color", formik.values[field.name]);
            console.log(
              "color generate",
              colorsSchema[formik.values[field.name]]
            );
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
                  field.name === "comments" || field.name === "description"
                    ? 12
                    : 6
                }
                key={field.name}
              >
                {field.name === "subject" ||
                field.name === "name" ||
                field.name === "maktx" ? (
                  <Typography
                    variant="body1"
                    // component="div"

                    // style={{
                    //   padding: "8px",
                    //   backgroundColor: "#f9f9f9",
                    //   color: "#555",
                    // }}
                  >
                    {field.name === "subject" ? (
                      <strong>{formik.values[field.name]}</strong>
                    ) : (
                      <>
                        {" "}
                        <strong>{field.label}: </strong>
                        {formik.values[field.name]}
                      </>
                    )}
                  </Typography>
                ) : isReadOnly ? (
                  <Chip
                    label={`${formik.values[field.name]}`}
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
                    name={field.name}
                    type={field.type || "text"}
                    value={formik.values[field.name]}
                    onChange={formik.handleChange}
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
        {/* {tabname !== "closed" && ( */}
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
        >
          <LoadingButton
            startIcon={<DoneIcon />}
            type="submit"
            color="primary"
            variant="outlined"
          >
            Complete
          </LoadingButton>
          <LoadingButton
            startIcon={<PendingIcon />}
            type="submit"
            color="primary"
            variant="outlined"
          >
            Customer Action Pending
          </LoadingButton>
          <LoadingButton type="submit" color="primary" variant="contained">
            Submit
          </LoadingButton>
        </div>
        {/* // )} */}
      </form>
    </Paper>
  );
};

export default memo(TicketCart);
