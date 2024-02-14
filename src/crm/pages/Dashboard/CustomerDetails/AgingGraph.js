/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux/es/hooks/useSelector";
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

  function extractKeys(object) {
    return Object.keys(object)
      .filter((key) => key !== "orderId")
      .map((key) => key.replace(/_/g, "-"));
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
    await fetch(
      `http://115.124.113.252:8000/sap/bc/react/crm/aging?sap-client=250&projectId=${projectId}&sap-user=${userName}&sap-password=${passWord}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (OrderId) {
          const dataToSet = data.filter((obj) => obj.orderId === OrderId);
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

  const chartOptions = {
    series: [
      {
        name: "Customer Ageing",
        data: Object.values(sumObject),
      },
    ],
    options: {
      plotOptions: {
        pie: {
          dataLabels: {
            position: "top",
            offset: 0,
          },
        },
      },
      fill: {
        opacity: 0.7,
        type: "gradient",
      },
      chart: {
        id: "Apex-chart",
      },
      color: ["#6ab04c", "#2980b9"],
      title: {
        text: "Outstanding Ageing",
        fontFamily: "Futura, Arial, sans-serif",
        align: "left",
        color: "white",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: xAxisKeys,
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
