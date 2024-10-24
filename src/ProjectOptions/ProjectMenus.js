import React from "react";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Constants from "./../crm/utils/Constants";
import GlobalFunctions from "./../crm/utils/GlobalFunctions";
import "./Style.css";

export default function ProjectMenus() {
  const navigate = useNavigate();
  const roles = Constants.roleConstants;
  const reducerData = useSelector((state) => state);
  const accessRoles = reducerData.LoginReducer.accessRoles;
  // const [open, set] = useState(true);

  return (
    <Grid>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 2, sm: 2, md: 2, lg: 2 }}
        columns={30}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
        // onClick={() => set((state) => !state)}
      >
        <Grid item md={5} lg={5} sm={5} xs={5} className="animatedGrid">
          <Grid
            sx={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            className={
              GlobalFunctions.allowAccessByRoles(accessRoles, roles.customer360)
                ? ""
                : "non-clickable-grid"
            }
            onClick={() => {
              // navigate("/menus/home");
              navigate("/crm/crm/dashboard");
            }}
          >
            {" "}
            <img
              alt="crm"
              className="imageStyles"
              style={{ width: "80%", height: "60%" }}
              src={require("./../../src/assets/CRM_login.jpg")}
            ></img>{" "}
            <Typography
              sx={{ fontSize: "1rem", padding: "1em", paddingTop: "1.2em" }}
            >
              Customer 360° Dashboard
            </Typography>
          </Grid>
        </Grid>
        <Grid item md={5} lg={5} sm={5} xs={5}>
          <Grid
            style={{ cursor: "pointer" }}
            sx={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            className={
              GlobalFunctions.allowAccessByRoles(
                accessRoles,
                roles.itServiceManagement
              )
                ? ""
                : "non-clickable-grid"
            }
            onClick={() => {
              navigate("/tracker/Dashboard");
            }}
          >
            {" "}
            <img
              alt="crm"
              className="imageStyles"
              style={{ width: "80%", height: "60%" }}
              src={require("./../../src/assets/IT_Tracker.jpg")}
            ></img>{" "}
            <Typography
              sx={{ fontSize: "1rem", padding: "0.5em", paddingTop: "1.2em" }}
            >
              IT Service Management dashboard
            </Typography>
          </Grid>
        </Grid>
        <Grid item md={5} lg={5} sm={5} xs={5}>
          <Grid
            style={{ cursor: "pointer" }}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            className={
              GlobalFunctions.allowAccessByRoles(
                accessRoles,
                roles.itServiceManagement
              )
                ? ""
                : "non-clickable-grid"
            }
            onClick={() => {
              navigate("/drawing/dashboard");
            }}
          >
            <img
              alt="Drawing Management"
              className="imageStyles"
              style={{ width: "80%", height: "220px" }} // Ensure height is consistent
              src={require("./../../src/assets/drawing1.jpg")}
            />
            <Typography
              sx={{ fontSize: "1rem", padding: "0.5em", paddingTop: "1.2em" }}
            >
              Drawing Management
            </Typography>
          </Grid>
        </Grid>
        <Grid item md={5} lg={5} sm={5} xs={5}>
          <Grid
            style={{ cursor: "pointer" }}
            sx={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="non-clickable-grid"
            // onClick={() => {
            //   navigate("./table");
            // }}
          >
            {" "}
            <img
              alt="crm"
              className="imageStyles"
              style={{ width: "80%", height: "60%" }}
              src={require("./../../src/assets/Management Info System.jpg")}
            ></img>{" "}
            <Typography
              sx={{ fontSize: "1rem", padding: "0.5em", paddingTop: "1.2em" }}
            >
              Management Information System
            </Typography>
          </Grid>
        </Grid>
        <Grid item md={5} lg={5} sm={5} xs={5}>
          <Grid
            style={{ cursor: "pointer" }}
            className="non-clickable-grid"
            sx={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            // onClick={() => {
            //   navigate("./table");
            // }}
          >
            {" "}
            <img
              alt="crm"
              className="imageStyles"
              style={{ width: "80%", height: "60%" }}
              src={require("./../../src/assets/Vendor Management.jpg")}
            ></img>{" "}
            <Typography
              sx={{ fontSize: "1rem", padding: "1em", paddingTop: "1.2em" }}
            >
              Vendor Management
            </Typography>
          </Grid>
        </Grid>
        <Grid item md={5} lg={5} sm={5} xs={5}>
          <Grid
            style={{ cursor: "pointer" }}
            className="non-clickable-grid"
            sx={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => {
              navigate("./table");
            }}
          >
            {" "}
            <img
              alt="crm"
              className="imageStyles"
              style={{ width: "80%", height: "60%" }}
              src={require("./../../src/assets/Bill Management.jpg")}
            ></img>{" "}
            <Typography
              sx={{ fontSize: "1rem", padding: "1em", paddingTop: "1.2em" }}
            >
              Bill Management
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      {/* </Trail> */}
    </Grid>
  );
}
