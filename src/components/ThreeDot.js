import React from "react";
import { ThreeDot } from "react-loading-indicators";
const ThreeDotLoading = ({
  color = "#62B4FF",
  size = "medium",
  text = "Loading....",
  textColor = "#62B4FF",
}) => {
  return (
    <>
      <ThreeDot color={color} size={size} text={text} textColor={textColor} />
    </>
  );
};

export default ThreeDotLoading;
