/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import GaugeChart from "react-gauge-chart";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import dashboardActions from "../DashboardReducer.js/DashboardActions";
import Chart from "react-apexcharts";
import "./CustomerDetails.css";

const HappinessIndexDonut = () => {
  const [custData, setCustData] = useState([]);
  const [happyIndex, setHappyIndex] = useState("");
  const [showSentimentalAnalysis, setShowSentimentalAnalysis] = useState(false);
  const [emotionAverages, setEmotionAverages] = useState({
    anger: 0,
    fear: 0,
    joy: 0,
    neutral: 0,
    sadness: 0,
    surprise: 0,
  });

  const dispatch = useDispatch();
  const reducerData = useSelector((state) => state);
  var OrderId = reducerData?.searchBar?.orderId;
  const projectId = reducerData?.dashboard?.project?.projectId;
  const mode = GlobalFunctions.getThemeBasedDatailsColour(
    reducerData.ThemeReducer.mode
  );

  const fetchData = async () => {
    if (projectId) {
      fetch(`/sap/bc/react/crm/customer?sap-client=250&projectId=${projectId}`)
        .then((response) => response.json())
        .then((data) => {
          setCustData(data);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [OrderId]);

  useEffect(() => {
    if (reducerData?.dashboard?.shouldShowSentimentAnalysis) {
      setShowSentimentalAnalysis(true);
    }
  }, [reducerData?.dashboard?.shouldShowSentimentAnalysis]);

  const calculateAverageEmotions = (EmotionData) => {
    // calculateEmotionPercentages(EmotionData);
    const emotionSum = EmotionData.reduce(
      (sum, emotionObject) => {
        return {
          anger: sum.anger + emotionObject.anger,
          fear: sum.fear + emotionObject.fear,
          joy: sum.joy + emotionObject.joy,
          neutral: sum.neutral + emotionObject.neutral,
          sadness: sum.sadness + emotionObject.sadness,
          surprise: sum.surprise + emotionObject.surprise,
        };
      },
      {
        anger: 0,
        fear: 0,
        joy: 0,
        neutral: 0,
        sadness: 0,
        surprise: 0,
      }
    );

    // Calculate the average of each emotion
    const emotionCount = EmotionData.length;
    const emotionAverages = {
      anger: emotionSum.anger / emotionCount,
      fear: emotionSum.fear / emotionCount,
      joy: emotionSum.joy / emotionCount,
      neutral: emotionSum.neutral / emotionCount,
      sadness: emotionSum.sadness / emotionCount,
      surprise: emotionSum.surprise / emotionCount,
    };
    console.log("########emotionAverages", emotionAverages);
    setEmotionAverages(emotionAverages);

    dispatch(dashboardActions.setShowSentimentAnalysis(true));
    setShowSentimentalAnalysis(true);
  };

  const calculateEmotionPercentages = (data) => {
    console.log("#############data", data);
    return data.map((emotionObject) => {
      const emotions = {
        anger: emotionObject.anger,
        fear: emotionObject.fear,
        joy: emotionObject.joy,
        neutral: emotionObject.neutral,
        sadness: emotionObject.sadness,
        surprise: emotionObject.surprise,
      };

      const total = Object.values(emotions).reduce(
        (acc, value) => acc + value,
        0
      );

      const percentages = {};
      for (const emotion in emotions) {
        percentages[emotion] = ((emotions[emotion] / total) * 100).toFixed(2);
      }
      console.log("####percentages", percentages);
      // setEmotionPercentages(percentages);
      setShowSentimentalAnalysis(true);
    });
  };

  const calculateHappyIndex = (customerData) => {
    let sum = 0;
    // const maxValue = 100; // Assuming "happyIndex" is a percentage out of 100

    for (let i = 0; i < customerData.length; i++) {
      sum += customerData[i].happyIndex;
    }

    const averagePercentage = sum / customerData.length;
    setHappyIndex(averagePercentage.toFixed(2));
    dispatch(dashboardActions.setShowHappinessMeter(true));
  };

  useEffect(() => {
    if (OrderId) {
      var selectedCust = custData.filter((cust) => cust.orderId === OrderId);
      calculateAverageEmotions(selectedCust);
      calculateEmotionPercentages(selectedCust);
      calculateHappyIndex(selectedCust);
    } else {
      calculateAverageEmotions(custData);
      calculateEmotionPercentages(custData);
      calculateHappyIndex(custData);
    }
  }, [custData]);

  const ChartOptions = {
    series: [
      emotionAverages.anger,
      emotionAverages.fear,
      emotionAverages.joy,
      emotionAverages.neutral,
      emotionAverages.sadness,
      emotionAverages.surprise,
    ],
    options: {
      chart: {
        type: "donut",
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          options: {
            chart: {
              type: "donut",
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      labels: ["Anger", "Fear", "Joy", "Neutral", "Sadness", "Surprise"],
    },
  };

  return (
    <>
      {showSentimentalAnalysis &&
        emotionAverages &&
        happyIndex > 0 &&
        emotionAverages && (
          <>
            <div className="col-2 circular-img-container ">
              <Typography style={{ color: mode }}>
                Sentiment Analysis{" "}
              </Typography>
              <Chart
                className="circular-donut"
                options={ChartOptions.options}
                series={ChartOptions.series}
                style={{ height: "310px", width: "210px" }}
                type="donut"
              />
            </div>
            <div className=" col-2 circular-img-container">
              <Typography style={{ color: mode }}>Happiness Meter</Typography>
              {happyIndex > 0 && (
                <GaugeChart
                  className="circular-donut pt-4"
                  colors={["red", "green"]}
                  nrOfLevels={20}
                  arcPadding={0.02}
                  arcWidth={0.3}
                  textColor="#666"
                  needleColor="#333"
                  width="10"
                  percent={happyIndex / 100}
                  style={{ height: "200px", width: "100%" }}
                />
              )}
            </div>
          </>
        )}
    </>
  );
};

export default HappinessIndexDonut;
