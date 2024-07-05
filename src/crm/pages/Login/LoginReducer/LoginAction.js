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
const setAccessRoles = (data) => {
  return {
    type: "ACCESS_ROLES",
    payload: data,
  };
};

const exportDefault = {
  setUserName,
  setPassword,
  setAccessRoles,
  setLoggedInUserDetails,
};

export default exportDefault;
