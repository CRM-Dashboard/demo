import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  CssBaseline,
  Box,
  Tooltip,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate, NavLink } from "react-router-dom";

import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu"; // Import menu icon

import HomeIcon from "@mui/icons-material/Home";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(9)} + 15px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(10)} + 15px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const NestedRoutingSidebar = ({
  routes,
  logo,
  drawerWidth = 240,
  appBarTitle = "App Title",
  headerContent,
  children,
  navigateHandler,
}) => {
  // console.log("vhilder", children);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Initialize a state to manage which nested items are expanded
  const [openNestedRoutes, setOpenNestedRoutes] = useState({});

  const handleToggleNested = (path) => {
    setOpenNestedRoutes((prevState) => ({
      ...prevState,
      [path]: !prevState[path],
    }));
  };

  const isActiveRoute = (path) => location.pathname.startsWith(path);

  const renderMenuItems = (route, index) => {
    return (
      <React.Fragment key={index}>
        {/* Parent Route */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={
              route.subRoutes ? () => handleToggleNested(route.path) : undefined
            }
            sx={{
              minHeight: 48,
              justifyContent: "initial",
              px: 2.5,
              flexDirection: open ? "row" : "column",
              flexDirection: "row",
              backgroundColor: isActiveRoute(route.to)
                ? "#3f51b5"
                : "transparent",
              color: isActiveRoute(route.to) ? "#fff" : "black",
              "&:hover": {
                backgroundColor: "#f1f1f1",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: 3 }}>
              {route.icon}
            </ListItemIcon>
            <ListItemText primary={route.name} />
            {route.subRoutes &&
              (openNestedRoutes[route.path] ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>

        {/* Nested Routes */}
        {route.subRoutes && (
          <Collapse
            in={openNestedRoutes[route.path]}
            timeout="auto"
            unmountOnExit
          >
            {route.subRoutes.map((nestedRoute, nestedIndex) => (
              <ListItem
                key={`${index}-${nestedIndex}`}
                disablePadding
                sx={{ paddingLeft: 4 }}
              >
                <ListItemButton
                  onClick={() => {
                    navigate(`${route.to}/${nestedRoute.path}`);
                  }}
                  sx={{
                    minHeight: 40,
                    justifyContent: "initial",
                    px: 2.5,
                    // flexDirection: "row",
                    flexDirection: open ? "row" : "column",
                    backgroundColor: isActiveRoute(
                      `${route.to}/${nestedRoute.path}`
                    )
                      ? "#f50057"
                      : "transparent",
                    color: isActiveRoute(`${route.to}/${nestedRoute.path}`)
                      ? "#fff"
                      : "black",
                    "&:hover": {
                      backgroundColor: "#f1f1f1",
                    },
                  }}
                >
                  <ListItemText primary={nestedRoute.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} drawerWidth={drawerWidth}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: "none" }) }}
          >
            <MenuIcon /> {/* Menu Icon */}
          </IconButton>
          <Tooltip title="Home">
            <IconButton
              onClick={() => {
                navigate("/menus");
              }}
            >
              <HomeIcon sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
          <Typography
            sx={{ marginLeft: "5px" }}
            variant="h6"
            noWrap
            component="div"
          >
            {appBarTitle && appBarTitle}
          </Typography>{" "}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} drawerWidth={drawerWidth}>
        <DrawerHeader>
          {logo ? (
            <img src={logo} alt="Logo" style={{ maxWidth: "150px" }} />
          ) : (
            <Typography>{appBarTitle && appBarTitle}</Typography>
          )}
          {headerContent && headerContent}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>{routes && routes.map(renderMenuItems)}</List>
      </Drawer>
      <Grid
        component="main"
        sx={{
          flexGrow: 1,
          marginTop: "64px", // Adjust this to the height of your AppBar
          padding: "16px", // Added padding for better layout
          overflowY: "auto", // Ensure scrolling if content overflows
        }}
      >
        {children}
      </Grid>
    </Box>
  );
};

export default NestedRoutingSidebar;
