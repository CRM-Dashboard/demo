import React, { useState, useEffect } from "react";
import { Grid, Button } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CrmDatePicker from "../../crm/components/crmDatePicker/CrmDatePicker";
import dayjs from "dayjs";

const Usage = () => {
  const [month, setMonth] = useState("");
  const [hubData, setHubData] = useState([]);
  const [topData, setTopData] = useState([]);

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
      return [item?.object, item?.count];
    });
    return DataForTable;
  };

  const modifyTopResponse = (expenseData) => {
    const DataForTable = expenseData?.map((item) => {
      return [item?.username, item?.count];
    });
    return DataForTable;
  };

  const getTableData = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/activity/getProjectTracker`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setHubData(modifyHubResponse(data[0].hub));
        setTopData(modifyTopResponse(data[0].top));
      });
  };

  useEffect(() => {
    getTableData();
  }, []);

  const columnsHub = [
    {
      name: "Activity Perform",
    },
    {
      name: "Count",
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
            style={{
              backgroundColor: "#007FFF",
              fontFamily: "futura",
              borderRadius: "5px",
              fontSize: "15px",
              color: "white",
              marginTop: "0.2em",
              height: "2.2em",
              width: "4.5em",
            }}
            // sx={ selectedProjects?.toString()?.trim()?.length === 0 ? {} : {}}
            // disabled={
            //   selectedProjects?.toString()?.trim()?.length === 0
            // }
            // onClick={() => {
            //   getData();
            // }}
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
