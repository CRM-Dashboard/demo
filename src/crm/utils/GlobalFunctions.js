const getThemeBasedColour = (theme) => {
  const color = theme === "theme-mode-dark" ? "#A9A9A9" : "#454141";
  return color;
};

const getThemeBasedTextColour = (theme) => {
  const textColor = theme === "theme-mode-dark" ? "white" : "black";
  return textColor;
};

const getThemeBasedMode = (theme) => {
  const mode = theme === "theme-mode-dark" ? "#202020" : "white";
  return mode;
};

const getThemeBasedDatailsColour = (theme) => {
  const color = theme === "theme-mode-dark" ? "#A9A9A9" : "black";
  return color;
};

const getChangedValues = (initialValues, latestValues) => {
  const changedValues = {};
  for (let key in latestValues) {
    if (latestValues[key] !== initialValues[key]) {
      changedValues[key] = latestValues[key];
    }
  }
  return changedValues;
};

const saveLog = (userName, passWord, entryData, callBack) => {
  const formData = new FormData();
  formData.append("userName", userName);
  formData.append("passWord", passWord);
  formData.append("entryData", JSON.stringify(entryData));

  const apiUrl = process.env.REACT_APP_SERVER_URL + "/api/logger/saveLog";

  fetch(apiUrl, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        callBack && callBack(data);
        return data;
      }
    })
    .catch((error) => {
      if (error) {
        callBack && callBack(error);
        return error;
      }
    });
};

const exportDefault = {
  saveLog,
  getChangedValues,
  getThemeBasedMode,
  getThemeBasedColour,
  getThemeBasedTextColour,
  getThemeBasedDatailsColour,
};

export default exportDefault;
