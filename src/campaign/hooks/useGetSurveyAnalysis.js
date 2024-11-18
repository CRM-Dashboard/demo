// src/hooks/useSurvey.js
import { useState, t } from "react";
import api from "../../services/api";
import { useSelector } from "react-redux";
// import { fetchSurveyQuestions } from "../api";

const useGetSurveyAnalysis = () => {
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAnalysis = async (surveyId) => {
    try {
      const url = `/api/campaign/get-survey-analysis`;
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("survey_id", surveyId);
      // const data = await fetchSurveyQuestions();
      setLoading(true);
      const res = (
        await api.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
      setAnalysis(res);
    } catch (err) {
      setError("Failed to load survey questions");
    } finally {
      setLoading(false);
    }
  };

  return { analysis, loading, error, getAnalysis };
};

export default useGetSurveyAnalysis;
