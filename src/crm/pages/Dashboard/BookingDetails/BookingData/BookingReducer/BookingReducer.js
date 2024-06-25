const initialState = {
  BookingsDetailsFilter: {
    Registration_status: [],
    Confirmation_status: [],
    Possession_status: [],
    Property_type: "",
    Building: "",
    Unit_Number: "",
  },
};

const BookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BOOKING_DETAILS_FILTER":
      return {
        ...state,
        BookingsDetailsFilter: action.payload,
      };

    case "RESET_ALL_DATA":
      return initialState;
    default:
      return state;
  }
};

export default BookingReducer;
