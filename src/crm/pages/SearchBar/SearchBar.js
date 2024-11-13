/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector, useDispatch } from "react-redux";
import searchbarActions from "./SearchBarReducer/SearchBarActions";
import dashboardAction from "./../Dashboard/DashboardReducer.js/DashboardActions";
import LoadingButton from "@mui/lab/LoadingButton";
import "./SearchBar.css";
import axios from "axios";

export default function SearchBar() {
  const [results, setResults] = useState([]);
  const [searchData, setSearchData] = useState("");
  const dashboardReducer = useSelector((state) => state);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const passWord = dashboardReducer.LoginReducer.passWord;
  const userName = dashboardReducer.LoginReducer.userName;
  const crmId = useSelector((state) => state?.dashboard?.crmId);
  const dispatch = useDispatch();

  console.log("selector", dashboardReducer);

  useEffect(() => {
    setSearchData(dashboardReducer?.searchBar?.searchKey);
  }, [dashboardReducer?.searchBar?.searchKey]);

  // Function to handle search when search icon is clicked

  const handleSearch = async () => {
    if (searchData.trim() === "") {
      // Reset everything when the input is empty
      dispatch(searchbarActions.setAccountStmt({}));
      dispatch(searchbarActions.setSearchKey(""));
      dispatch(searchbarActions.setOrderId(""));
      dispatch(dashboardAction.setCustomerContactNumber(""));
      dispatch(dashboardAction.setCustomerEmailID(""));
      dispatch(dashboardAction.setProjectId(""));
      setResults([]);
      return;
    }

    const formData = new FormData();
    formData.append("crmId", crmId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);

    try {
      setIsSearchLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/topBar/search`,
        formData
      );

      // Filter results based on the search input
      const filteredResults = response.data?.filter((customer) => {
        return (
          searchData &&
          (customer?.name.toLowerCase().includes(searchData.toLowerCase()) ||
            customer?.unit.toLowerCase().includes(searchData.toLowerCase()))
        );
      });

      setResults(filteredResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
      // Optionally, handle error here (show notification, log, etc.)
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Function to handle clearing the search field
  const handleClear = () => {
    setSearchData("");
    setResults([]);
    // dispatch(searchbarActions.setSearchKey(""));

    dispatch(searchbarActions.setAccountStmt({}));
    dispatch(searchbarActions.setSearchKey(""));
    dispatch(searchbarActions.setOrderId(""));
    dispatch(dashboardAction.setCustomerContactNumber(""));
    dispatch(dashboardAction.setCustomerEmailID(""));
    dispatch(dashboardAction.setProjectId(""));
  };

  const getProjectId = (orderId) => {
    if (orderId) {
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/so", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data[0].so[0].vbeln) {
            dispatch(dashboardAction.setProjectId(data[0].so[0].werks));
            // setLoading(false);
          }
        });
    }
  };

  const handleClick = (result) => {
    getProjectId(result.orderId);
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
    formData.append("crmId", "");

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
      <TextField
        size="small"
        value={searchData}
        onChange={(e) => setSearchData(e.target.value)} // Update search field but don't trigger API
        placeholder={
          crmId
            ? `Search ${crmId} Customers Here`
            : `Search Global Customers Here`
        }
        sx={{
          width: "43em",
          backgroundColor: "white",
          borderRadius: "12px",
        }}
        InputProps={{
          endAdornment: (
            <>
              <InputAdornment position="end">
                <LoadingButton
                  size="small"
                  sx={{ backgroundColor: "#62B4FF", color: "white" }}
                  // color="primary"
                  onClick={handleSearch}
                  loading={isSearchLoading}
                  loadingPosition="start"
                  startIcon={<SearchIcon />}
                  variant="contained"
                >
                  Search
                </LoadingButton>
              </InputAdornment>
              <InputAdornment position="end">
                <IconButton onClick={handleClear}>
                  <CancelIcon />
                </IconButton>
              </InputAdornment>
            </>
          ),
        }}
      />

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
