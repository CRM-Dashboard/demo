import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import "./Battery.css";

const Battery = ({ percentage }) => {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="Battery">
      <div
        style={{
          width: "100px",
          position: "relative",
          justifyContent: "center",
        }}
      >
        <LinearProgress
          variant="determinate"
          value={clampedPercentage}
          color={clampedPercentage > 30 ? "primary" : "error"}
          sx={{
            height: "20px",
            borderRadius: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: clampedPercentage > 30 ? "#fff" : "#000",
            fontWeight: "bold",
          }}
        >
          {`${clampedPercentage}%`}
        </div>
      </div>
    </div>
  );
};

export default Battery;
