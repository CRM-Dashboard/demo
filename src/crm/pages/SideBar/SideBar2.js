/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { Box, Drawer, Typography, Tooltip, Badge } from "@mui/material";
import FaBars from "@mui/icons-material/HorizontalSplitSharp";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { AnimatePresence, motion } from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PrintIcon from "@mui/icons-material/Print";
import AudioCallIcon from "@mui/icons-material/Call";
import SettingsIcon from "@mui/icons-material/SettingsSharp";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "./SideBar2.css";
import { useNavigate } from "react-router-dom";
import PhoneBookIcon from "@mui/icons-material/InterpreterMode";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SummarizeIcon from "@mui/icons-material/Summarize";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CustomerDetails from "../Dashboard/CustomerDetails/CustomerDetails";
import dashboardActions from "./../Dashboard/DashboardReducer.js/DashboardActions";
import searchbarActions from "./../SearchBar/SearchBarReducer/SearchBarActions";
import ThemeOptions from "../ThemeOptions/ThemeOptions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import Invoices from "../Invoices/Invoices";
import ReceiptIcon from "@mui/icons-material/Receipt";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";
import Sidebar2Menus from "./SideBar2Menus";
import PrintOptions from "./PrintOptions";
import MailOptions from "./MailOptions";
import { useDispatch } from "react-redux";
import GlobalFunctions from "../../utils/GlobalFunctions";
import Dashboard from "../Dashboard/Dashboard";
import CallHistory from "../CallHistory/CallHistory";
import Activities from "../Activity/Activities";
import { useEffect } from "react";
import DashboardOptions from "./DashboardOptions";
import { Grid } from "@mui/material";
import EmailReport from "../Dashboard/EmailReport/EmailReport";
import ServiceRequest from "../Dashboard/ServiceRequest/ServiceRequest";

const routes = [
  {
    path: "/dashboard",
    to: "/crm",
    name: "Dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    path: "/Reports",
    name: "Reports",
    icon: <SummarizeIcon />,
    subRoutes: [
      {
        path: "/emailReport",
        to: "/crm/emailReport",
        name: "Email Report",
        icon: <MailOutlineIcon />,
      },
      {
        path: "/serviceRequest",
        to: "/crm/serviceRequest",
        name: "Service Request",
        icon: <ManageAccountsIcon />,
      },
    ],
  },
  {
    path: "/callHistory",
    to: "/crm/callHistory",
    name: "Call History ",
    icon: <PhoneBookIcon />,
  },
  {
    path: "/invoices",
    to: "/crm/invoices",
    name: "Invoices",
    icon: <ReceiptIcon />,
  },
  {
    path: "/activities",
    to: "/crm/activities",
    name: "Activity",
    icon: <AutoStoriesIcon />,
  },
];

