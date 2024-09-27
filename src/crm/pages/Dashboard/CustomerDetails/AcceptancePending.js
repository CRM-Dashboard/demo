/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, forwardRef, useCallback } from "react";
import moment from "moment";
import { debounce } from "lodash";
import Table from "mui-datatables";
import { useSelector, useDispatch } from "react-redux";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import searchbarActions from "./../../SearchBar/SearchBarReducer/SearchBarActions";
import DashboardAction from "./../../Dashboard/DashboardReducer.js/DashboardActions";

const AcceptancePending = forwardRef((props, ref) => {
  const [tableData, setTableData] = useState([]);

  const dispatch = useDispatch();
  const reducerData = useSelector((state) => state);
  // const orderId = reducerData?.searchBar?.orderId;
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
    selectableRows: "none",
    rowsPerPage: 10,
    elevation: 0,
    print: false,
    download: false,
    search: false,
    viewColumns: false,
    filter: false,
  };

  const columns = [
    {
      name: "Date",
      label: "Date",
    },
    {
      name: "Unit",
      label: "Unit",
    },
    {
      name: "Customer Name",
      label: "Customer Name",
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
      props.setLoading(false);
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
        if (userName) {
          props.setLoading(true);
          const formData = new FormData();
          formData.append("projectId", userName);
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
        item?.applicationDt === "0000-00-00"
          ? ""
          : moment(item?.applicationDt).format("DD-MM-YYYY"),
        item?.unit,
        <label
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => {
            handleClick(item?.vbeln);
          }}
        >
          {item?.customerName}
        </label>,
        item?.vbeln,
      ];
    });
    return modifiedResponse;
  };

  useEffect(() => {
    setTableData(modifyResponse(props.tableData));
  }, []);

  useEffect(() => {
    setTableData(modifyResponse(props.tableData));
  }, [props.tableData]);

  return (
    <div style={{ marginTop: "1em" }}>
      <ThemeProvider theme={() => getMuiTheme()}>
        <Table data={tableData} columns={columns} options={options}></Table>
      </ThemeProvider>
    </div>
  );
});

export default AcceptancePending;
