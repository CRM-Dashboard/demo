// src/components/Survey.js
import React, { useState, useCallback } from "react";
import useSurvey from "../hooks/useSurvey";
import Question from "./Question";

import { handleCheckboxChange, handleInputChange } from "../utils/utils";
import { Button, Grid } from "@mui/material";
import SurveyAccordion from "./SurveyAccordion";
import useSurveyList from "../hooks/useSurveyList";

const Survey = () => {
  const { questions, loading, error, getQuestions } = useSurvey();
  const [answers, setAnswers] = useState({});
  const [selectedSurvey, setSelectedSurvey] = useState("");
  const { surveyList } = useSurveyList();

  const handleSurveySelection = useCallback((event) => {
    const value = event.target.value;
    setSelectedSurvey(typeof value === "string" ? value.split(",") : value);
  }, []);

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

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error}</p>;

  const handleGetQuestionsList = () => {
    const surveyId = selectedSurvey[0] || ""; // Use the first selected project or an empty string

    if (!surveyId) return;

    getQuestions(surveyId);
  };

  return (
    <Grid container gap={2} sx={{}}>
      <Grid item sm={12} md={12} xs={12} xl={12}>
        <SurveyAccordion
          selectedSurvey={selectedSurvey}
          surveyData={surveyList || []}
          loading={loading}
          getTableData={handleGetQuestionsList}
          handleSurveySelection={handleSurveySelection}
        />
      </Grid>

      <Grid item sm={12} md={12} xs={12} xl={12}>
        {" "}
        {questions.length > 0 && (
          <form onSubmit={handleSubmit}>
            {questions?.map((question) => (
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
        )}
      </Grid>
    </Grid>
  );
};

export default Survey;
