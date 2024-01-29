const initialState = {
  accountStatement: {},
  searchKey: "",
  orderId: "",
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
    case "RESET_ALL_DATA":
      return initialState;
    default:
      return state;
  }
};

export default SearchBarReducer;
