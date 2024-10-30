const initialState = {
  selectedDrawing: {},
};

const drawingDashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SELECTEDDRAWING":
      return {
        ...state,
        selectedDrawing: action.payload,
      };

    case "RESET_ALL_DATA":
      return initialState;
    default:
      return state;
  }
};
export default drawingDashboardReducer;
