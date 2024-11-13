// src/components/Question.js
import React, { memo } from "react";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  createTheme,
  ThemeProvider,
} from "@mui/material";

// Define a custom theme for Question component
const questionTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Customize primary color here
    },
    secondary: {
      main: "#dc004e", // Customize secondary color here
    },
    background: {
      paper: "#f9f9f9",
    },
    text: {
      primary: "#333",
    },
    action: {
      hover: "#f5f5f5",
    },
  },
  shadows: ["none", "0px 4px 10px rgba(0, 0, 0, 0.1)"],
  typography: {
    h6: {
      fontSize: "1.1rem",
      fontWeight: 600,
    },
  },
});

const Question = ({ question, answer, onChange }) => {
  const renderInput = () => {
    switch (question.type) {
      case "text":
        return (
          <TextField
            fullWidth
            variant="outlined"
            label="Your Answer"
            value={answer || ""}
            onChange={(e) => onChange(question.questionId, e.target.value)}
            sx={{
              my: 2,
              backgroundColor: questionTheme.palette.background.paper,
            }}
          />
        );
      case "radio":
        return (
          <FormControl component="fieldset" sx={{ my: 2 }}>
            <RadioGroup
              value={answer || ""}
              onChange={(e) => onChange(question.questionId, e.target.value)}
            >
              {JSON.parse(question.options)?.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{
                    transition: "background-color 0.2s",
                    borderRadius: "4px",
                    ":hover": {
                      backgroundColor: questionTheme.palette.action.hover,
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      case "checkbox":
        return (
          <FormControl component="fieldset" sx={{ my: 2 }}>
            {JSON.parse(question.options)?.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={answer?.includes(option) || false}
                    onChange={(e) => {
                      // const newAnswer = e.target.checked
                      //   ? [...answer, option] // Add option if checked
                      //   : answer.filter((item) => item !== option); // Remove if unchecked
                      onChange(question.questionId, option);
                    }}
                    sx={{
                      transition: "background-color 0.2s",
                      borderRadius: "4px",
                      ":hover": {
                        backgroundColor: questionTheme.palette.action.hover,
                      },
                    }}
                  />
                }
                label={option}
              />
            ))}
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ThemeProvider theme={questionTheme}>
        <Box
          sx={{
            mb: 3,
            p: 3,
            boxShadow: questionTheme.shadows[1],
            borderRadius: "10px",
            border: `1px solid ${questionTheme.palette.divider}`,
            ":hover": {
              boxShadow: questionTheme.shadows[2],
            },
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: questionTheme.palette.text.primary,
            }}
          >
            {question?.questionText}
          </Typography>
          {renderInput()}
        </Box>
      </ThemeProvider>
    </>
  );
};

export default memo(Question);
