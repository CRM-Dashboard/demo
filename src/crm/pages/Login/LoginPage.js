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

  const getLoggedInUserDetails = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("password", password);

    const apiUrl =
      process.env.REACT_APP_SERVER_URL + "/api/loggedInUserDetails";

    fetch(apiUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          // snackbar.showSuccess(`Welcome ${data[0].name}`);
          dispatch(loginActions.setLoggedInUserDetails(data[0]));
        }
      })
      .catch((error) => {
        if (error) {
          setError("Please Enter Valid Credentials!");
          snackbar.showError("Something went wrong! Please try again!");
        }
      });
  };

  const callBack = (data) => {
    if (data.status === "200") {
      snackbar.showSuccess("Logs created successfully!");
    } else {
      snackbar.showError("Failed to create log!");
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

  const shouldAllowUserLogin = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("password", password);

    const apiUrl = process.env.REACT_APP_SERVER_URL + "/api/login";

    fetch(apiUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          saveLog();
          // snackbar.showSuccess("Logged in successfully!");
          navigate("./menus");
          dispatch(loginActions.setPassword(password));
          dispatch(loginActions.setUserName(userName));
          getLoggedInUserDetails();
        }
      })
      .catch((error) => {
        if (error) {
          setError("Please Enter Valid Credentials!");
          snackbar.showError("Error while Loggin in. Please try again!");
        }
      });
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
      {/* <Grid
            sx={{
              border: "1px solid #d5d6d8",
              "&.MuiGrid-item": {
                padding: "1.5em",
                paddingRight: "0.5em",
              },
              "&.MuiGrid-root": {
                border: "none",
              },
            }}
            item
            xl={7}
            lg={7}
            md={7}
          >
            <img
              style={{ width: "100%" }}
              src={require("./../../../assets/CRM_login.jpg")}
            ></img>
          </Grid> */}
      <Grid
        item
        xl={5}
        lg={5}
        md={5}
        sx={{
          padding: "3em",
          "&.MuiGrid-item": {
            padding: "1.5em",
            paddingRight: "0.5em",
          },
          "&.MuiGrid-root": {
            border: "none",
          },
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
          ></img>
        </Grid>
        <Grid
          style={{
            justifyContent: "center",
            display: "flex",
            margin: "0",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.5em",
              fontFamily: "Futura, sans-serif",
              color: "#4a4e63",
              opacity: "0.8",
              paddingTop: "0.2em",
              marginBottom: "0",
              letterSpacing: "0",
            }}
          >
            {" "}
          </Typography>
        </Grid>
        <Grid
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "NoWrap",
            paddingTop: "1.5em",
            paddingLeft: "1em",
            paddingRight: "1em",
          }}
        >
          <Grid sx={{ paddingTop: "1em" }}>
            <Grid
              sx={{
                display: "flex",
                position: "relative",
                flexWrap: "wrap",
                alignItems: "stretch",
                width: "100%",
                marginRight: "1em",
              }}
            >
              <TextField
                onChange={(e) => {
                  setUserName(e.target.value);
                  setError("");
                }}
                // helperText="Please enter your name"
                id="filled-basic"
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
            </Grid>
          </Grid>
        </Grid>
        <Grid
          className="row w-100 d-flex noMargin"
          style={{
            flexDirection: "column",
            flexWrap: "NoWrap",
            paddingTop: "1.5em",
            paddingLeft: "1em",
            paddingRight: "1em",
          }}
        >
          <Grid style={{ paddingTop: "1em", position: "relative" }}>
            <Grid
              sx={{
                display: "flex",
                position: "relative",
                flexWrap: "wrap",
                alignItems: "stretch",
                width: "100%",
              }}
            >
              <TextField
                // helperText="Please enter your name"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                value={password}
                id="pswd"
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
                  alignItems: "flex-end",
                  paddingBottom: "0.5em",
                  paddingRight: "-1em",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setPasswordVisible(!passwordVisible);
                  }}
                  style={{
                    position: "absolute",
                  }}
                >
                  {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </Grid>
            </Grid>
          </Grid>
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
              border: "none",
              width: "70%",
              backgroundColor: "orange",
              color: "white",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                shouldAllowUserLogin();
              }
            }}
            onClick={() => {
              shouldAllowUserLogin();
            }}
          >
            Login
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
