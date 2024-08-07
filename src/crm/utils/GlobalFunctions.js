const getThemeBasedColour = (theme) => {
  const color = theme === "theme-mode-dark" ? "#A9A9A9" : "#454141";
  return color;
};

const getThemeBasedStatusCardTitleColour = (theme) => {
  const color = theme === "theme-mode-dark" ? "#454141" : "#A9A9A9";
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

const allowAccessByRoles = (roles, name) => {
  return roles.some((obj) => obj.agrName === name);
};

// function formatToIndianNumber(numStr) {
//   // Remove existing commas
//   const numParts = numStr?.split(".");
//   let intPart = numParts?.[0]?.replace(/,/g, "");
//   const decimalPart = numParts?.length > 1 ? "." + numParts?.[1] : "";

//   // Split the integer part into parts of 3 digits and remaining digits
//   const lastThreeDigits = intPart?.slice(-3);
//   const otherDigits = intPart?.slice(0, -3);

//   // Add commas to the remaining digits every two digits
//   const formattedOtherDigits = otherDigits?.replace(
//     /\B(?=(\d{2})+(?!\d))/g,
//     ","
//   );

//   // Combine formatted parts
//   const formattedIntPart = otherDigits
//     ? formattedOtherDigits + "," + lastThreeDigits
//     : lastThreeDigits;

//   return formattedIntPart + decimalPart;
// }

function formatToIndianNumber(numStr) {
  // Remove existing commas
  let numStrWithoutCommas = numStr?.replace(/,/g, "");

  // Parse the input string as a number and round it off
  let num = parseFloat(numStrWithoutCommas);
  if (isNaN(num)) {
    return ""; // Return an empty string if the input is not a valid number
  }
  num = Math.round(num);

  // Convert the rounded number back to a string
  const roundedNumStr = num.toString();

  // Split the integer part into parts of 3 digits and remaining digits
  const lastThreeDigits = roundedNumStr.slice(-3);
  const otherDigits = roundedNumStr.slice(0, -3);

  // Add commas to the remaining digits every two digits
  const formattedOtherDigits = otherDigits?.replace(
    /\B(?=(\d{2})+(?!\d))/g,
    ","
  );

  // Combine formatted parts
  const formattedIntPart = otherDigits
    ? formattedOtherDigits + "," + lastThreeDigits
    : lastThreeDigits;

  return formattedIntPart;
}

function getFormatedNumber(num) {
  // Round the number to the nearest integer
  const roundedNum = Math.round(num);

  // Convert the rounded number to a string
  const roundedNumStr = roundedNum.toString();

  // Split the integer part into parts of 3 digits and remaining digits
  const lastThreeDigits = roundedNumStr.slice(-3);
  const otherDigits = roundedNumStr.slice(0, -3);

  // Add commas to the remaining digits every two digits
  const formattedOtherDigits = otherDigits.replace(
    /\B(?=(\d{2})+(?!\d))/g,
    ","
  );

  // Combine formatted parts
  const formattedIntPart = otherDigits
    ? formattedOtherDigits + "," + lastThreeDigits
    : lastThreeDigits;

  return formattedIntPart;
}

function getRoundOffNumber(number) {
  return Math.round(number);
}

function checkUndefined(number) {
  return number !== undefined ? number : 0;
}

const exportDefault = {
  saveLog,
  checkUndefined,
  getChangedValues,
  getRoundOffNumber,
  getThemeBasedMode,
  getFormatedNumber,
  allowAccessByRoles,
  getThemeBasedColour,
  formatToIndianNumber,
  getThemeBasedTextColour,
  getThemeBasedDatailsColour,
  getThemeBasedStatusCardTitleColour,
};

export default exportDefault;
