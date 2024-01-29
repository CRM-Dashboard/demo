const initialState = {
  allProjects: [],
};

const HomePageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ALL_PROJECTS":
      return {
        ...state,
        allProjects: action.payload,
      };
    case "RESET_ALL_DATA":
      return initialState;
    default:
      return state;
  }
};

export default HomePageReducer;
