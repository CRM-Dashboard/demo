/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, forwardRef } from "react";
import { Grid } from "@mui/material";
import MUIDataTable from "mui-datatables";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularScreenLoader from "../../crm/components/circularScreenLoader/CircularScreenLoader";

const ChangeSummary = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const navigate = useNavigate();

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [item.ddtext, item.fsedd, item.assigned, item.typeTxt, item.notes];
    });

    return modifiedResponse;
  };

  useEffect(() => {
    setLoading(true);
    setTableData(modifyResponse(props?.tableInfo?.dashChg));
    setChartData(props?.tableInfo?.dash[0]);
    setLoading(false);
  }, []);

  const options = {
    onRowClick: () => {
      navigate("/tracker/changes");
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
      name: "Chanage Description",
    },
    {
      name: "Plan End",
    },
    { name: "Assigned" },
    { name: "Type" },
    { name: "Notes" },
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
    chartData?.chgOpPer,
    chartData?.chgWoPer,
    chartData?.chgStPer,
    chartData?.chgCoPer,
  ];

  const chartOptions = {
    chart: {
      type: "donut",
    },
    title: {
      text: "Overall Change Progress",
      align: "center",
      style: {
        fontSize: "15px",
        color: "#333",
        fontWeight: "none",
      },
    },
    labels: ["Open", "Working on it", "Stuck", "Complete"],
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Done",
              formatter: () => `${chartData.chgCoPer}%`,
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
          chartData?.chgOpCnt,
          chartData?.chgWoCnt,
          chartData?.chgStCnt,
          chartData?.chgCoCnt,
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
        {!loading ? (
          <ThemeProvider theme={() => getMuiTheme()}>
            <Grid
              sx={{
                margin: "0.8em",
                marginTop: "0.2em",
                marginLeft: "1.7em",
              }}
            >
              <MUIDataTable
                title={"Change Summary"}
                data={tableData}
                columns={columns}
                options={options}
              />
            </Grid>
          </ThemeProvider>
        ) : (
          <CircularScreenLoader />
        )}
      </Grid>
      <Grid item sm={4} md={4} lg={4}>
        {chartData && Object.keys(chartData).length > 0 ? (
          <Grid
            sx={{
              marginTop: "0.2em",
              marginRight: "1.5em",
              backgroundColor: "white",
              paddingBottom: "2em",
            }}
          >
            <Grid sx={{ paddingLeft: "2.5em", paddingTop: "1em" }}>
              {
                <ReactApexChart
                  options={chartOptions}
                  series={seriesData}
                  type="donut"
                  height={300}
                  width={350}
                />
              }
            </Grid>
          </Grid>
        ) : (
          <CircularScreenLoader />
        )}
      </Grid>
    </Grid>
  );
});
export default ChangeSummary;
