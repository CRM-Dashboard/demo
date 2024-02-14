/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import searchbarActions from "./SearchBarReducer/SearchBarActions";
import dashboardAction from "./../Dashboard/DashboardReducer.js/DashboardActions";
import { Box, Typography } from "@mui/material";
import "./SearchBar.css";

export default function SearchBar() {
  const [results, setResults] = useState([]);
  const [searchData, setSearchData] = useState("");

  const dashboardReducer = useSelector((state) => state);
  const passWord = dashboardReducer.LoginReducer.passWord;
  const userName = dashboardReducer.LoginReducer.userName;
  const projectId = dashboardReducer?.dashboard?.project?.projectId;
  const dispatch = useDispatch();

  useEffect(() => {
    setSearchData(dashboardReducer?.searchBar?.searchKey);
  }, [dashboardReducer?.searchBar?.searchKey]);

  const handleChange = (value) => {
    if (value === "") {
      dispatch(searchbarActions.setAccountStmt({}));
      dispatch(searchbarActions.setSearchKey(""));
      dispatch(searchbarActions.setOrderId(""));
      dispatch(dashboardAction.setCustomerContactNumber(""));
      dispatch(dashboardAction.setCustomerEmailID(""));
    } else {
      setSearchData(value);
      if (projectId) {
        fetch(
          `http://115.124.113.252:8000/sap/bc/react/crm/search?sap-client=250&projectId=${projectId}&sap-user=${userName}&sap-password=${passWord}`
        )
          .then((response) => response.json())
          .then((json) => {
            const results = json.filter((customer) => {
              return (
                value &&
                (customer?.name.toLowerCase().includes(value.toLowerCase()) ||
                  customer?.unit.toLowerCase().includes(value.toLowerCase()))
              );
            });
            setResults(results);
          });
      }
    }
  };

  const handleClick = (result) => {
    setSearchData(result.name + "  -  " + result.unit);
    dispatch(searchbarActions.setOrderId(result.orderId));
    dispatch(dashboardAction.setCustomerContactNumber(result.MobileNo));
    dispatch(dashboardAction.setCustomerEmailID(result.email));
    dispatch(
      searchbarActions.setSearchKey(
        result.name ? result.name + "  -  " + result.unit : ""
      )
    );

    fetch(
      `http://115.124.113.252:8000/sap/bc/geraworld_app/bookings/soa?sap-client=250&vbeln=${result.orderId}`
    )
      .then((response) => response.json())
      .then((data) => {
        dispatch(searchbarActions.setAccountStmt(data.StatementOfAccount[0]));
      });
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <input
        style={{
          backgroundColor: "white",
          height: "2.5em",
          width: "35em",
          borderRadius: "8px",
          border: "2px solid White",
          padding: "7px",
        }}
        InputProps={{
          disableUnderline: true,
        }}
        size="small"
        value={searchData}
        placeholder="Search here..."
        onChange={(e) => handleChange(e.target.value)}
        label="Search"
      ></input>
      <Box className="results-list">
        <Box>
          {results &&
            results.length > 0 &&
            results.map((result, id) => {
              return (
                <div
                  className="search-result"
                  onClick={() => handleClick(result)}
                >
                  <Typography>
                    {" "}
                    {result.name + "  -  " + result.unit}{" "}
                  </Typography>
                </div>
              );
            })}
        </Box>
      </Box>
    </Box>
  );
}
