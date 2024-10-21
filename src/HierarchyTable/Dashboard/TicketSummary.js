/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, forwardRef } from "react";
import { Grid } from "@mui/material";
import MUIDataTable from "mui-datatables";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularScreenLoader from "../../crm/components/circularScreenLoader/CircularScreenLoader";

const TicketSummary = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const navigate = useNavigate();

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
        item.ticketDesc,
        item.category,
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
        item.assigned,
        item.fsedd,
        item.remark,
      ];
    });

    return modifiedResponse;
  };

  useEffect(() => {
    // getTableData();
    setLoading(true);
    setTableData(modifyResponse(props?.tableInfo?.dashTick));
    setChartData(props?.tableInfo?.dash[0]);
    setLoading(false);
  }, []);

  const options = {
    onRowClick: () => {
      navigate("/tracker/tickets");
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
      name: "Ticket Description",
    },
    {
      name: "Category",
    },
    {
      name: "Priority",
    },
    {
      name: "Assigned To",
    },
    {
      name: "Planned End Date",
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
    chartData?.tickOpPer,
    chartData?.tickWoPer,
    chartData?.tickClPer,
  ];

  const chartOptions = {
    chart: {
      type: "donut",
    },
    title: {
      text: "Overall Ticket Progress",
      align: "center",
      style: {
        fontSize: "15px",
        color: "#333",
        fontWeight: "none",
      },
    },
    labels: ["Open", "Working on it", "Close"],
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Done",
              formatter: () => `${chartData.tickClPer}%`,
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
          chartData?.tickOpCnt,
          chartData?.tickWoCnt,
          chartData?.taskStCnt,
          chartData?.tickClCnt,
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
                title={"Ticket Summary(Working on it)"}
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
            {!loading && chartData ? (
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
            ) : (
              <CircularScreenLoader />
            )}
          </Grid>
        ) : (
          <CircularScreenLoader />
        )}
      </Grid>
    </Grid>
  );
});
export default TicketSummary;
