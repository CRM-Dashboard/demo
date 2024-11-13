import React, { useEffect, memo } from "react";
import { useFormik } from "formik";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const FormComponent = ({
  formFields,
  onSubmit,
  onCancel,
  validationSchema,
  selectedValues,
}) => {
  const formik = useFormik({
    initialValues: formFields.reduce((acc, field) => {
      acc[field.name] =
        field.defaultValue || (field.type === "date" ? null : "");
      return acc;
    }, {}),
    // validationSchema: validationSchema ? validationSchema : null,
    onSubmit: (values) => {
      if (onSubmit) onSubmit(values);
    },
  });

  const { setValues } = formik;

  const setValuesForUpdate = () => {
    const updatedValues = formFields.reduce((acc, element) => {
      const value = selectedValues[element.name];

      // Convert date fields to Day.js object if they have a value
      if (element.type === "date" && value) {
        acc[element.name] = dayjs(value);
      } else {
        // For other fields, directly assign the value from selectedValues
        acc[element.name] = value ?? ""; // Default to empty string if value is undefined
      }

      return acc;
    }, {});

    setValues(updatedValues);
  };

  useEffect(() => {
    if (selectedValues) {
      setValuesForUpdate();
    }
  }, [selectedValues]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      {formFields.map((field) => {
        if (field.type === "select") {
          // Handling Select input
          return (
            <FormControl
              key={field.name}
              fullWidth
              error={
                formik.touched[field.name] && Boolean(formik.errors[field.name])
              }
            >
              <InputLabel>{field.label}</InputLabel>
              <Select
                label={field.label}
                name={field.name}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
              >
                {field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched[field.name] && formik.errors[field.name] && (
                <FormHelperText>{formik.errors[field.name]}</FormHelperText>
              )}
            </FormControl>
          );
        } else if (field.type === "date") {
          // Handling Date input
          return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={field.name}
                label={field.label}
                value={formik.values[field.name]}
                onChange={(date) => formik.setFieldValue(field.name, date)}
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
                      formik.touched[field.name] && formik.errors[field.name]
                    }
                    fullWidth
                  />
                )}
              />
            </LocalizationProvider>
          );
        }

        // Handling TextField input (default case)
        return (
          <TextField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type || "text"}
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            error={
              formik.touched[field.name] && Boolean(formik.errors[field.name])
            }
            helperText={formik.touched[field.name] && formik.errors[field.name]}
            {...field.props}
          />
        );
      })}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        {onCancel && (
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
        )}
        <Button type="submit" color="primary" variant="contained">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default memo(FormComponent);
