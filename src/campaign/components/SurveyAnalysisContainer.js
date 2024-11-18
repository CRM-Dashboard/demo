import React, { useState, useCallback } from "react";
import useSurveyList from "../hooks/useSurveyList";
import { Grid } from "@mui/material";
import SurveyAccordion from "./SurveyAccordion";
import useGetSurveyAnalysis from "../hooks/useGetSurveyAnalysis";
import SurveyAnalysis from "./SurveyAnalysis";
// import { surveyData } from "./Testing";
// import useCustomQuery from "../hooks/useCustomQuery";
// import api from "../../services/api";
// import { useQuery } from "@tanstack/react-query";
// import { useSelector } from "react-redux";

// const fetchSurveyAnalysis = async ({ queryKey }) => {
//   const [, userName, passWord] = queryKey; // Destructure parameters from queryKey

//   const url = `/api/campaign/get-question-list`;
//   const formData = new FormData();
//   formData.append("userName", userName);
//   formData.append("passWord", passWord);
//   formData.append("surveyId", "0000000001");

//   try {
//     const res = (
//       await api.post(url, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//     ).data;

//     return res; // Return the response data
//   } catch (error) {
//     console.error("Error fetching survey analysis:", error);
//     throw new Error(
//       error?.response?.data?.message || "Failed to fetch survey analysis"
//     );
//   }
// };

const SurveyAnalysisContainer = () => {
  //   const passWord = useSelector((state) => state.LoginReducer.passWord);
  //   const userName = useSelector((state) => state.LoginReducer.userName);

  const { surveyList } = useSurveyList();
  const [selectedSurvey, setSelectedSurvey] = useState("");
  const { analysis, getAnalysis, loading, error } = useGetSurveyAnalysis();

  //   const { data, error, isLoading, isError } = useQuery({
  //     queryKey: ["surveyAnalysis", userName, passWord],
  //     queryFn: fetchSurveyAnalysis,
  //     enabled: !!userName && !!passWord,
  //     retry: 1, // Number of retry attempts on failure
  //     staleTime: 5 * 60 * 1000,
  //   });
  //   console.log(data, error, isLoading, isError, "useQuery");

  const handleSurveySelection = useCallback((event) => {
    const value = event.target.value;
    setSelectedSurvey(typeof value === "string" ? value.split(",") : value);
  }, []);

  const handleGetSurveyAnalysis = () => {
    const surveyId = selectedSurvey[0] || ""; // Use the first selected project or an empty string

    if (!surveyId) return;

    getAnalysis(surveyId);
  };
  return (
    <>
      <Grid container gap={2} sx={{}}>
        <Grid item sm={12} md={12} xs={12} xl={12}>
          <SurveyAccordion
            selectedSurvey={selectedSurvey}
            surveyData={surveyList || []}
            //   loading={loading}
            getTableData={handleGetSurveyAnalysis}
            handleSurveySelection={handleSurveySelection}
          />
        </Grid>

        <Grid item sm={12} md={12} xs={12} xl={12}>
          {analysis && <SurveyAnalysis surveyData={analysis} />}
        </Grid>
      </Grid>
    </>
  );
};

export default SurveyAnalysisContainer;
