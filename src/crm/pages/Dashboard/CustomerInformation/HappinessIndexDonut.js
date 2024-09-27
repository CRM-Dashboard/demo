/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import GaugeChart from "react-gauge-chart";
import { Typography, Grid } from "@mui/material";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import dashboardActions from "../DashboardReducer.js/DashboardActions";
import "./HappinessIndexDonut.css";

const HappinessIndexDonut = ({
  circleUp,
  customerDetails,
  searchValueAvailable,
}) => {
  const [custData, setCustData] = useState([]);
  const [happyIndex, setHappyIndex] = useState("");
  // const [showSentimentalAnalysis, setShowSentimentalAnalysis] = useState(false);
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
          setCustData(data[0].customerdata);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [OrderId]);

  // useEffect(() => {
  //   if (reducerData?.dashboard?.shouldShowSentimentAnalysis) {
  //     setShowSentimentalAnalysis(true);
  //   }
  // }, [reducerData?.dashboard?.shouldShowSentimentAnalysis]);

  const calculateAverageEmotions = (EmotionData) => {
    // calculateEmotionPercentages(EmotionData);
    const emotionSum = EmotionData?.reduce(
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
    const emotionCount = EmotionData?.length;
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

    // setEmotionAverages(emotionAverages);

    dispatch(dashboardActions.setShowSentimentAnalysis(true));
    // setShowSentimentalAnalysis(true);
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
      // setShowSentimentalAnalysis(true);
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

  // const ChartOptions = {
  //   series: [
  //     {
  //       data: [
  //         {
  //           x: "Anger",
  //           y: parseFloat(emotionAverages.anger).toFixed(2),
  //         },
  //         {
  //           x: "Fear",
  //           y: parseFloat(emotionAverages.fear).toFixed(2),
  //         },
  //         {
  //           x: "Joy",
  //           y: parseFloat(emotionAverages.joy).toFixed(2),
  //         },
  //         {
  //           x: "Neutral",
  //           y: parseFloat(emotionAverages.neutral).toFixed(2),
  //         },
  //         {
  //           x: "Sad",
  //           y: parseFloat(emotionAverages.sadness).toFixed(2),
  //         },
  //         {
  //           x: "surprise",
  //           y: parseFloat(emotionAverages.surprise).toFixed(2),
  //         },
  //       ],
  //     },
  //   ],
  //   // series: [
  //   //   emotionAverages.anger,
  //   //   emotionAverages.fear,
  //   //   emotionAverages.joy,
  //   //   emotionAverages.neutral,
  //   //   emotionAverages.sadness,
  //   //   emotionAverages.surprise,
  //   // ],
  //   options: {
  //     chart: {
  //       type: "bar",
  //     },
  //     grid: {
  //       show: false,
  //     },
  //     plotOptions: {
  //       bar: {
  //         horizontal: true,
  //         distributed: true, // Distribute the gradient evenly across bars
  //         gradientColor: [
  //           "#e83e8c",
  //           "#20c997",
  //           "#6c757d",
  //           "#343a40",
  //           "#ffc0cb",
  //           "#ff7f0e",
  //           "#2ecc71",
  //           "#3498db",
  //         ],
  //       },
  //     },
  //     // responsive: [
  //     //   {
  //     //     breakpoint: 480,
  //     //     options: {
  //     //       chart: {
  //     //         // width: 50,
  //     //       },
  //     //     },
  //     //   },
  //     // ],
  //     labels: ["Anger", "Fear", "Joy", "Neutral", "Sadness", "Surprise"],
  //   },
  // };

  const shouldShowHappinessIndex = () => {
    return emotionAverages && happyIndex > 0;
  };

  return (
    <>
      {
        <Grid>
          {shouldShowHappinessIndex() && (
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid
                container
                direction="column"
                className="circular-img-container"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
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
                    width="100"
                    percent={happyIndex / 100}
                    style={{ height: "8rem", width: "90%" }}
                  />
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      }
    </>
  );
};

export default HappinessIndexDonut;
