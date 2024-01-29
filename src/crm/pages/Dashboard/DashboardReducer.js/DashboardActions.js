const getProjectId = () => {
  return {
    type: "PROJECT_ID",
  };
};

const setProjectId = (soa) => {
  return {
    type: "PROJECT_ID",
    payload: soa,
  };
};

const setShouldShowCustDetails = (data) => {
  return {
    type: "SHOW_CUSTOMER_DATA",
    payload: data,
  };
};

const setShouldShowTimeLine = (data) => {
  return {
    type: "SHOW_TIMELINE",
    payload: data,
  };
};

const setShowHappinessMeter = (data) => {
  return {
    type: "SHOW_HAPPINESS_METER",
    payload: data,
  };
};

const setShowSentimentAnalysis = (data) => {
  return {
    type: "SHOW_SENTIMENT_ANALYSIS",
    payload: data,
  };
};

const setCustomerContactNumber = (data) => {
  return {
    type: "CUST_CONTACT_NUMBER",
    payload: data,
  };
};

const setCustomerEmailID = (data) => {
  return {
    type: "CUST_EMAIL_ID",
    payload: data,
  };
};

const exportDefault = {
  getProjectId,
  setProjectId,
  setCustomerEmailID,
  setShowHappinessMeter,
  setShouldShowTimeLine,
  setShouldShowCustDetails,
  setShowSentimentAnalysis,
  setCustomerContactNumber,
};

export default exportDefault;
