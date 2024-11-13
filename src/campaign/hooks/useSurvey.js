// src/hooks/useSurvey.js
import { useState, useEffect } from "react";
// import { fetchSurveyQuestions } from "../api";

const useSurvey = () => {
  const [questions, setQuestions] = useState([
    {
      mandt: "250",
      surveyId: "0000000001",
      questionId: 1,
      questionText:
        "How easy was it for you to reach out to the CRM team when you needed assistance or had questions?",
      type: "radio",
      options:
        '["Very Easy", "Easy", "Neutral", "Difficult", "Very Difficult"]',
      conditions: "null",
      required: "true",
      analysis: "Ease of getting in touch with the CRM team when needed",
    },
    {
      mandt: "250",
      surveyId: "0000000001",
      questionId: 2,
      questionText:
        "How satisfied are you with the response time from the CRM team to your inquiries or concerns? Did they respond in a timely manne",
      type: "radio",
      options:
        '["Very Timely", "Timely", "Neutral", "Delayed", "Very Delayed"]',
      conditions: "null",
      required: "true",
      analysis: "Timeliness of responses from the CRM team",
    },
    {
      mandt: "250",
      surveyId: "0000000001",
      questionId: 3,
      questionText:
        "How would you rate the professionalism and courtesy of the CRM team members you interacted with?",
      type: "radio",
      options: '["Excellent", "Good", "Fair", "Poor", "Very Poor"]',
      conditions: "null",
      required: "true",
      analysis: "Professionalism and courtesy of the CRM team members",
    },
    {
      mandt: "250",
      surveyId: "0000000001",
      questionId: 4,
      questionText:
        "Has your RM taken the time to explain the advantages of our referral program and any loyalty benefits that you may be eligible f",
      type: "radio",
      options:
        '["Yes, it was explained", "Yes, but the explanation was unclear", "No, it was not explained"]',
      conditions: "null",
      required: "true",
      analysis:
        "Explain the benefits of our referral program and loyalty benefits",
    },
    {
      mandt: "250",
      surveyId: "0000000001",
      questionId: 5,
      questionText:
        "How would you rate the CRM team’s knowledge and expertise in resolving your issue or answering your questions? Did they demonstr",
      type: "radio",
      options: '["Excellent", "Good", "Fair", "Poor", "Very Poor"]',
      conditions: "null",
      required: "true",
      analysis:
        "Knowledge and ability of the CRM team to resolve your issue or inquiry",
    },
    {
      mandt: "250",
      surveyId: "0000000001",
      questionId: 6,
      questionText:
        "How satisfied are you with the overall service you received from our CRM team throughout your experience with us?",
      type: "radio",
      options:
        '["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]',
      conditions: "null",
      required: "true",
      analysis: "Overall satisfaction with your experience with the CRM team",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const data = await fetchSurveyQuestions();
        setQuestions(questions);
      } catch (err) {
        setError("Failed to load survey questions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { questions, loading, error };
};

export default useSurvey;
