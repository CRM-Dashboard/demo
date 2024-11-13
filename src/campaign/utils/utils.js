// src/utils/answerHandlers.js

export const handleInputChange = (prevAnswers, questionId, value) => ({
  ...prevAnswers,
  [questionId]: value,
});

export const handleCheckboxChange = (prevAnswers, questionId, option) => {
  const prevOptions = prevAnswers[questionId] || [];
  const newOptions = prevOptions.includes(option)
    ? prevOptions.filter((opt) => opt !== option)
    : [...prevOptions, option];
  return { ...prevAnswers, [questionId]: newOptions };
};
