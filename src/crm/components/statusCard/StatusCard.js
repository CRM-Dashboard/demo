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
      style={{ height: "90%" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Grid
        className="status-card__info"
        style={
          props.icon
            ? { color: textColor, textAlign: "left" }
            : { color: textColor, textAlign: "center", padding: "0.1em" }
        }
      >
        <h3 style={{ fontSize: "0.9rem", color: textColor }}>{props.count}</h3>
        <span style={{ wordBreak: "break-all" }}>
          <Typography style={{ wordBreak: "break-all", fontSize: "0.6rem" }}>
            {props.title}
          </Typography>
        </span>
      </Grid>
      {props.icon ? (
        <Grid className="status-card__icon">
          <h5>{props.icon}</h5>
        </Grid>
      ) : (
        <></>
      )}
    </Grid>
  );
};

export default StatusCard;
