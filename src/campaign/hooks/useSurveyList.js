// src/hooks/useSurvey.js
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useSelector } from "react-redux";
// import { fetchSurveyQuestions } from "../api";

const useSurveyList = () => {
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);
  const [surveyList, setSurveyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSurveyList = async () => {
    try {
      const url = `/api/campaign/get-survey-list`;
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      const res = (
        await api.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
      setSurveyList(res);
    } catch (err) {
      setError("Failed to load survey questions");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getSurveyList();
  }, []);

  return { surveyList, loading, error };
};

export default useSurveyList;
