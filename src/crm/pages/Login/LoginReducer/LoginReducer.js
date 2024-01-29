const initialState = {
  userName: "",
  passWord: "",
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
    case "RESET_ALL_DATA":
      return initialState;
    default:
      return state;
  }
};

export default LoginReducer;
