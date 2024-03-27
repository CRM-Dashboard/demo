const initialState = {
  accountStatement: {},
  searchKey: "",
  orderId: "",
  sid: "",
  activityData: "",
};

const SearchBarReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ACCOUNT_STATEMENT":
      return {
        ...state,
        accountStatement: action.payload,
      };
    case "SEARCH_KEY":
      return {
        ...state,
        searchKey: action.payload,
      };
    case "ORDER_ID":
      return {
        ...state,
        orderId: action.payload,
      };
    case "S_ID":
      return {
        ...state,
        sid: action.payload,
      };
    case "ACTIVITY_DATA":
      return {
        ...state,
        activityData: action.payload,
      };
    case "RESET_ALL_DATA":
      return initialState;
    default:
      return state;
  }
};

export default SearchBarReducer;
