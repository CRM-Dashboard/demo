const initialState = {
  userName: "",
  passWord: "",
  loggedInUser: {},
};

const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USERNAME":
      return {
        ...state,
        userName: action.payload,
      };
    case "PASSWORD":
      return {
        ...state,
        passWord: action.payload,
      };
    case "LOGGED_IN_USER":
      return {
        ...state,
        loggedInUser: action.payload,
      };
    case "RESET_ALL_DATA":
      return initialState;
    default:
      return state;
  }
};

export default LoginReducer;
