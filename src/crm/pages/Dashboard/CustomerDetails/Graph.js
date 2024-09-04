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
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData.dashboard.project.projectId;

  function extractYKeys(data) {
    return data?.map((item) => item.Amt);
  }

  const getData = () => {
    setLoading(true);
    const formData = new FormData();
    reducerData?.searchBar?.searchKey
      ? formData.append("vbeln", orderId)
      : formData.append("projectId", projectId);

    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/projectf3", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setYAxisKeys(extractYKeys(data));
        const apiPmtPoints = data?.map((item) => ({
          y: parseInt(item.cumF3),
          x: new Date(item.PostingDate),
        }));
        setYAxisKeys(apiPmtPoints);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [orderId]);

  const options = {
    animationEnabled: true,
    colorSet: "colorSet2",
    title: {
      fontSize: 15,
      fontWeight: "bold",
      horizontalAlign: "left",
      text: "Collection Trend",
      fontFamily: "Futura",
    },
    axisY: {
      title: "Y-axis Title",
      minimum: -100000000,
    },
    backgroundColor:
      reducerData.ThemeReducer.mode === "theme-mode-light" ||
      reducerData.ThemeReducer.mode === null
        ? "#ffffff"
        : "#2d2d2d",
    color: GlobalFunctions.getThemeBasedColour(reducerData.ThemeReducer.mode),
    charts: [
      {
        data: [
          {
            type: "splineArea",
            name: "F3 value",
            showInLegend: true,
            dataPoints: yAxisKeys,
            color: "#4D7AFF",
          },
        ],
      },
    ],
    // navigator: {
    //   slider: {
    //     minimum: new Date("2021-04-01"),
    //     maximum: new Date("2022-03-31"),
    //   },
    // },
  };
  const containerProps = {
    height: "180%",
    margin: "auto",
    backgroundColor: "#fafafb",
    borderRadius: "0.8em",
    color: GlobalFunctions.getThemeBasedColour(reducerData.ThemeReducer.mode),
  };
  return !loading ? (
    <CanvasJSStockChart
      options={options}
      containerProps={containerProps}
      onRef={(ref) => (stockChartRef.current = ref)}
      type="splineArea"
      sx={{ borderRadius: "0.8em" }}
    />
  ) : (
    <CircularScreenLoader />
  );
}

export default Graph;
