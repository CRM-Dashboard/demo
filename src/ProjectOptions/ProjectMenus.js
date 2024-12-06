// ProjectMenus.tsx
import React from "react";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import Constants from "../crm/utils/Constants";
import GlobalFunctions from "../crm/utils/GlobalFunctions";
import DashboardItem from "./DashboardItem";
import "./Style.css";

const ProjectMenus = () => {
  const roles = Constants.roleConstants;
  const accessRoles = useSelector((state) => state.LoginReducer.accessRoles);

  // Define dashboard items as an array to improve reusability and readability
  const dashboardItems = [
    {
      title: "Customer 360° Dashboard",
      imageSrc: require("../../src/assets/CRM_login.jpg"),
      altText: "crm",
      navigateTo: "/crm/crm/dashboard",
      isAccessible: GlobalFunctions.allowAccessByRoles(
        accessRoles,
        roles.customer360
      ),
    },
    {
      title: "IT Service Management Dashboard",
      imageSrc: require("../../src/assets/IT_Tracker.jpg"),
      altText: "IT Service Management",
      navigateTo: "/tracker/Dashboard",
      isAccessible: GlobalFunctions.allowAccessByRoles(
        accessRoles,
        roles.itServiceManagement
      ),
    },
    {
      title: "Drawing Management",
      imageSrc: require("../../src/assets/drawing1.jpg"),
      altText: "Drawing Management",
      navigateTo: "/drawing",
      isAccessible: GlobalFunctions.allowAccessByRoles(
        accessRoles,
        roles.itServiceManagement
      ),
    },
    {
      title: "Campaign",
      imageSrc: require("../../src/assets/campaign.jpg"),
      altText: "Campaign",
      navigateTo: "/campaign",
      isAccessible: true,
    },

    {
      title: "Key Management",
      imageSrc: require("../../src/assets/key.webp"),
      altText: "Key Management",
      navigateTo: "/key-management",
      isAccessible: true,
    },
    {
      title: "Vendor Management",
      imageSrc: require("../../src/assets/Vendor Management.jpg"),
      altText: "Vendor Management",
      navigateTo: "/vendor",
      isAccessible: false,
    },
    {
      title: "Bill Management",
      imageSrc: require("../../src/assets/Bill Management.jpg"),
      altText: "Bill Management",
      navigateTo: "/table",
      isAccessible: false,
    },
    {
      title: "My Activity",
      imageSrc: require("../../src/assets/myactivity.jpg"),
      altText: "My Activity",
      navigateTo: "/my-activity",
      isAccessible: true,
    },
  ];

  return (
    <Grid
      container
      gap={2}
      rowSpacing={1}
      columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1 }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {dashboardItems.map((item, index) => (
        <DashboardItem key={index} {...item} />
      ))}
    </Grid>
  );
};

export default ProjectMenus;