const SideBar2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [docAnchor, setDocAnchor] = useState(null);
  const [mailAnchor, setMailAnchor] = useState(null);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [shouldShowCustomerList, setShouldShowCustomerList] = useState(false);
  const [shouldShowTimeLine, setShouldShowTimeline] = useState(false);

  const open = Boolean(anchor);
  const openDoc = Boolean(docAnchor);
  const openMail = Boolean(mailAnchor);
  const toggle = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reducerData = useSelector((state) => state);

  const snackbar = UseCustomSnackbar();
  const color = GlobalFunctions.getThemeBasedColour(
    reducerData.ThemeReducer.mode
  );
  const customerMobileNumber = reducerData?.dashboard?.customerContactNo;
  const shouldShowMenus = reducerData?.searchBar?.orderId ? true : false;
  const projectName =
    reducerData?.dashboard?.project?.name_hdr +
    " - " +
    reducerData?.dashboard?.project?.name_item;

  useEffect(() => {
    dispatch(dashboardActions.setShouldShowCustDetails(false));
  }, [shouldShowCustomerList]);

  useEffect(() => {
    dispatch(dashboardActions.setShouldShowTimeLine(false));
  }, [shouldShowTimeLine]);

  const initiateOutgoingCall = async () => {
    if (customerMobileNumber !== "") {
      // const apiKey = "3466f10b135ae555706ca14fc2ef2e0d200ad0362fb5b150";
      // const apiToken = "fd096332b8bc7cadd5df773003cfb45fffa34c4e51274149";
      // const subdomain = "@api.exotel.com";
      // const sid = "gera62";
      // const dataString = "From=9623361900&To=7769952626&CallerId=095-138-86363";
      // const corsAnywhereUrl = "https://cors-anywhere.herokuapp.com/";
      // const corsProxyUrl = "https://cors-proxy.htmldriven.com/";

      // const responseBody = await response.json();
      // -----------------------------------------------------------------------------------------
      // const requestBody = {
      //   From: "09623361900", // parsePhoneNumberFromString("09623361900", "IN").format("E.164"),
      //   To: customerMobileNumber,
      //   CallerId: "095-138-86363",
      //   Record: true,
      // };

      // fetch("http://localhost:5000/api/exotel/make-call", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(requestBody),
      // })
      //   .then((response) => response.json())
      //   .then((response) => {
      //     console.log("connect api####", response);
      //     if (response) {
      //       snackbar.showSuccess(
      //         "Connecting to...",
      //         maskPhoneNumber(customerMobileNumber)
      //       );
      //     } else {
      //       throw new Error(
      //         `Error: ${response.status} - ${response.statusText}`
      //       );
      //     }
      //   })
      //   .catch((error) => {
      //     console.error(
      //       "There was a problem with the fetch operation:",
      //       error
      //     );
      //   });
      // const basicAuthToken = btoa(`${apiKey}:${apiToken}`);

      const formData = new FormData();
      formData.append("From", "9623361900");
      formData.append("To", customerMobileNumber);
      formData.append("CallerId", "095-138-86363");
      formData.append("Record", "true");

      const apiUrl = "http://localhost:5000/api/exotel/make-call";

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        } else {
          snackbar.showSuccess("Connecting to..." + customerMobileNumber);
        }
      } catch (error) {
        snackbar.showError("Error while connecting. Please try again!");
      }
    }
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: `${isOpen}` ? "200px" : "45px",
      width: `calc(100% - ${isOpen ? "200px" : "45px"})`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const showMenus = () => {
    return (
      <DashboardOptions
        anchor={anchor}
        open={open}
        setOpenSideBar={setOpenSideBar}
        setAnchor={setAnchor}
      />
    );
  };

  const showPrintMenus = () => {
    return (
      <PrintOptions
        docAnchor={docAnchor}
        openDoc={openDoc}
        setDocAnchor={setDocAnchor}
      />
    );
  };

  const showMailMenus = () => {
    return (
      <MailOptions
        mailAnchor={mailAnchor}
        openMail={openMail}
        setMailAnchor={setMailAnchor}
      />
    );
  };

  const maskPhoneNumber = (number) => {
    const maskedNumber =
      number.substring(0, number.length - 4).replace(/\d/g, "X") +
      number.substring(number.length - 4);
    return maskedNumber;
  };

  return (
    <>
      <Grid
        //Refer main-conainer class
        sx={{
          display: "flex",
          flex: "1",
          overflow: "auto",
          height: "100vh",
        }}
      >
        <AppBar position="fixed" open={isOpen}>
          <Toolbar className="toolbarBgColor">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                setIsOpen(true);
              }}
              onChange={() => {
                setIsOpen(true);
              }}
              edge="start"
              sx={{
                marginRight: 5,
                overflow: "hidden",
                ...(isOpen && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => {
                navigate("/home");
                dispatch(searchbarActions.setSearchKey(""));
                dispatch(searchbarActions.setOrderId(""));
                dispatch(searchbarActions.setAccountStmt({}));
                dispatch(dashboardActions.setShowHappinessMeter(false));
                dispatch(dashboardActions.setShowSentimentAnalysis(false));
                dispatch(dashboardActions.setCustomerContactNumber(""));
                dispatch(dashboardActions.setCustomerEmailID(""));
              }}
              sx={{ fontSize: "5em" }}
            >
              <HomeIcon />
            </IconButton>

            <Typography gutterBottom style={{ marginTop: "0.6em" }}>
              {projectName}
            </Typography>

            <div style={{ flexGrow: 1 }}>
              <SearchBar />
            </div>

            <div style={{ paddingRight: "0.8em" }}>
              <Badge color="secondary" badgeContent={0} showZero>
                <NotificationsIcon />
              </Badge>
            </div>

            <IconButton
              size="large"
              color="inherit"
              onClick={(e) => {
                setDocAnchor(e.currentTarget);
              }}
              disabled={!shouldShowMenus}
              aria-controls={openDoc}
              aria-expanded={openDoc}
            >
              <PrintIcon />
            </IconButton>

            <IconButton
              size="large"
              color="inherit"
              onClick={(e) => {
                setMailAnchor(e.currentTarget);
              }}
              aria-controls={openMail}
              aria-expanded={openMail}
              disabled={!shouldShowMenus}
            >
              <MailIcon />
            </IconButton>

            <Tooltip
              title={maskPhoneNumber(customerMobileNumber)}
              placement="top"
            >
              <IconButton
                color="inherit"
                disabled={!customerMobileNumber}
                onClick={() => {
                  initiateOutgoingCall();
                }}
              >
                <AudioCallIcon />
              </IconButton>
            </Tooltip>

            <IconButton
              color="inherit"
              size="large"
              id="settings-button"
              onClick={(e) => {
                setAnchor(e.currentTarget);
              }}
              aria-controls={open}
              aria-expanded={open}
            >
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <motion.div
          animate={{
            width: isOpen ? "200px" : "45px",

            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar `}
        >
          <div className="top_section">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo"
                >
                  <div className="logo-container">
                    <img
                      alt="Gera"
                      className="logo"
                      src={require("./../../../assets/Gera_Logo_dark.png")}
                    />
                  </div>
                </motion.h1>
              )}
            </AnimatePresence>

            <div
              className="bars"
              style={{ color: color, padding: "0.4em 0.4em 0.8em" }}
            >
              <FaBars onClick={toggle} />
            </div>
          </div>

          <section className="routes">
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <Sidebar2Menus
                    color={color}
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }

              return (
                <NavLink
                  to={`/crm/crm${route.path}`}
                  key={index}
                  className="link"
                  activeclassname="active"
                  // isActive={() => route.path === "/dashboard" &&  }
                >
                  <div
                    onClick={() => {
                      if (route.path === "/dashboard") {
                        setShouldShowCustomerList(!shouldShowCustomerList);
                        setShouldShowTimeline(!shouldShowTimeLine);
                      }
                      navigate(`/crm/crm${route.path}`);
                    }}
                  >
                    {route.icon}
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                        onClick={() => {
                          if (route.path === "/dashboard") {
                            setShouldShowCustomerList(!shouldShowCustomerList);
                            setShouldShowTimeline(!shouldShowTimeLine);
                          }
                          navigate(`/crm/crm${route.path}`);
                        }}
                      >
                        <Typography>{route.name}</Typography>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
        </motion.div>

        <div className="content-container">
          <Box
            sx={{
              paddingLeft: "1em",
              paddingRight: "1em",
              marginTop: "2em",
              // height: "100%",
            }}
          >
            <Routes>
              <Route path="/crm/*">
                <Route index element={<CustomerDetails />} />
                <Route path="customerDetails" element={<CustomerDetails />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="callHistory" element={<CallHistory />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="activities" element={<Activities />} />
                <Route path="emailReport" element={<EmailReport />} />
                <Route path="serviceRequest" element={<ServiceRequest />} />
              </Route>
            </Routes>
          </Box>
        </div>

        <Grid sx={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
          {showMenus()}
          {showPrintMenus()}
          {showMailMenus()}
        </Grid>

        <Drawer
          anchor={"right"}
          open={openSideBar}
          onClose={() => {
            setOpenSideBar(true);
          }}
        >
          <Box
            sx={{
              width: 250,
            }}
          >
            <div sx={{ paddingTop: "4em", backgruondColor: "#000000" }}>
              <ThemeOptions setOpenSideBar={setOpenSideBar} />
            </div>{" "}
          </Box>
        </Drawer>
      </Grid>
    </>
  );
};

export default SideBar2;
