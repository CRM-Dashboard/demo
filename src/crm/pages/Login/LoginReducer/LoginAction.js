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

const exportDefault = {
  setUserName,
  setPassword,
};

export default exportDefault;
