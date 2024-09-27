/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import BookingDetails from "./BookingDetails/BookingDetails";
import BookingData from "./BookingDetails/BookingData/BookingData";

function BookingReport() {
  const [unitData, setUnitData] = useState([]);

  const reducerData = useSelector((state) => state);
  const OrderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  useEffect(() => {
    getBookingDetails();
  }, []);

  const getBookingDetails = () => {
    if (OrderId) {
      const formData = new FormData();
      formData.append("orderId", OrderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/so", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data[0].so[0].vbeln) {
            setUnitData(data[0].so[0]);
            // setLoading(false);
          }
        });
    }
  };

  return (
    <Grid sx={{ height: "20em" }}>
      {OrderId ? <BookingDetails unitData={unitData} /> : <BookingData />}
    </Grid>
  );
}

export default BookingReport;
