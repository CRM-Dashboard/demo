import React from "react";
import { Grid, Typography } from "@mui/material";
import GlobalFunctions from "./../../utils/GlobalFunctions";
import { useSelector } from "react-redux";
import "./StatusCard.css";

const StatusCard = (props) => {
  const reducerData = useSelector((state) => state);
  const color = GlobalFunctions.getThemeBasedColour(
    reducerData.ThemeReducer.mode
  );
  return (
    <Grid className="status-card" style={{ height: "80%" }}>
      <Grid className="status-card__info" style={{ color: color }}>
        <h3 style={{ fontSize: "1.1rem" }}>{props.count}</h3>
        <span style={{ wordBreak: "break-all" }}>
          <Typography
            style={{ wordBreak: "break-all", fontSize: "0.6rem", color: color }}
          >
            {" "}
            {props.title}{" "}
          </Typography>
        </span>
      </Grid>
      <Grid className="status-card__icon">
        <h5>{props.icon}</h5>
      </Grid>
    </Grid>
  );
};

export default StatusCard;
