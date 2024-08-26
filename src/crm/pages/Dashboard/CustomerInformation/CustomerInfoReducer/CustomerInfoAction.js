const setCustomerInfoSid = (sid) => {
  return {
    type: "CUSTOMER_LIST_SID",
    payload: sid,
  };
};

const exportDefault = {
  setCustomerInfoSid,
};

export default exportDefault;
