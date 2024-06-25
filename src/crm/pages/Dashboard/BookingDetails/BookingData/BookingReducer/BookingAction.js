const setBookingDetailsFilter = (data) => {
  return {
    type: "BOOKING_DETAILS_FILTER",
    payload: data,
  };
};

const exportDefault = {
  setBookingDetailsFilter,
};

export default exportDefault;
