// src/components/Survey.js
import React, { useState, useCallback } from "react";
import useSurvey from "../hooks/useSurvey";
import Question from "./Question";
import { useParams } from "react-router-dom";

import { handleCheckboxChange, handleInputChange } from "../utils/utils";
import { Grid } from "@mui/material";
import SurveyAccordion from "./SurveyAccordion";
import useSurveyList from "../hooks/useSurveyList";
import ErrorPage from "../../drawingManagement/components/ErrorPage";
import { ThreeDot } from "react-loading-indicators";
import usePostAnswers from "../hooks/usePostAnswers";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";

const Survey = () => {
  const { id } = useParams();
  const snackbar = UseCustomSnackbar();
  const { questions, loading, error, getQuestions } = useSurvey();
  const { surveyList } = useSurveyList();
  const { postAnswers, isLoading } = usePostAnswers();

  const [answers, setAnswers] = useState({});
  const [selectedSurvey, setSelectedSurvey] = useState("");

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
      surveyId: selectedSurvey[0],
      referenceId: id,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const transform = convertToResponseArray(answers);

      const res = await postAnswers(transform);
      console.log("res", res);

      if (res) {
        snackbar.showSuccess("Answers Posted Successfully");
        setAnswers({});
      }
    } catch (error) {
      snackbar.showError("Error Occured");
    }
  };

  const handleGetQuestionsList = () => {
    const surveyId = selectedSurvey[0] || ""; // Use the first selected project or an empty string

    if (!surveyId) return;

    getQuestions(surveyId);
  };
  // if (loading) return <ThreeDot />;
  if (error) return <ErrorPage />;

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
        {loading && <ThreeDot text="Data Is Loading...!!!" />}
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
            {/* <Button variant="contained" type="submit">
              Submit
            </Button> */}

            <LoadingButton
              // onClick={getTableData}
              type="submit"
              loading={isLoading}
              // disabled={}
              loadingPosition="start" // Position of loading spinner ('start', 'center', 'end')
              startIcon={<SaveIcon />}
              variant="contained"
              loadingIndicator=""
              style={{
                padding: "10px 20px",
                marginLeft: "10px", // Space between buttons
              }}
            >
              Submit
            </LoadingButton>
          </form>
        )}
      </Grid>
    </Grid>
  );
};

export default Survey;
