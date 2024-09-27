import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import HomePage from "./HomePage";
import Tasks from "../TaskManagement/Tasks";
import Projects from "../ProjectManagement/Projects";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Route, Routes } from "react-router-dom";
import DvrIcon from "@mui/icons-material/Dvr";
import { NavLink, useNavigate } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import ITHierarchyDashboard from "../Dashboard/Dashboard";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Tickets from "../TicketManagement/Tickets";
import Changes from "../ChangeManagement/Changes";

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
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
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

const routes = [
  {
    path: "Dashboard",
    to: "/tracker",
    name: "Dashboard",
    icon: <DashboardIcon />,
  },

  {
    path: "overView",
    to: "/tracker",
    name: "Overview",
    icon: <AccountTreeIcon />,
  },
  {
    path: "project",
    to: "/tracker",
    name: "Projects",
    icon: <AssignmentIcon />,
  },
  {
    path: "task",
    to: "/tracker",
    name: "Tasks",
    icon: <DvrIcon />,
  },
  {
    path: "tickets",
    to: "/tracker",
    name: "Tickets",
    icon: <FormatListBulletedIcon />,
  },
  {
    path: "changes",
    to: "/tracker",
    name: "Changes",
    icon: <ChangeCircleIcon />,
  },
];

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const renderMenuItems = (route, index) => (
    <NavLink
      to={`/tracker/${route.path}`}
      key={index}
      className="link"
      activeclassname="active"
      onClick={() => navigate(`/tracker/${route.path}`)}
    >
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            {route.icon}
          </ListItemIcon>
          <ListItemText primary={route.name} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
    </NavLink>
  );

  const renderSubRoutes = (subRoutes) =>
    subRoutes.map((subRoute, subIndex) =>
      renderMenuItems(subRoute, `sub-${subIndex}`)
    );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            IT Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {routes.map((route, index) =>
            route.subRoutes ? (
              <React.Fragment key={index}>
                {renderMenuItems(route, index)}
                {renderSubRoutes(route.subRoutes)}
              </React.Fragment>
            ) : (
              renderMenuItems(route, index)
            )
          )}
        </List>
      </Drawer>
      <div className="content-container">
        <Grid
          sx={{
            paddingLeft: "1em",
            paddingRight: "1em",
            marginTop: "2em",
            // height: "100%",
          }}
        >
          <Routes>
            <Route path="/tracker/*">
              <Route index element={<ITHierarchyDashboard />} />
              <Route path="task" element={<Tasks />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="changes" element={<Changes />} />
              <Route path="project" element={<Projects />} />
              <Route path="overview" element={<HomePage />} />
              <Route path="dashboard" element={<ITHierarchyDashboard />} />
            </Route>
          </Routes>
        </Grid>
      </div>
    </Box>
  );
}
