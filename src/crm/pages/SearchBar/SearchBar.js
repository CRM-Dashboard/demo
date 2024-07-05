/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector, useDispatch } from "react-redux";
import searchbarActions from "./SearchBarReducer/SearchBarActions";
import dashboardAction from "./../Dashboard/DashboardReducer.js/DashboardActions";
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

    const formData = new FormData();
    formData.append("orderId", result.orderId);

    fetch(process.env.REACT_APP_SERVER_URL + "/api/topBar/soa", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(searchbarActions.setAccountStmt(data.StatementOfAccount[0]));
      });
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <input
        style={{
          backgroundColor: "white",
          height: "2.5em",
          width: "35em",
          borderRadius: "8px",
          border: "2px solid White",
          padding: "7px",
          fontFamily: "Futura, sans-serif",
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
      <Grid>
        <CancelIcon
          className="cancelIcon"
          style={{ position: "absolute" }}
          onClick={() => handleChange("")}
        />
      </Grid>
      {/* <span class="cancel-icon">&#10006;</span> */}
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
