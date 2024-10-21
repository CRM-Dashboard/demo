import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const Usage = () => {
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
  );
};

export default Usage;
