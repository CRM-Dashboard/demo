const getThemeBasedColour = (theme) => {
  const color = theme === "theme-mode-dark" ? "#A9A9A9" : "gray";
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

const exportDefault = {
  getThemeBasedColour,
  getThemeBasedTextColour,
  getThemeBasedMode,
  getThemeBasedDatailsColour,
};

export default exportDefault;
