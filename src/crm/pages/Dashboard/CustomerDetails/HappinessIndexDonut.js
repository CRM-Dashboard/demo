/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import GaugeChart from "react-gauge-chart";
import { Typography, Grid } from "@mui/material";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import StatusCard from "../../../components/statusCard/StatusCard";
import dashboardActions from "../DashboardReducer.js/DashboardActions";
import Chart from "react-apexcharts";
import "./CustomerDetails.css";

const HappinessIndexDonut = ({
  circleUp,
  customerDetails,
  searchValueAvailable,
}) => {
  const [custData, setCustData] = useState([]);
  const [happyIndex, setHappyIndex] = useState("");
  const [showSentimentalAnalysis, setShowSentimentalAnalysis] = useState(false);
  // const [emotionalPercentage, setEmotionPercentages] = useState({
  //   anger: 0,
  //   fear: 0,
  //   joy: 0,
  //   neutral: 0,
  //   sadness: 0,
  //   surprise: 0,
  // });
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
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const fetchData = async () => {
    if (projectId) {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("projectId", projectId);
      fetch(process.env.REACT_APP_SERVER_URL + `/api/dashboard/customer`, {
        method: "POST",
        body: formData,
      })
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
    console.log("emotionAverages", emotionAverages);
    setEmotionAverages(emotionAverages);

    dispatch(dashboardActions.setShowSentimentAnalysis(true));
    setShowSentimentalAnalysis(true);
  };

  const calculateEmotionPercentages = (data) => {
    console.log("data", data);
    return data?.map((emotionObject) => {
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
      console.log("percentages", percentages);
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
    console.log("averagePercentage.toFixed(2)", averagePercentage.toFixed(2));
    setHappyIndex(averagePercentage.toFixed(2));
    dispatch(dashboardActions.setShowHappinessMeter(true));
  };

  useEffect(() => {
    if (OrderId) {
      var selectedCust = custData?.filter((cust) => cust.orderId === OrderId);
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
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 400,
            },
          },
        },
      ],
      labels: ["Anger", "Fear", "Joy", "Neutral", "Sadness", "Surprise"],
    },
  };

  const shouldShowHappinessIndex = () => {
    return (
      showSentimentalAnalysis &&
      emotionAverages &&
      happyIndex > 0 &&
      emotionAverages
    );
  };

  return (
    <>
      {
        <>
          <Grid
            item
            xs={2}
            sm={2}
            md={2}
            sx={{
              marginRight: "1em",
              marginBottom: "2em",
              "&.MuiGrid-item": {
                paddingTop: "0em",
                paddingLeft: "0em",
              },
            }}
          >
            {shouldShowHappinessIndex() ? (
              <Grid
                className=" circular-img-container"
                style={{ paddingTop: "1em" }}
              >
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
                    style={{ height: "100px", width: "70%" }}
                  />
                )}
              </Grid>
            ) : (
              <Grid style={{ paddingTop: "8em" }} />
            )}
            <Grid sx={{ marginTop: "2em" }}>
              <StatusCard
                icon={
                  <Chart
                    options={circleUp.options}
                    series={circleUp.series}
                    type="radialBar"
                    height={110}
                  />
                }
                count={
                  searchValueAvailable
                    ? "₹" + customerDetails.PossessionBalance
                    : "₹" + customerDetails?.UpcomingAmount + "Cr"
                }
                title="Balance till possession (Unbilled)"
              />
            </Grid>
          </Grid>
          {shouldShowHappinessIndex() && (
            <Grid
              item
              xs={2}
              sm={2}
              md={2}
              sx={{
                // marginRight: "1em",
                // marginBottom: "2em",
                "&.MuiGrid-item": {
                  // paddingTop: "1em",
                  paddingLeft: "0em",
                },
              }}
            >
              <Typography style={{ color: mode, marginLeft: "2em" }}>
                Sentiment Analysis{" "}
              </Typography>
              <Chart
                className="circular-donut"
                options={ChartOptions.options}
                series={ChartOptions.series}
                style={{ width: "350px" }}
                type="donut"
              />
            </Grid>
          )}
        </>
      }
    </>
  );
};

export default HappinessIndexDonut;
