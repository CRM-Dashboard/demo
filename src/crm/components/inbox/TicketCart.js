import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  createTheme,
  ThemeProvider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import StatusButton from "./StatusButton";
import InfoRow from "./InfoRow";
import TextArea from "./TextArea";

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif", // Set the desired font family
    fontSize: 14, // Base font size (default for body text)
    h1: {
      fontSize: "0.8rem", // Titles or headers
    },
    h2: {
      fontSize: "0.8rem",
    },
    body1: {
      fontSize: "0.8rem", // Main body text
    },
    button: {
      fontSize: "0.875rem", // Buttons
    },
  },
});

const TicketCart = ({
  ticketDetails,
  catLabel,
  selectedCate,
  handleCatChange,
  catOption,
  subCatOption,
  subCatLabel,
  selectedSubCat,
  handleSubCatChange,
  comment,
  setComment,
  handleComment,
  description,
  setDescription,
  handleDescription,
}) => {
  const {
    subject,
    priority,
    statTxt,
    createdDateTime,
    maktx,
    ernam,
    description: resDesc,
    comments: resComm,
  } = ticketDetails;

  console.log(catLabel, selectedCate, handleCatChange, catOption);

  useEffect(() => {
    if (resComm) {
      setComment(resComm);
    }
    if (resDesc) {
      setDescription(resDesc);
    }
  }, [resComm, resDesc]);

  // State variables

  const [subcategory, setSubcategory] = useState("");
  const [status, setStatus] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f0f4f8",
          padding: 2,
        }}
      >
        <Card
          sx={{
            maxWidth: 800,
            width: "100%",
            boxShadow: 6,
            borderRadius: 3,
            padding: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <CardContent>
            <Grid container spacing={3}>
              {/* Static Info */}
              <Grid item xs={12}>
                <InfoRow label="Title" value={subject} />
                <InfoRow label="Assigned To" value={ernam} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoRow label="Date" value={createdDateTime} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoRow label="Project" value={maktx} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoRow label="Priority" value={priority} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{catLabel}</InputLabel>
                  <Select
                    value={selectedCate}
                    onChange={handleCatChange}
                    label={catLabel}
                  >
                    {catOption?.length > 0 &&
                      catOption?.map((option) => (
                        <MenuItem key={option.typ} value={option.typ}>
                          {option.typTxt}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{subCatLabel}</InputLabel>
                  <Select
                    value={selectedSubCat}
                    onChange={handleSubCatChange}
                    label={subCatLabel}
                  >
                    {subCatOption?.length > 0 &&
                      subCatOption?.map((option) => (
                        <MenuItem
                          key={option.actSubtyp}
                          value={option.actSubtyp}
                        >
                          {option.actSubtypTxt}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextArea
                  label="Description"
                  value={description}
                  onChange={handleDescription}
                />
              </Grid>
              <Grid item xs={12}>
                <TextArea
                  label="Comments"
                  value={comment}
                  onChange={handleComment}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12}>
                <Typography
                  sx={{
                    textAlign: "center",
                    fontWeight: 500,
                    color: "#455A64",
                    marginTop: 2,
                  }}
                >
                  Current Status:{" "}
                  <span style={{ color: "#1E88E5", fontWeight: 600 }}>
                    {statTxt}
                  </span>
                </Typography>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={6}>
                <StatusButton
                  label="Complete"
                  variant="contained"
                  color="success"
                />
              </Grid>
              <Grid item xs={6}>
                <StatusButton
                  label="Customer Action Pending"
                  variant="outlined"
                  color="warning"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default TicketCart;
