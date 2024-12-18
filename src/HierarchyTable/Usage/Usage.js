import React, { useState, useEffect } from "react";
import { Grid, Button } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CrmDatePicker from "../../crm/components/crmDatePicker/CrmDatePicker";
import dayjs from "dayjs";
import ThreeDot from "../../components/ThreeDot";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const Usage = () => {
  const [month, setMonth] = useState("");
  const [hubData, setHubData] = useState([]);
  const [topData, setTopData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTableBodyCell: {
          styleOverrides: {
            root: {
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
        MuiTableCell: {
          styleOverrides: {
            root: {
              padding: "7px",
            },
          },
        },
      },
    });

  const modifyHubResponse = (expenseData) => {
    const DataForTable = expenseData?.map((item) => {
      const isPositive = item?.percentChange > 0;

      return [
        item?.object,
        item?.count,
        item?.preCount,
        <span
          style={{
            color: isPositive ? "green" : "red",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "2px",
          }}
        >
          {item?.percentChange}
          {isPositive ? (
            <ArrowUpwardIcon fontSize="15px" />
          ) : (
            <ArrowDownwardIcon fontSize="15px" />
          )}
        </span>,
      ];
    });
    return DataForTable;
  };

  function formatDateToYearMonth(dateObj) {
    if (
      !dateObj ||
      typeof dateObj.$y !== "number" ||
      typeof dateObj.$M !== "number"
    ) {
      throw new Error("Invalid date object");
    }

    const year = dateObj.$y;
    const month = String(dateObj.$M + 1).padStart(2, "0"); // Months are 0-indexed, so add 1 and pad with zero
    return `${year}${month}`;
  }
  const modifyTopResponse = (expenseData) => {
    const DataForTable = expenseData?.map((item) => {
      return [item?.username, item?.count];
    });
    return DataForTable;
  };

  const getTableData = async () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("month", formatDateToYearMonth(month));

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/activity/getProjectTrackerWithMonth`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setHubData(modifyHubResponse(data[0].hub));
      setTopData(modifyTopResponse(data[0].top));
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columnsHub = [
    {
      name: "Activity Perform",
    },
    {
      name: "Count",
    },
    {
      name: "Previous Month",
    },
    {
      name: "%Change",
    },
  ];

  const columnsTop = [
    {
      name: "Top Ten Users",
    },
    {
      name: "Count",
    },
  ];

  const options = {
    // expandableRows: true,
    pagination: false,
    print: false,
    download: false,
    search: false,
    filter: false,
    viewColumns: false,
    selectableRows: "none",
  };

  if (isLoading) {
    return <ThreeDot />;
  }

  return (
    <>
      <Grid
        container
        spacing={1}
        sx={{
          marginTop: "0.5em",
          marginBottom: "0.5em",
        }}
      >
        <Grid item sm={2} md={2} lg={3}>
          <CrmDatePicker
            id="month"
            name="month"
            label="Month"
            format="MMMM YYYY"
            views={["month", "year"]}
            value={dayjs(month)}
            onChange={(value) => {
              // const formattedDate = value
              //   ? dayjs(value).format("YYYY-MM-DD")
              //   : "";
              setMonth(value);
            }}
          />
        </Grid>
        <Grid item sm={2} md={2} lg={2}>
          <Button
            disabled={!month}
            onClick={() => {
              getTableData();
            }}
            variant="contained"
            size="large"
          >
            Go
          </Button>
        </Grid>
      </Grid>
      <Grid container columns={12} spacing={1}>
        <Grid item sx={6} sm={6} md={6} lg={6}>
          {hubData?.length > 0 && (
            <ThemeProvider theme={() => getMuiTheme()}>
              <MUIDataTable
                title={"Gera Hub Usage"}
                data={hubData}
                style={{ width: "100%" }}
                columns={columnsHub}
                options={options}
              />
            </ThemeProvider>
          )}
        </Grid>
        <Grid item sx={6} sm={6} md={6} lg={6}>
          {hubData?.length > 0 && (
            <ThemeProvider theme={() => getMuiTheme()}>
              <MUIDataTable
                data={topData}
                style={{ width: "100%" }}
                columns={columnsTop}
                options={options}
              />
            </ThemeProvider>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Usage;
