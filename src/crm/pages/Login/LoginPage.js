/* eslint-disable jsx-a11y/alt-text */
import { Button, Typography, TextField } from "@mui/material";
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
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "7em",
        }}
        className="container-fluid"
      >
        <div className="row" style={{ width: "55%" }}>
          <div className="col-xl-7 col-lg-7 col-md-7 col-12">
            <img
              style={{ width: "100%", height: "95.6%" }}
              src={require("./../../../assets/CRM_login.jpg")}
            ></img>
          </div>
          <div
            className="col-xl-5 col-lg-5 col-md-5 col-12"
            style={{
              width: "100%",
              height: "80%",
              background: "#fff",
              border: "1px solid #d5d6d8",
            }}
          >
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                margin: "0",
                paddingTop: "1em",
              }}
              className=" w-100 row"
            >
              <img
                style={{ width: "50%", paddingTop: "13%" }}
                src={require("./../../../assets/gera_logo.jpg")}
              ></img>
            </div>
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                margin: "0",
              }}
              className=" w-100 row"
            >
              <Typography
                sx={{
                  fontSize: "1.5em",
                  fontFamily: "Futura-medium",
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
            </div>
            <div
              className="row w-100 d-flex noMargin"
              style={{
                flexDirection: "column",
                flexWrap: "NoWrap",
                paddingTop: "1.5em",
                paddingLeft: "1em",
              }}
            >
              <div className="pt-1 px-3 row">
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    flexWrap: "wrap",
                    alignItems: "stretch",
                    width: "100%",
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
                    label="UserName"
                    variant="filled"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        shouldAllowUserLogin();
                      }
                    }}
                    fullWidth
                  />
                </div>
              </div>
            </div>
            <div
              className="row w-100 d-flex noMargin"
              style={{
                flexDirection: "column",
                flexWrap: "NoWrap",
                paddingTop: "1.5em",
                paddingLeft: "1em",
              }}
            >
              <div className="pt-1 px-3 row">
                <div
                  style={{
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
                </div>
              </div>
            </div>
            {error && (
              <div
                className="row w-100 d-flex noMargin"
                style={{
                  justifyContent: "center",
                  paddingTop: "1.5em",
                  color: "Red",
                }}
              >
                <Typography>{error}</Typography>
              </div>
            )}
            <div
              style={{
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
