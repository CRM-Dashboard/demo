import React, { useState } from "react";
import { Button } from "@mui/material";
import * as Yup from "yup";
import CustomDialog from "./CustomDialog";
import FormComponent from "./FormComponent";

// Validation Schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  age: Yup.number()
    .required("Age is required")
    .min(1, "Age must be greater than 0")
    .max(100, "Age must be less than or equal to 100"),
});

const Testing = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleFormSubmit = (data) => {
    console.log("Form Data Submitted:", data);
    handleCloseDialog();
  };

  const formFields = [
    { label: "Name", name: "name", type: "text", defaultValue: "" },
    { label: "Email", name: "email", type: "email", defaultValue: "" },
    {
      label: "Birth Date",
      name: "birthDate",
      type: "date",
      defaultValue: null,
    },
    {
      label: "Gender",
      name: "gender",
      type: "select",
      defaultValue: "",
      options: [
        { value: "", label: "Select Gender" },
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
    },
  ];

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Open Form Dialog
      </Button>

      <FormComponent
        formFields={formFields}
        onSubmit={handleFormSubmit}
        onCancel={handleCloseDialog}
        validationSchema={validationSchema}
      />

      <CustomDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title="Dynamic Form Dialog"
        content={
          <FormComponent
            formFields={formFields}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseDialog}
            validationSchema={validationSchema}
          />
        }
      />
    </div>
  );
};

export default Testing;
