/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import GlobalFunctions from "./../../../utils/GlobalFunctions";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";

export default function AgingBar() {
  const [xAxisKeys, setXAxisKeys] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoad, setDataLoad] = useState(false);

  const reducerData = useSelector((state) => state);
  const OrderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData.dashboard.project.projectId;

  const navigate = useNavigate();

  function extractKeys(object) {
    return Object.keys(object)
      .filter((key) => key !== "orderId")
      .map((key) => {
        const replacedKey = key.replace(/^bal_/, "").replace(/_/g, "-");
        return replacedKey === "180" ? ">180" : replacedKey;
      });
  }

  const sumObject = graphData.reduce((sum, obj) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (key !== "orderId") {
        sum[key] = (sum[key] || 0) + value;
      }
    });
    return sum;
  }, {});

  async function getData() {
    setLoading(true);

    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/aging", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (OrderId) {
          const dataToSet = data?.filter((obj) => obj.orderId === OrderId);
          setGraphData(dataToSet);
        } else {
          setGraphData(data);
        }

        setXAxisKeys(extractKeys(data[0]));
        setLoading(false);
        setDataLoad(true);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getData();
  }, [projectId]);

  const handleClick = () => {
    navigate(`/crm/crm/agingReport`);
  };

  const chartOptions = {
    series: [
      {
        name: "Customer Ageing",
        data: Object.values(sumObject),
      },
    ],
    options: {
      plotOptions: {
        onclick: () => handleClick(),
        pie: {
          dataLabels: {
            position: "top",
            offset: 0,
          },
        },
        bar: {
          distributed: true, // Distribute the gradient evenly across bars
          gradientColor: [
            "#e83e8c",
            "#20c997",
            "#6c757d",
            "#343a40",
            "#ffc0cb",
            "#ff7f0e",
            "#2ecc71",
            "#3498db",
          ],
        },
      },
      fill: {
        opacity: 0.7,
        type: "gradient",
      },
      chart: {
        id: "Apex-chart",
        events: {
          dataPointSelection: handleClick,
        },
      },
      style: {
        colors: [
          GlobalFunctions.getThemeBasedColour(reducerData.ThemeReducer.mode),
        ], // Change the color of all text to dark gray (#333)
      },
      title: {
        fontSize: 15,
        horizontalAlign: "left",
        text: "Outstanding Ageing",
        fontFamily: "Futura",
        color: GlobalFunctions.getThemeBasedColour(
          reducerData.ThemeReducer.mode
        ),
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: xAxisKeys,
        labels: {
          style: {
            colors: GlobalFunctions.getThemeBasedColour(
              reducerData.ThemeReducer.mode
            ),
          },
        },
      },
      legend: {
        position: "top",
      },
      grid: {
        show: false,
      },
      yaxis: {
        min: 0,
        max: 10000000,

        labels: {
          style: {
            colors: GlobalFunctions.getThemeBasedColour(
              reducerData.ThemeReducer.mode
            ),
          },
          formatter: function (val) {
            // Use Intl.NumberFormat to format the number without decimal places
            return new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 0,
            }).format(val);
          },
        },
      },
    },
  };

  return !loading &&
    dataLoad &&
    chartOptions.options &&
    chartOptions.series.length > 0 ? (
    <Chart
      options={chartOptions.options}
      series={chartOptions.series}
      type="bar"
      height="180%"
    />
  ) : (
    <CircularScreenLoader />
  );
}
