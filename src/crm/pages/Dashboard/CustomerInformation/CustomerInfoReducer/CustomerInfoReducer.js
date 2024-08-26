const initialState = {
  custListSid: "",
};

const CustomerInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CUSTOMER_LIST_SID":
      return {
        ...state,
        custListSid: action.payload,
      };
    case "RESET_ALL_DATA":
      return initialState;
    default:
      return state;
  }
};

export default CustomerInfoReducer;
