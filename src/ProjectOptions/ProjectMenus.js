import React, { useState } from "react";
import styles from "./Style.css";
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { useTrail, a } from "@react-spring/web";

// const Trail = ({ open, children }) => {
//   const items = React.Children.toArray(children);
//   const trail = useTrail(items.length, {
//     config: { mass: 5, tension: 1000, friction: 100 },
//     opacity: open ? 1 : 0,
//     x: open ? 0 : 20,
//     height: open ? 110 : 0,
//     from: { opacity: 0, x: 20, height: 0 },
//   });
//   return (
//     <div>
//       {trail.map(({ height, ...style }, index) => (
//         <a.div key={index} className={styles.trailsText} style={style}>
//           <a.div style={{ height }}>{items[index]}</a.div>
//         </a.div>
//       ))}
//     </div>
//   );
// };

export default function ProjectMenus() {
  const navigate = useNavigate();
  const [open, set] = useState(true);

  return (
    <Grid
    // sx={{
    //   justifyContent: "center",
    //   alignItems: "centre",
    //   display: "flex",
    //   height: "100vh",
    // }}
    // className={styles.container}
    >
      {/* <Trail open={open}> */}
      <Grid
        // className={styles.container}
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
        onClick={() => set((state) => !state)}
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
            onClick={() => {
              navigate("/menus/home");
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
              Customer 360 degree Dashboard
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
            onClick={() => {
              navigate("./table");
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
