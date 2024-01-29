const initialState = {
  project: {},
  customerContactNo: "",
  shouldShowCustData: false,
  shouldShowTimeLine: false,
  shouldHappinessMeter: false,
  shouldSentimentAnalysis: false,
  customerEmailId: "",
};

const DashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PROJECT_ID":
      return {
        ...state,
        project: action.payload,
      };
    case "SHOW_CUSTOMER_DATA":
      return {
        ...state,
        shouldShowCustData: action.payload,
      };
    case "SHOW_TIMELINE":
      return {
        ...state,
        shouldShowTimeLine: action.payload,
      };
    case "SHOW_HAPPINESS_METER":
      return {
        ...state,
        shouldShowHappinessMeter: action.payload,
      };
    case "SHOW_SENTIMENT_ANALYSIS":
      return {
        ...state,
        shouldShowSentimentAnalysis: action.payload,
      };
    case "CUST_CONTACT_NUMBER":
      return {
        ...state,
        customerContactNo: action.payload,
      };
    case "CUST_EMAIL_ID":
      return {
        ...state,
        customerEmailId: action.payload,
      };
    case "RESET_ALL_DATA":
      return initialState;
    default:
      return state;
  }
};

export default DashboardReducer;
