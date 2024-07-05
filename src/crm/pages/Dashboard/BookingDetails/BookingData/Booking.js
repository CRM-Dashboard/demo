/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import Table from "mui-datatables";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { debounce } from "lodash";
import GlobalFunctions from "../../../../utils/GlobalFunctions";
import searchbarActions from "./../../../SearchBar/SearchBarReducer/SearchBarActions";
import DashboardAction from "./../../../Dashboard/DashboardReducer.js/DashboardActions";
import CircularScreenLoader from "./../../../../components/circularScreenLoader/CircularScreenLoader";

export default function Booking({ tableDetails, response, getFilteredData }) {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData?.dashboard?.project?.projectId;

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiIconButton: {
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
              backgroundColor: "#62b4ff",
              color: "white",
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
              lineHeight: "1.3em",
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
    rowsPerPage: 100,
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
      name: "Building",
    },
    {
      name: "Flat Number",
    },
    {
      name: "Customer Name",
    },
    {
      name: "Consideration Value",
    },
    {
      name: "GST",
    },
    {
      name: "GST %",
    },
    {
      name: "Admin Charges",
    },
    {
      name: "Admin Charges GST",
    },
    {
      name: "Admin Charges GST %",
    },
    {
      name: "All Inclusive Value",
    },
  ];

  const setSearchData = (result) => {
    if (result && result.length > 0) {
      const res = result[0];
      dispatch(searchbarActions.setOrderId(res.orderId));
      dispatch(DashboardAction.setCustomerContactNumber(res.MobileNo));
      dispatch(DashboardAction.setCustomerEmailID(res.email));
      dispatch(
        searchbarActions.setSearchKey(
          res.name ? res.name + "  -  " + res.unit : ""
        )
      );

      const formData = new FormData();
      formData.append("orderId", res.orderId);

      fetch(process.env.REACT_APP_SERVER_URL + "/api/topBar/soa", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(searchbarActions.setAccountStmt(data.StatementOfAccount[0]));
        });
    }
  };

  const handleClick = useCallback(
    debounce((orderID) => {
      if (orderID === "") {
        dispatch(searchbarActions.setAccountStmt({}));
        dispatch(searchbarActions.setSearchKey(""));
        dispatch(searchbarActions.setOrderId(""));
        dispatch(DashboardAction.setCustomerContactNumber(""));
        dispatch(DashboardAction.setCustomerEmailID(""));
      } else {
        if (projectId) {
          const formData = new FormData();
          formData.append("projectId", projectId);
          formData.append("userName", userName);
          formData.append("passWord", passWord);

          fetch(process.env.REACT_APP_SERVER_URL + "/api/topBar/search", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((json) => {
              const results = json?.filter((customer) => {
                return customer.orderId === orderID;
              });
              setSearchData(results);
            });
        }
      }
    }, 300),
    [dispatch, projectId, passWord, userName]
  );

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.building,
        <Typography
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => {
            navigate("/crm/crm/dashboard");
            dispatch(DashboardAction.setShouldShowBookingDetails(false));
            handleClick(item?.orderId);
          }}
        >
          {item?.flatno}
        </Typography>,
        item?.customerName,
        item?.cvVal,
        item?.gst,
        item?.gstPer,
        item?.other,
        item?.gstOther,
        item?.gstOtherPer,
        item?.allIncVal,
      ];
    });
    return modifiedResponse;
  };

  useEffect(() => {
    setLoading(true);
    const data = getFilteredData(response);
    setTableData(modifyResponse(data));
    setLoading(false);
  }, [reducerData?.BookingReducer?.BookingsDetailsFilter, tableDetails]);

  useEffect(() => {
    setLoading(true);
    setTableData(modifyResponse(tableDetails));
    setLoading(false);
  }, []);

  return (
    <Grid style={{ marginTop: "0.5em" }}>
      {!loading ? (
        <ThemeProvider theme={getMuiTheme}>
          <Table data={tableData} columns={columns} options={options}></Table>
        </ThemeProvider>
      ) : (
        <CircularScreenLoader />
      )}
    </Grid>
  );
}
