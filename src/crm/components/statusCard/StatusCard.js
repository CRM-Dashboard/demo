import React from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import "./StatusCard.css";
import GlobalFunctions from "../../utils/GlobalFunctions";

const StatusCard = (props) => {
  const reducerData = useSelector((state) => state);
  const mode = GlobalFunctions.getThemeBasedDatailsColour(
    reducerData.ThemeReducer.mode
  );
  return (
    <div className="status-card">
      <div className="status-card__info">
        <h5 style={{ color: mode }}>{props.count}</h5>
        <span style={{ color: mode }}>{props.title}</span>
      </div>
      <div className="status-card__icon">
        <h5 style={{ color: mode }}>{props.icon}</h5>
      </div>
    </div>
  );
};

export default StatusCard;
