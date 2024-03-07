/* eslint-disable jsx-a11y/alt-text */
import { Button, Typography, TextField, Grid } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import loginActions from "./LoginReducer/LoginAction";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";

export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const snackbar = UseCustomSnackbar();

  const shouldAllowUserLogin = () => {
    fetch(
      ` /sap/bc/react/crm/login?sap-client=250&sap-user=${userName}&sap-password=${password}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        credentials: "omit",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          snackbar.showSuccess("Logged in successfully!");
          navigate("./home");
          dispatch(loginActions.setPassword(password));
          dispatch(loginActions.setUserName(userName));
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
    <Grid>
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "6.5em",
        }}
      >
        <Grid sx={{ width: "55%", border: "none" }} container>
          <Grid
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
              style={{ width: "100%", height: "80%" }}
              src={require("./../../../assets/CRM_login.jpg")}
            ></img>
          </Grid>
          <Grid
            item
            xl={5}
            lg={5}
            md={5}
            sx={{
              marginTop: "1.5em",
              width: "100%",
              height: "80%",
              background: "#fff",
              border: "1px solid #d5d6d8",
              "&.MuiGrid-item": {
                paddingBottom: "0",
              },
              "&.MuiGrid-root": {
                paddingBottom: "0",
              },
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
                CRM Login
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
              <Grid style={{ paddingTop: "1em" }}>
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
                    type="password"
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
                padding: error ? "1.5em" : "3.5em",
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
      </Grid>
    </Grid>
  );
}
