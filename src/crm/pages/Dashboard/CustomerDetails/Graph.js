/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-stockcharts";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";

var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

function Graph() {
  const stockChartRef = useRef(null);
  const [yAxisKeys, setYAxisKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData.dashboard.project.projectId;

  function extractYKeys(data) {
    return data.map((item) => item.Amt);
  }

  useEffect(() => {
    setLoading(true);
    fetch(
      `http://115.124.113.252:8000/sap/bc/react/crm/projectf3?sap-client=250&projectId=${projectId}&sap-user=${userName}&sap-password=${passWord}`
    )
      .then((response) => response.json())
      .then((data) => {
        setYAxisKeys(extractYKeys(data));
        const apiPmtPoints = data.map((item) => ({
          y: parseFloat(item.cumF3),
          x: new Date(item.PostingDate),
        }));
        setYAxisKeys(apiPmtPoints);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const options = {
    animationEnabled: true,
    colorSet: "colorSet2",
    title: {
      text: "Collection Trend",
      fontFamily: "Futura",
    },
    axisY: {
      title: "Y-axis Title",
      minimum: -100000000,
    },
    backgroundColor:
      reducerData.ThemeReducer.mode === "theme-mode-light"
        ? "#f0f0f0"
        : "#202020",

    color: GlobalFunctions.getThemeBasedColour(reducerData.ThemeReducer.mode),
    charts: [
      {
        data: [
          {
            type: "splineArea",
            name: "Invoice Value",
            showInLegend: true,
            dataPoints: yAxisKeys,
            color: "#4D7AFF",
          },
        ],
      },
    ],
    navigator: {
      slider: {
        minimum: new Date("2021-04-01"),
        maximum: new Date("2022-03-31"),
      },
    },
  };
  const containerProps = {
    width: "44em",
    height: "180%",
    margin: "auto",
    backgroundColor: "#fafafb",
    color: GlobalFunctions.getThemeBasedColour(reducerData.ThemeReducer.mode),
  };
  return !loading ? (
    <CanvasJSStockChart
      options={options}
      containerProps={containerProps}
      onRef={(ref) => (stockChartRef.current = ref)}
      type="splineArea"
    />
  ) : (
    <CircularScreenLoader />
  );
}

export default Graph;
