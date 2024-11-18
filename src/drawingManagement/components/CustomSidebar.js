import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Grid,
  Box,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu"; // Import menu icon
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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

const CustomSidebar = ({
  routes,
  logo,
  drawerWidth = 240,
  appBarTitle = "App Title",
  headerContent,
  children,
  navigateHandler,
}) => {
  console.log("vhilder", children);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const location = useLocation();
  const navigate = useNavigate();

  const renderMenuItems = (route, index) => (
    <NavLink
      key={index}
      to={`${route.to}/${route.path}`}
      onClick={() => {
        const link = `${route.to}/${route.path}`;
        navigateHandler(link);
        console.log("renderMenuItems", link);
      }}
    >
      <ListItem disablePadding>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
            backgroundColor: (theme) =>
              location.pathname === `${route.to}/${route.path}`
                ? theme.palette.primary.main // Active color
                : "transparent", // Default background
            color: (theme) =>
              location.pathname === `${route.to}/${route.path}`
                ? theme.palette.common.white // Active text color
                : "black", // Default text color
            "&:hover": {
              backgroundColor: (theme) => theme.palette.grey[300], // Hover background color
              color: (theme) => theme.palette.common.black, // Hover text color
            },
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

export default React.memo(CustomSidebar);
