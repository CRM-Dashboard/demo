/* eslint-disable jsx-a11y/alt-text */
import { Button, Typography, TextField, Grid } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import loginActions from "./LoginReducer/LoginAction";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GlobalFunctions from "../../utils/GlobalFunctions";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;

  const getLoggedInUserDetails = async () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("password", password);

    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/loggedInUserDetails`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data) {

        localStorage.setItem("user", JSON.stringify(data));
        snackbar.showSuccess(`Welcome ${data[0]?.user[0].name}`);
        dispatch(loginActions.setLoggedInUserDetails(data[0]?.user[0]));
        dispatch(loginActions.setAccessRoles(data[0]?.roles));
      }
    } catch (error) {
      snackbar.showError("Something went wrong! Please try again!");
    }
  };
  const callBack = (data) => {
    if (data.status === "200") {
      console.log("Logs created successfully!");
    } else {
      console.log("Failed to create log!");
    }
  };

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "LogIn",
      CHANGEIND: "",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, password, entryData, callBack);
  };

  const shouldAllowUserLogin = async () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("password", password);

    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/login`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data) {
        localStorage.setItem("user", JSON.stringify(data));
        dispatch(loginActions.setPassword(password));
        dispatch(loginActions.setUserName(userName));

        await getLoggedInUserDetails(); // Ensure details are fetched before navigation
        saveLog();
        navigate("./menus");
      }
    } catch (error) {
      setError("Please Enter Valid Credentials!");
      snackbar.showError("Error while Logging in. Please try again!");
    }
  };

  return (
    <Grid
      container
      sx={{
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Grid
        item
        xl={5}
        lg={5}
        md={5}
        sx={{
          padding: "3em",
          background: "#fff",
          border: "1px solid #d5d6d8",
        }}
      >
        <Grid
          sx={{
            justifyContent: "center",
            display: "flex",
            margin: "0",
            paddingTop: "1em",
            width: "100%",
          }}
        >
          <img
            style={{ width: "50%", paddingTop: "5%" }}
            src={require("./../../../assets/gera_logo.jpg")}
          />
        </Grid>
        <Grid
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            paddingTop: "1.5em",
            paddingLeft: "1em",
            paddingRight: "1em",
          }}
        >
          <TextField
            onChange={(e) => {
              setUserName(e.target.value);
              setError("");
            }}
            value={userName}
            label="Username"
            variant="filled"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                shouldAllowUserLogin();
              }
            }}
            fullWidth
          />
          <TextField
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            value={password}
            label="Password"
            type={passwordVisible ? "text" : "password"}
            variant="filled"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                shouldAllowUserLogin();
              }
            }}
            fullWidth
          />
          <Grid
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingBottom: "0.5em",
            }}
          >
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              style={{
                position: "absolute",
              }}
            >
              {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </Grid>
          {error && (
            <Grid
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                paddingTop: "1.5em",
                color: "Red",
              }}
            >
              <Typography>{error}</Typography>
            </Grid>
          )}
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              width: "100%",
              padding: error ? "2.7em" : "4.2em",
            }}
          >
            <Button
              style={{
                borderRadius: "2em",
                width: "70%",
                backgroundColor: "orange",
                color: "white",
              }}
              onClick={shouldAllowUserLogin}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
