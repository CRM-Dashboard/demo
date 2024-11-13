// src/components/Survey.js
import React, { useState } from "react";
import useSurvey from "../hooks/useSurvey";
import Question from "./Question";

import { handleCheckboxChange, handleInputChange } from "../utils/utils";
import { Button, Grid } from "@mui/material";

const Survey = () => {
  const { questions, loading, error } = useSurvey();
  const [answers, setAnswers] = useState({});

  const handleChange = (questionId, value) => {
    if (Array.isArray(value)) {
      setAnswers((prevAnswers) =>
        handleCheckboxChange(prevAnswers, questionId, value)
      );
    } else {
      setAnswers((prevAnswers) =>
        handleInputChange(prevAnswers, questionId, value)
      );
    }
  };

  const convertToResponseArray = (obj) => {
    return Object.keys(obj).map((key) => ({
      questionId: key,
      response: obj[key],
      surveyId: "",
      referenceId: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const transform = convertToResponseArray(answers);
    console.log("Survey Responses:", transform);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Grid sx={{}}>
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <Question
            key={question.questionId}
            question={question}
            answer={answers[question.questionId]}
            onChange={handleChange}
          />
        ))}
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </Grid>
  );
};

export default Survey;
