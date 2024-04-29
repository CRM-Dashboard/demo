const setUserName = (data) => {
  return {
    type: "USERNAME",
    payload: data,
  };
};
const setPassword = (data) => {
  return {
    type: "PASSWORD",
    payload: data,
  };
};
const setLoggedInUserDetails = (data) => {
  return {
    type: "LOGGED_IN_USER",
    payload: data,
  };
};

const exportDefault = {
  setUserName,
  setPassword,
  setLoggedInUserDetails,
};

export default exportDefault;
