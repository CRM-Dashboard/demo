/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, forwardRef } from "react";
import MUIDataTable from "mui-datatables";
import ReactApexChart from "react-apexcharts";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularScreenLoader from "../../crm/components/circularScreenLoader/CircularScreenLoader";
import CircularProgressWithLabel from "../../crm/components/CircularProgressWithLabel/circularProgressWithLabel";

const ProjectSummary = forwardRef((props, ref) => {
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const navigate = useNavigate();

  const getStageColor = (status) => {
    switch (status) {
      case "1":
        return "#D8BFD8";
      case "2":
        return "#DDA0DD";
      case "3":
        return "#EE82EE";
      case "4":
        return "#662d91";
      case "5":
        return "#720e9e";
      case "6":
        return "#800080";
      default:
        return "inherit";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "LOW":
        return "#89CFF0";
      case "MEDIUM":
        return "#0066b2";
      case "HIGH":
        return "#0000FF";
      default:
        return "inherit";
    }
  };

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item.categTxt,
        item.projectName,
        <input
          value={item.priority}
          style={{
            height: "2em",
            width: "8em",
            borderRadius: "0.3em",
            fontSize: "0.7rem",
            textAlign: "center",
            backgroundColor: getPriorityColor(item.priority),
            color: "white",
          }}
        />,
        <input
          value={item.stageTxt}
          style={{
            height: "2em",
            width: "15em",
            borderRadius: "0.3em",
            fontSize: "0.7rem",
            textAlign: "center",
            backgroundColor: getStageColor(item.stage),
            color: "white",
          }}
        />,
        <CircularProgressWithLabel value={item?.progress} />,
        item?.fsedd,
        item.remark,
      ];
    });

    return modifiedResponse;
  };

  useEffect(() => {
    setChartData(props?.tableInfo?.dash[0]);
    setTableData(modifyResponse(props?.tableInfo?.dashProj));
  }, []);

  const options = {
    // expandableRows: true,
    onRowClick: () => {
      navigate("/tracker/project");
    },
    selectableRows: "none",
    pagination: false,
    print: false,
    download: false,
    search: false,
    filter: false,
    viewColumns: false,
    hideToolbar: true,
    tableBodyHeight: "250px", // Adjust height as needed
    stickyHeader: true,
    columnOptions: {
      display: "false",
    },
  };

  const columns = [
    {
      name: "Category",
    },
    {
      name: "Name",
    },
    {
      name: "Priority",
    },
    {
      name: "Stage",
    },
    { name: "Progress" },
    {
      name: "Plan End",
    },
    { name: "Remarks" },
  ];

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTableBodyCell: {
          styleOverrides: {
            root: {
              paddingTop: "0.2em",
              paddingBottom: "0.2em",
              fontSize: "0.7rem",
            },
          },
        },
        MUIDataTableHeadCell: {
          styleOverrides: {
            data: {
              fontSize: "0.8rem",
              fontWeight: "bold",
            },
          },
        },
      },
    });

  const seriesData = [
    chartData?.projNsPer,
    chartData?.projCanPer,
    chartData?.projStPer,
    chartData?.projWoPer,
    chartData?.projDoPer,
  ];

  const chartOptions = {
    chart: {
      type: "donut",
    },
    title: {
      text: "Overall Project Progress",
      align: "center",
      style: {
        fontSize: "15px",
        color: "#333",
        fontWeight: "none",
      },
    },
    labels: ["Not Started", "Cancelled", "Stuck", "Working on it", "Done"],
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Done",
              formatter: () => `${chartData.projDoPer}%`,
              color: "#000",
              fontSize: "24px",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return `${val.toFixed(1)}%`;
      },
    },
    legend: {
      position: "bottom",
      markers: {
        width: 0,
      },
      formatter: function (label, opts) {
        const counts = [
          chartData?.projNsCnt,
          chartData?.projCanCnt,
          chartData?.projStCnt,
          chartData?.projWoCnt,
          chartData?.projDoCnt,
        ];
        const count = counts[opts.seriesIndex];
        const color = opts.w.config.colors[opts.seriesIndex];
        // return `<span style="text-align: center; font-weight: bold; color: ${color};">${count}</span> <br/>${label}`;
        return `
        <div style="text-align: center;">
          <span style="font-weight: bold; color: ${color}; font-size: 14px;">${count}</span>
          <br/>
          <span>${label}</span>
        </div>`;
      },
    },
    colors: ["#FF4560", "#775DD0", "#FEB019", "#00E396", "#008FFB"], // Customize colors as needed
  };

  return (
    <Grid container columns={12}>
      <Grid item sm={8} md={8} lg={8}>
        <ThemeProvider theme={() => getMuiTheme()}>
          <Grid
            sx={{
              margin: "0.8em",
              marginLeft: "1.7em",
            }}
          >
            <MUIDataTable
              title={"Project Summary"}
              data={tableData}
              columns={columns}
              options={options}
            />
          </Grid>
        </ThemeProvider>
      </Grid>
      <Grid item sm={4} md={4} lg={4}>
        {chartData && Object.keys(chartData).length > 0 ? (
          <Grid
            sx={{
              marginTop: "1em",
              marginRight: "1.5em",
              backgroundColor: "white",
              paddingBottom: "2em",
              boxShadow:
                "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14),,0px 1px 10px 0px rgba(0,0,0,0.12)",
            }}
          >
            <Grid sx={{ paddingLeft: "2.5em", paddingTop: "1em" }}>
              {chartOptions && chartData && (
                <ReactApexChart
                  options={chartOptions}
                  series={seriesData}
                  type="donut"
                  height={300}
                  width={350}
                />
              )}
            </Grid>
          </Grid>
        ) : (
          <CircularScreenLoader />
        )}
      </Grid>
    </Grid>
  );
});

export default ProjectSummary;
