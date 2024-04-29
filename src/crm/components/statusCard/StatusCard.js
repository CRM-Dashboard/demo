import React from "react";
import { Typography } from "@mui/material";
import "./StatusCard.css";

const StatusCard = (props) => {
  // const mode = GlobalFunctions.getThemeBasedDatailsColour(
  //   reducerData.ThemeReducer.mode
  // );
  return (
    <div className="status-card">
      <div className="status-card__info">
        <h3>{props.count}</h3>
        <span style={{ wordBreak: "break-all" }}>
          <Typography style={{ wordBreak: "break-all", fontSize: "0.8em" }}>
            {" "}
            {props.title}{" "}
          </Typography>
        </span>
      </div>
      <div className="status-card__icon">
        <h5>{props.icon}</h5>
      </div>
    </div>
  );
};

export default StatusCard;
