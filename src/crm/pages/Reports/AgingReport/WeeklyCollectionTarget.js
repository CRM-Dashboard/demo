/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./Style.css";
import dayjs from "dayjs";
import Table from "mui-datatables";
import { useSelector } from "react-redux";
import { Grid, MenuItem, Select, Button } from "@mui/material";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CrmDatePicker from "../../../components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";

export default function WeeklyCollectionTarget() {
  const [month, setMonth] = useState("");
  const [response, setResponse] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const crmId = reducerData?.dashboard?.crmId;
  const OrderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData.dashboard.project.projectId;

  const inputStyle = {
    margin: "0.5em",
    padding: "0.3em",
    fontSize: "13px",
    borderRadius: "10px",
    fontFamily: "futura",
    backgroundColor: "#f0f0f0",
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
              lineHeight: "1.5em",
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

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.CUST_NAME,
        item?.ARKTX,
        item?.BAL_VAL,
        item?.WEEK1,
        item?.WEEK2,
        item?.WEEK3,
        item?.WEEK4,
        item?.WEEK5,
        item?.CATEG,
        item?.SUB_CATEG,
        item?.ZZDEPT,
        item?.REMARKS,
        item?.VBELN,
      ];
    });
    return modifiedResponse;
  };

  function formatDate(dateString) {
    // Create a new Date object from the input date string
    const date = new Date(dateString);

    // Get the full year (e.g., 2021)
    const year = date.getFullYear();

    // Get the month (0-based index, so we add 1)
    // Pad the month with a leading zero if it's less than 10
    const month = String(date.getMonth() + 1).padStart(2, "0");

    // Combine year and month to form the desired output
    const formattedDate = `${year}${month}`;

    return formattedDate;
  }

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: OrderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: `${userName} Updated Weekly collection target report`,
      CHANGEIND: "U",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  function convertDateToMonthYear(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long" };

    return date.toLocaleDateString("en-US", options);
  }

  const updateCategoryByMonth = (categories, monthYear) => {
    return categories.map((category) => {
      if (category.CATEG.endsWith("of")) {
        return {
          ...category,
          CATEG: `${category.CATEG} ${monthYear}`,
        };
      }
      return category;
    });
  };

  async function saveData(data) {
    const formData = new FormData();
    console.log("###########month", month);
    const requestedMonth = formatDate(month);
    formData.append("month", requestedMonth);
    formData.append("crmId", crmId);
    formData.append("orderId", OrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("projectId", projectId);

    var apiUrl = process.env.REACT_APP_SERVER_URL + "/api/reports/saveAging";

    const finalData = data;
    formData.append("entryData", JSON.stringify(finalData));

    if (month) {
      fetch(apiUrl, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // setResponse(data[0]?.WEEK);
          // setDeptData(data[0].DEPARTMENT);
          // const selectedMonth = convertDateToMonthYear(month.$d);
          // const updatedCategory = updateCategoryByMonth(
          //   data[0].CATEGORY,
          //   selectedMonth
          // );
          // setCategoryData(updatedCategory);
          // setSubCategoryData(data[0].SUBCATEGORY);
          // setGraphData(modifyResponse(data[0]?.WEEK));

          saveLog();
          getData();
          setLoading(false);
          snackbar.showSuccess("Data saved Successfully!");
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      snackbar.showError("To get data please select month first!");
    }
  }

  async function getData() {
    const formData = new FormData();
    console.log("###########month", month);
    const requestedMonth = formatDate(month);
    formData.append("month", requestedMonth);
    formData.append("crmId", crmId);
    formData.append("orderId", OrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("projectId", projectId);

    var apiUrl = process.env.REACT_APP_SERVER_URL + "/api/reports/aging";

    // setLoading(true);
    if (month) {
      fetch(apiUrl, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setResponse(data[0]?.WEEK);
          setDeptData(data[0].DEPARTMENT);
          const selectedMonth = convertDateToMonthYear(month.$d);
          const updatedCategory = updateCategoryByMonth(
            data[0].CATEGORY,
            selectedMonth
          );
          setCategoryData(updatedCategory);
          setSubCategoryData(data[0].SUBCATEGORY);
          setGraphData(modifyResponse(data[0]?.WEEK));
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      snackbar.showError("To get data please select month first!");
    }
  }

  const handleCellEdit = (e, rowIndex, colIndex) => {
    const newData = graphData.map((row) => [...row]); // Deep copy of the array of arrays
    newData[rowIndex][colIndex] = e.target.value; // Update the specific cell
    setGraphData(newData);
  };

  const columns = [
    {
      name: "Name",
      options: {
        setCellProps: () => ({
          style: {
            position: "sticky",
            left: 0,
            zIndex: 1,
            background: "white",
            minWidth: "15em",
            maxWidth: "20em",
          },
        }),
      },
    },
    {
      name: "Unit",
      options: {
        setCellProps: () => ({
          style: {
            position: "sticky",
            left: 100,
            zIndex: 1,
            background: "white",
            minWidth: "15em",
            maxWidth: "20em",
          },
        }),
      },
    },
    {
      name: "Outstanding Amount",
      options: {
        setCellProps: () => ({
          style: {
            position: "sticky",
            left: 100,
            zIndex: 1,
            background: "white",
            minWidth: "15em",
            maxWidth: "20em",
          },
        }),
      },
    },
    {
      name: "Week 1",
      options: {
        customBodyRender: (value, tableMeta) => (
          <input
            type="text"
            value={value}
            style={inputStyle}
            onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 3)}
          />
        ),
      },
    },
    {
      name: "Week 2",
      options: {
        customBodyRender: (value, tableMeta) => (
          <input
            type="text"
            value={value}
            style={inputStyle}
            onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 4)}
          />
        ),
      },
    },
    {
      name: "Week 3",
      options: {
        customBodyRender: (value, tableMeta) => (
          <input
            type="text"
            value={value}
            style={inputStyle}
            onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 5)}
          />
        ),
      },
    },
    {
      name: "Week 4",
      options: {
        customBodyRender: (value, tableMeta) => (
          <input
            type="text"
            value={value}
            style={inputStyle}
            onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 6)}
          />
        ),
      },
    },
    {
      name: "Week 5",
      options: {
        customBodyRender: (value, tableMeta) => (
          <input
            type="text"
            value={value}
            style={inputStyle}
            onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 7)}
          />
        ),
      },
    },
    {
      name: "Category",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
                font: "-webkit-control",
                width: "30em",
              },
            }}
            id="Category"
            name="Category"
            value={value}
            onChange={(e) => {
              handleCellEdit(e, tableMeta.rowIndex, 8);
            }}
          >
            <MenuItem value=""> {"Select Category"} </MenuItem>
            {categoryData?.map((data) => {
              return <MenuItem value={data.CATEG}> {data.CATEG}</MenuItem>;
            })}
          </Select>
        ),
      },
    },
    {
      name: "Sub-Category",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
                font: "-webkit-control",
                width: "28em",
              },
            }}
            id="subCategory"
            name="subCategory"
            value={value}
            onChange={(e) => {
              handleCellEdit(e, tableMeta.rowIndex, 9);
            }}
          >
            <MenuItem value=""> {"Select Sub-Category"} </MenuItem>
            {subCategoryData?.map((data) => {
              return (
                <MenuItem value={data.SUB_CATEG}> {data.SUB_CATEG}</MenuItem>
              );
            })}
          </Select>
        ),
      },
    },
    {
      name: "Department",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
                font: "-webkit-control",
                width: "15em",
              },
            }}
            id="department"
            name="department"
            value={value}
            onChange={(e) => {
              handleCellEdit(e, tableMeta.rowIndex, 10);
            }}
          >
            <MenuItem value=""> {"Select Department"} </MenuItem>
            {deptData?.map((data) => {
              return <MenuItem value={data.DEPT}> {data.DEPT_TXT}</MenuItem>;
            })}
          </Select>
        ),
      },
    },
    {
      name: "Remarks",
      options: {
        customBodyRender: (value, tableMeta) => (
          <input
            type="text"
            value={value}
            style={inputStyle}
            onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 11)}
          />
        ),
      },
    },
  ];

  const saveWeeklyCollection = () => {
    const updatedData = response?.map((item, index) => {
      if (item.VBELN === graphData[index][12]) {
        return {
          ...item,
          CUST_NAME: graphData[index][0], // Update the fields based on the table columns
          ARKTX: graphData[index][1],
          BAL_VAL: graphData[index][2],
          WEEK1: graphData[index][3],
          WEEK2: graphData[index][4],
          WEEK3: graphData[index][5],
          WEEK4: graphData[index][6],
          WEEK5: graphData[index][7],
          CATEG: graphData[index][8],
          SUB_CATEG: graphData[index][9],
          ZZDEPT: graphData[index][10],
          REMARKS: graphData[index][11],
        };
      }
    });

    console.log("########### Updated Data:", updatedData);
    saveData(updatedData);
  };

  const options = {
    selectableRows: "none",
    elevation: 0,
    print: true,
    download: true,
    search: true,
    viewColumns: true,
    filter: true,
    pagination: false,
    responsive: "scrollMaxHeight",
    tableBodyHeight: "100vh",
    customToolbar: () => [
      <Button
        variant="contained"
        disableElevation
        disableFocusRipple
        size="small"
        sx={{
          marginLeft: "1em",
          "&.MuiButton-root": {
            textTransform: "none",
            backgroundColor: "#228B22",
            color: "white",
          },
        }}
        onClick={() => {
          saveWeeklyCollection();
          console.log("###########graphdata", graphData);
        }}
      >
        Save
      </Button>,
    ],
  };

  useEffect(() => {
    getData();
  }, [OrderId, projectId, crmId]);

  return (
    <Grid sx={{ paddingTop: "0.5em", overflowX: "auto" }}>
      {!loading ? (
        <ThemeProvider theme={getMuiTheme}>
          <Table
            data={graphData}
            columns={columns}
            options={options}
            title={
              <Grid
                container
                spacing={2}
                sx={{ marginTop: "0.5em", marginBottom: "0.5em" }}
              >
                <Grid item sm={6} md={6} lg={6}>
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
                <Grid item sm={6} md={6} lg={6}>
                  <button
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
                    onClick={() => {
                      getData();
                    }}
                  >
                    Go
                  </button>
                </Grid>
              </Grid>
            }
          ></Table>
        </ThemeProvider>
      ) : (
        <CircularScreenLoader />
      )}
    </Grid>
  );
}
