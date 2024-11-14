// src/hooks/useSurvey.js
import { useState, t } from "react";
import api from "../../services/api";
import { useSelector } from "react-redux";
// import { fetchSurveyQuestions } from "../api";

const useSurvey = () => {
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getQuestions = async (surveyId) => {
    try {
      const url = `/api/campaign/get-question-list`;
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("surveyId", surveyId);
      // const data = await fetchSurveyQuestions();
      setLoading(true);
      const res = (
        await api.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
      setQuestions(res);
    } catch (err) {
      setError("Failed to load survey questions");
    } finally {
      setLoading(false);
    }
  };

  return { questions, loading, error, getQuestions };
};

export default useSurvey;
