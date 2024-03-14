/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Table from "mui-datatables";
import { Grid } from "@mui/material";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StatusCard from "../../../components/statusCard/StatusCard";

export default function ServiceRequest() {
  const [response, setResponse] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [percentages, setPercentages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusCounts, setStatusCounts] = useState({});

  const reducerData = useSelector((state) => state);
  const OrderId = reducerData.searchBar.orderId;
  const projectId = reducerData?.dashboard?.project?.projectId;

  const circleOpen = {
    series: [percentages?.Open ? percentages?.Open : 0],

    options: {
      chart: {
        height: 100,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "50%",
          },
          dataLabels: {
            showOn: "always",
            name: {
              show: false,
              color: "#888",
              fontSize: "13px",
            },
            value: {
              offsetY: -1,
              color: "#111",
              fontSize: "12px",
              show: true,
            },
          },
        },
      },
    },
  };

  const circleComplete = {
    series: [percentages?.Work_Completed ? percentages?.Work_Completed : 0],

    options: {
      chart: {
        height: 100,
        type: "radialBar",
      },
      fill: {
        colors: ["#1cbd00"],
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "50%",
          },
          dataLabels: {
            showOn: "always",
            name: {
              show: false,
              color: "#888",
              fontSize: "13px",
            },
            value: {
              offsetY: -1,
              color: "#111",
              fontSize: "12px",
              show: true,
            },
          },
        },
      },
    },
  };

  const circlePending = {
    series: [
      percentages?.Pending_Customer_Action
        ? percentages?.Pending_Customer_Action
        : 0,
    ],

    options: {
      chart: {
        height: 100,
        type: "radialBar",
      },
      fill: {
        colors: ["#fb0b12"],
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "50%",
          },

          dataLabels: {
            showOn: "always",
            name: {
              show: false,
              color: "#888",
              fontSize: "13px",
            },
            value: {
              offsetY: -1,
              color: "#111",
              fontSize: "12px",
              show: true,
            },
          },
        },
      },
    },
  };

  const circleWIP = {
    series: [percentages?.Work_In_Progress ? percentages?.Work_In_Progress : 0],

    options: {
      chart: {
        height: 100,
        type: "radialBar",
      },
      fill: {
        colors: ["#FFA500"],
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "50%",
          },

          dataLabels: {
            showOn: "always",
            name: {
              show: false,
              color: "#888",
              fontSize: "13px",
            },
            value: {
              offsetY: -1,
              color: "#111",
              fontSize: "12px",
              show: true,
            },
          },
        },
      },
    },
  };

  const circleNeedAttention = {
    series: [percentages?.Needs_Attention ? percentages?.Needs_Attention : 0],

    options: {
      chart: {
        height: 100,
        type: "radialBar",
      },
      fill: {
        colors: ["#fb0b12"],
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "50%",
          },

          dataLabels: {
            showOn: "always",
            name: {
              show: false,
              color: "#888",
              fontSize: "13px",
            },
            value: {
              offsetY: -1,
              color: "#111",
              fontSize: "12px",
              show: true,
            },
          },
        },
      },
    },
  };

  const circleClosed = {
    series: [percentages?.Closed ? percentages?.Closed : 0],

    options: {
      chart: {
        height: 100,
        type: "radialBar",
      },
      fill: {
        colors: ["#FFA500"],
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "50%",
          },

          dataLabels: {
            showOn: "always",
            name: {
              show: false,
              color: "#888",
              fontSize: "13px",
            },
            value: {
              offsetY: -1,
              color: "#111",
              fontSize: "12px",
              show: true,
            },
          },
        },
      },
    },
  };

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiIconButton: {
          styleOverrides: {
            root: {
              variant: "contained",
            },
          },
        },
        MuiSvgIcon: {
          styleOverrides: {
            root: {
              color: "Blue",
            },
          },
        },
        MUIDataTableToolbar: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiTablePagination: {
          styleOverrides: {
            selectLabel: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
            selectIcon: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
            displayedRows: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
            select: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            footer: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MUIDataTableHeadRow: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MUIDataTableHeadCell: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MUIDataTableBodyCell: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              paddingTop: 0,
              paddingBottom: 0,
              lineHeight: "2.2em",
            },
          },
        },
        MuiCheckbox: {
          styleOverrides: {
            root: {
              padding: 0,
            },
          },
        },
      },
    });

  const options = {
    selectableRows: "none",
    elevation: 0,
    print: true,
    download: true,
    search: true,
    viewColumns: true,
    filter: true,
  };

  const columns = [
    {
      name: "Email",
      label: "Email",
    },
    {
      name: "Customer Name",
      label: "Customer Name",
    },
    {
      name: "Unit",
      label: "Unit",
    },
    {
      name: "Content",
      label: "Content",
    },
    {
      name: "Status",
      label: "Status",
    },
    {
      name: "Project",
      label: "Project",
    },
  ];

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.userName,
        item?.userFName,
        item.buildingUnitTitle,
        item.content,
        item.statusTitle,
        item.projectTitle,
      ];
    });
    return modifiedResponse;
  };

  const countPercentage = (Data) => {
    // Count the occurrences of each statusTitle
    const statusCounts = {};

    Data.forEach((obj) => {
      const status = obj.statusTitle;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Calculate the total number of objects
    const totalObjects = Data.length;

    // Calculate the percentages
    const percentages = {};
    const counts = {};

    for (const status in statusCounts) {
      const count = statusCounts[status];
      counts[status] = count;
      const percentage = (count / totalObjects) * 100;
      percentages[status] = percentage.toFixed(2); // Round to 2 decimal places
    }
    const updatedObject = {};
    for (const key in percentages) {
      const updatedKey = key.replace(/\s+/g, "_");
      updatedObject[updatedKey] = percentages[key];
    }
    const updatedCounts = {};
    for (const key in counts) {
      const updatedKey = key.replace(/\s+/g, "_");
      updatedCounts[updatedKey] = counts[key];
    }

    setPercentages(updatedObject);
    setStatusCounts(updatedCounts);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    countPercentage(response);
  }, [response]);

  useEffect(() => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("projectId", projectId);
    fetch(`/api/reports/serviceRequest`, { method: "POST", body: formData })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const Data = data.data;
          if (OrderId) {
            const filteredData = Data.filter(
              (obj) => obj.salesOrderNumber === OrderId
            );

            setResponse(filteredData);
            setTableData(modifyResponse(filteredData));
          } else {
            setResponse(Data);
            setTableData(modifyResponse(Data));
          }
        } else {
          setIsLoading(false);
        }
      });
  }, [OrderId]);

  return (
    <>
      {!isLoading &&
      percentages &&
      statusCounts &&
      Object.keys(percentages)?.length > 0 &&
      Object.keys(statusCounts)?.length > 0 ? (
        <Grid style={{ marginTop: "1em" }}>
          <Grid
            container
            spacing={4}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: "2em",
              paddingTop: "2em",
            }}
          >
            <Grid item xs={2} sm={3} md={3}>
              <StatusCard
                icon={
                  <Chart
                    options={circleOpen.options}
                    series={circleOpen.series}
                    type="radialBar"
                    height={120}
                  />
                }
                count={statusCounts?.Open ? statusCounts?.Open : 0}
                title="Open Requests"
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <StatusCard
                icon={
                  <Chart
                    options={circleComplete.options}
                    series={circleComplete.series}
                    type="radialBar"
                    height={120}
                  />
                }
                count={
                  statusCounts?.Work_Completed
                    ? statusCounts?.Work_Completed
                    : 0
                }
                title="Completed Requests"
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <StatusCard
                icon={
                  <Chart
                    options={circlePending.options}
                    series={circlePending.series}
                    type="radialBar"
                    height={120}
                  />
                }
                count={
                  statusCounts?.Pending_Customer_Action
                    ? statusCounts?.Pending_Customer_Action
                    : 0
                }
                title="Pending Requests"
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <StatusCard
                icon={
                  <Chart
                    options={circleWIP.options}
                    series={circleWIP.series}
                    type="radialBar"
                    height={120}
                  />
                }
                count={
                  statusCounts?.Work_In_Progress
                    ? statusCounts?.Work_In_Progress
                    : 0
                }
                title="In Process Requests"
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={4}
            sx={{
              display: "flex",
              paddingBottom: "2em",
            }}
          >
            <Grid item xs={2} sm={3} md={3}>
              <StatusCard
                icon={
                  <Chart
                    options={circleNeedAttention.options}
                    series={circleNeedAttention.series}
                    type="radialBar"
                    height={120}
                  />
                }
                count={
                  statusCounts?.Needs_Attention
                    ? statusCounts?.Needs_Attention
                    : 0
                }
                title="Need Attention Requests"
              />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <StatusCard
                icon={
                  <Chart
                    options={circleClosed.options}
                    series={circleClosed.series}
                    type="radialBar"
                    height={120}
                  />
                }
                count={statusCounts?.Closed ? statusCounts?.Closed : 0}
                title="Closed Requests"
              />
            </Grid>
          </Grid>
          <ThemeProvider theme={() => getMuiTheme()}>
            <Table data={tableData} columns={columns} options={options}></Table>
          </ThemeProvider>
        </Grid>
      ) : (
        <CircularScreenLoader />
      )}
    </>
  );
}
