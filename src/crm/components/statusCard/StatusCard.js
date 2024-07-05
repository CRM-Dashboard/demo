import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import "./StatusCard.css";

const StatusCard = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const reducerData = useSelector((state) => state);
  const themeMode = reducerData.ThemeReducer.mode;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const textColor =
    themeMode === "dark"
      ? isHovered
        ? "var(--txt-white)"
        : "#A9A9A9"
      : isHovered
      ? "var(--txt-white)"
      : "var(--txt-black)";

  return (
    <Grid
      className="status-card"
      style={{ height: "80%" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Grid className="status-card__info" style={{ color: textColor }}>
        <h3 style={{ fontSize: "1.1rem", color: textColor }}>{props.count}</h3>
        <span style={{ wordBreak: "break-all" }}>
          <Typography style={{ wordBreak: "break-all", fontSize: "0.6rem" }}>
            {props.title}
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
