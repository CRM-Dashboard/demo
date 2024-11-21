// src/components/Survey.js
import React, { useState, useCallback } from "react";
import useSurvey from "../hooks/useSurvey";
import Question from "./Question";
import { useParams } from "react-router-dom";

import { handleCheckboxChange, handleInputChange } from "../utils/utils";
import { Grid } from "@mui/material";
import SurveyAccordion from "./SurveyAccordion";
import useSurveyList from "../hooks/useSurveyList";
import { ThreeDot } from "react-loading-indicators";
import usePostAnswers from "../hooks/usePostAnswers";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";
import api from "../../services/api";
import { useSelector } from "react-redux";

const Survey = () => {
  const { id } = useParams();
  const snackbar = UseCustomSnackbar();
  const { questions, loading, error, getQuestions } = useSurvey();
  const { surveyList } = useSurveyList();
  const { postAnswers, isLoading } = usePostAnswers();
  const [errors, setErrors] = useState({});
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);
  const [isSurveychecking, setIsSurveychecking] = useState(false);

  const [answers, setAnswers] = useState({});
  const [selectedSurvey, setSelectedSurvey] = useState("");

  const handleSurveySelection = useCallback((event) => {
    const value = event.target.value;
    setSelectedSurvey(typeof value === "string" ? value.split(",") : value);
  }, []);

  const handleChange = (questionId, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [questionId]: false,
    }));
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
      const newErrors = {};

      questions.forEach((question) => {
        if (question.required && !answers[question.questionId]) {
          newErrors[question.questionId] = true;
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        const transform = convertToResponseArray(answers);

        const res = await postAnswers(transform);
        if (res) {
          snackbar.showSuccess("Answers Posted Successfully");
          setAnswers({});
        }
      }
    } catch (error) {
      snackbar.showError("Error Occured");
    }
  };

  const handleGetQuestionsList = async () => {
    const surveyId = selectedSurvey[0] || ""; // Use the first selected project or an empty string

    if (!surveyId) return;

    const res = await checkSurveyIsCompleted();

    if (res.length > 0) {
      snackbar.showInfo("Survey is already completed...");
      return;
    }

    getQuestions(surveyId);
  };

  const checkSurveyIsCompleted = async () => {
    try {
      const url = "/api/campaign/check-survey-is-completed";
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("surveyId", selectedSurvey[0]);
      formData.append("referenceId", id);
      setIsSurveychecking(true);
      const res = (await api.post(url, formData)).data;
      return res;
    } catch (error) {
      return error;
    } finally {
      setIsSurveychecking(false);
    }
  };

  return (
    <Grid container gap={2} sx={{}}>
      <Grid item sm={12} md={12} xs={12} xl={12}>
        <SurveyAccordion
          selectedSurvey={selectedSurvey}
          surveyData={surveyList || []}
          loading={loading || isSurveychecking}
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
              <div key={question.questionId}>
                <Question
                  question={question}
                  answer={answers[question.questionId]}
                  onChange={handleChange}
                  hasRequired={errors[question.questionId]}
                />
              </div>
            ))}

            <LoadingButton
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
