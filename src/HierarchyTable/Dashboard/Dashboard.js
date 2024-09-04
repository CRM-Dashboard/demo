/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, Grid, Typography } from "@mui/material";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import PublishedWithChangesOutlinedIcon from "@mui/icons-material/PublishedWithChangesOutlined";
import ProjectSummary from "./ProjectSummary";
import TaskSummary from "./TaskSummary";
import CircularScreenLoader from "../../crm/components/circularScreenLoader/CircularScreenLoader";
import TicketSummary from "./TicketSummary";
import ChangeSummary from "./ChangeSummary";

function ITHierarchyDashboard() {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState();

  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const CardStyle = {
    backgroundColor: "White",
    margin: "0.1em",
    padding: "0.8em",
    height: "5em",
  };

  const CardTitle = {
    fontSize: "12px",
  };

  const HighLightedText = { fontSize: "18px", fontWeight: "bold" };

  const getTableData = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    setLoading(true);
    fetch(
      // `https://gera-crm-server.azurewebsites.net//api/activity/getProjectTracker`,
      `${process.env.REACT_APP_SERVER_URL}/api/activity/getProjectTracker`,
      { method: "POST", body: formData }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setTableData(data[0]);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    getTableData();
  }, []);

  return (
    <Grid sx={{ height: "100vh" }}>
      {/* Header */}
      <Grid>
        <Typography sx={{ fontSize: "1.5em" }}> Dashboard </Typography>
      </Grid>

      {/* StatusCards */}
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        container
        columns={17}
        columnGap={2}
      >
        <Grid item sm={4} md={4} lg={4} sx={CardStyle}>
          <Grid
            sx={{
              display: "flex",
              alignItems: "space-between",
              justifyContent: "space-between",
            }}
          >
            <Grid>
              <Typography sx={CardTitle}>Projects</Typography>
              <Grid sx={{ display: "flex", padding: "0.2em" }}>
                <Typography sx={HighLightedText}>
                  {tableData?.dash[0].projectCnt}
                </Typography>
              </Grid>
            </Grid>
            <Grid>
              <Avatar sx={{ backgroundColor: "#8fe0b2" }}>
                <BusinessCenterOutlinedIcon sx={{ color: "green" }} />
              </Avatar>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={4} md={4} lg={4} sx={CardStyle}>
          <Grid
            sx={{
              display: "flex",
              alignItems: "space-between",
              justifyContent: "space-between",
            }}
          >
            <Grid>
              <Typography sx={CardTitle}>Tasks</Typography>
              <Grid sx={{ display: "flex", padding: "0.2em" }}>
                <Typography sx={HighLightedText}>
                  {tableData?.dash[0].taskCnt}
                </Typography>
              </Grid>
            </Grid>
            <Grid>
              <Avatar sx={{ backgroundColor: "#a6a6db" }}>
                <AssignmentTurnedInOutlinedIcon sx={{ color: "#000099" }} />
              </Avatar>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={4} md={4} lg={4} sx={CardStyle}>
          <Grid
            sx={{
              display: "flex",
              alignItems: "space-between",
              justifyContent: "space-between",
            }}
          >
            <Grid>
              <Typography sx={CardTitle}>Tickets</Typography>
              <Grid sx={{ display: "flex", padding: "0.2em" }}>
                <Typography sx={HighLightedText}>
                  {tableData?.dash[0].ticketCnt}
                </Typography>
              </Grid>
            </Grid>
            <Grid>
              <Avatar sx={{ backgroundColor: "#ffb28f" }}>
                <FormatListBulletedOutlinedIcon sx={{ color: "red" }} />
              </Avatar>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={4} md={4} lg={4} sx={CardStyle}>
          <Grid
            sx={{
              display: "flex",
              alignItems: "space-between",
              justifyContent: "space-between",
            }}
          >
            <Grid>
              <Typography sx={CardTitle}>Changes</Typography>
              <Grid sx={{ display: "flex", padding: "0.2em" }}>
                <Typography sx={HighLightedText}>
                  {tableData?.dash[0].changeCnt}
                </Typography>
              </Grid>
            </Grid>
            <Grid>
              <Avatar sx={{ backgroundColor: "#ffb8a6" }}>
                <PublishedWithChangesOutlinedIcon sx={{ color: "#ff3d0d" }} />
              </Avatar>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Table and Pie-chart */}
      {!loading ? (
        <>
          <ProjectSummary tableInfo={tableData} />
          <TaskSummary tableInfo={tableData} />
          <TicketSummary tableInfo={tableData} />
          <ChangeSummary tableInfo={tableData} />
        </>
      ) : (
        <CircularScreenLoader />
      )}
    </Grid>
  );
}

export default ITHierarchyDashboard;
