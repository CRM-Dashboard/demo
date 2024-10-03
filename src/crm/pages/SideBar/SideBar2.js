/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import {
  Box,
  Drawer,
  Typography,
  Tooltip,
  MenuItem,
  Badge,
  Menu,
} from "@mui/material";
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
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PhoneBookIcon from "@mui/icons-material/InterpreterMode";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import EqualizerIcon from "@mui/icons-material/Equalizer";
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
import EmailReport from "../Reports/EmailReport/EmailReport";
import ServiceRequest from "../Reports/ServiceRequest/ServiceRequest";
import AgingReport from "../Reports/AgingReport/AgingReport";
import CreateActivity from "./CreateActivity";
import PaymentsIcon from "@mui/icons-material/Payments";
import searchBarAction from "./../SearchBar/SearchBarReducer/SearchBarActions";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import CashbackReport from "../Reports/CashbackReport/CashbackReport";
import CrmModal from "../../components/crmModal/CrmModal";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import InputField from "../../components/inputField/InputField";
import CancellationReport from "../Reports/CancellationReport/CancellationReport";
import FileMovement from "../FileMovement/FileMovement";
import BookingReport from "../Reports/BookingReport/BookingReport";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

const routes = [
  {
    path: "/dashboard",
    to: "/crm",
    name: "Dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    path: "/fileMovement",
    to: "/crm",
    name: "File Movement",
    icon: <FileOpenIcon />,
  },
  {
    path: "/Reports",
    name: "Reports",
    icon: <SummarizeIcon />,
    subRoutes: [
      {
        path: "/serviceRequest",
        to: "/crm/serviceRequest",
        name: "Service Request",
        icon: <ManageAccountsIcon />,
      },
      {
        path: "/agingReport",
        to: "/crm/agingReport",
        name: "Ageing",
        icon: <EqualizerIcon />,
      },
      {
        path: "/cashBackReport",
        to: "/crm/cashBackReport",
        name: "Cashback",
        icon: <PaymentsIcon />,
      },
      {
        path: "/cancellationReport",
        to: "/crm/cancellationReport",
        name: "Cancellation ",
        icon: <EventBusyIcon />,
      },
      {
        path: "/bookingReport",
        to: "/crm/bookingReport",
        name: "Bookings ",
        icon: <LibraryBooksIcon />,
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
  const [sid, setSid] = useState(0);
  const [dpData, setDpdata] = useState([]);
  const [anchor, setAnchor] = useState(null);
  const [crmData, setCrmData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [callAPI, setCallAPI] = useState(false);
  const [actTypeData, setActTypeData] = useState([]);
  const [actModeData, setActModeData] = useState([]);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [activityData, setActivityData] = useState({});
  const [openSideBar, setOpenSideBar] = useState(false);
  const [showSendMail, setShowSendMail] = useState(false);
  const [subActTypeData, setSubActTypeData] = useState([]);
  const [showPrintMenus, setShowPrintMenus] = useState(false);
  const [openActivityModal, setOpenActivityModal] = useState(false);
  const [shouldShowBookingDetails, setShouldShowBookingDetails] =
    useState(false);
  const [shouldShowCustomerList, setShouldShowCustomerList] = useState(false);

  const ref = useRef(null);
  const open = Boolean(anchor);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggle = () => setIsOpen(!isOpen);
  const reducerData = useSelector((state) => state);
  const Sid = reducerData.searchBar.sid;
  const crmId = reducerData.dashboard.crmId;
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData.dashboard.project.projectId;
  const loggedInUser = reducerData.LoginReducer.loggedInUser;

  const [showList, setShowList] = React.useState(false);

  function timeAgo(dateString, timeString) {
    // Combine the date and time strings into a single ISO string
    const dateTime = new Date(`${dateString}T${timeString}Z`);

    // Get the current date and time
    const now = new Date();

    // Calculate the difference in milliseconds
    const diffInMs = now - dateTime;

    // Convert the difference to minutes, hours, and days
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Return the appropriate string based on the time difference
    if (diffInMinutes < 1) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  }

  const toggleList = () => {
    setShowList((prev) => !prev);
  };
  const handleClose = () => {
    setShowList(false);
  };

  const snackbar = UseCustomSnackbar();
  const color = GlobalFunctions.getThemeBasedColour(
    reducerData.ThemeReducer.mode
  );
  const customerMobileNumber = reducerData?.dashboard?.customerContactNo;
  const shouldShowMenus = reducerData?.searchBar?.orderId ? true : false;

  useEffect(() => {
    dispatch(dashboardActions.setShouldShowCustDetails(false));
  }, [shouldShowCustomerList]);

  useEffect(() => {
    dispatch(dashboardActions.setShouldShowBookingDetails(false));
  }, [shouldShowBookingDetails]);

  const handleContinue = () => {
    if (ref.current) {
      ref.current.handleContinue();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (callAPI && sid) {
        const interval = setInterval(async () => {
          if (callAPI && sid) {
            try {
              // Fetch status of sid here
              const data = await getCallDetailsBySid(sid); // Assuming getCallDetailsBySid is an asynchronous function

              const sidData = data?.filter((data) => data.Sid === sid);
              const status = sidData?.[0]?.Status; // Access the status from the first item of the filtered array
              const recordingUrl = sidData?.[0]?.RecordingUrl;
              console.log("status", status, recordingUrl);

              if (status) {
                setCallAPI(false);
                // setOpenActivityModal(true);
                clearInterval(interval); // Stop checking once flag is set to false
                if (status == "completed") {
                  console.log("call update api");
                  const [dateStr, timeStr] =
                    sidData?.[0]?.DateCreated.split(" ");
                  const entryData = {
                    SID: sidData?.[0]?.Sid,
                    ERDAT: dateStr,
                    UZEIT: timeStr,
                    CALL_FROM: sidData?.[0]?.From,
                    CALL_TO: sidData?.[0]?.To,
                    PHONESID: sidData?.[0]?.PhoneNumberSid,
                    STATUS: sidData?.[0]?.Status,
                    START_TIME: sidData?.[0]?.StartTime,
                    RECORDING_URL: sidData?.[0]?.RecordingUrl,
                    VBELN: orderId,
                  };

                  const callDatails = new FormData();
                  callDatails.append("userName", userName);
                  callDatails.append("passWord", passWord);
                  callDatails.append("entryData", JSON.stringify(entryData));

                  saveCallDetailsAPI(callDatails);
                }
              }
            } catch (error) {
              console.error("Error fetching status:", error);
            }
          }
        }, 30000); // 30 seconds interval

        return () => {
          clearInterval(interval);
          setCallAPI(false);
          setSid(0);
          dispatch(searchBarAction.setSid(""));
        };
      }
    };

    fetchData();
  }, [callAPI]); // Adding dependencies 'callAPI' and 'sid' to re-run effect when they change

  const getCrmDetails = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("crmId", crmId);

    fetch(process.env.REACT_APP_SERVER_URL + `/api/dashboard/getCrmManager`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("#########crm data", data);
        if (data?.length > 0) {
          setCrmData(data);
        }
      });
  };

  useEffect(() => {
    const formData = new FormData();
    formData.append("crmId", crmId);
    formData.append("orderId", orderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("projectId", projectId);

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/activity/getActivity`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data[0].actdata) {
          data[0].modedata && setActModeData(data[0].modedata);
          data[0].typdata && setActTypeData(data[0].typdata);
          data[0].subtypdata && setSubActTypeData(data[0].subtypdata);
          data[0].dpdata && setDpdata(data[0].dpdata);
        }
      });
    getCrmDetails();
  }, []);

  const getCallDetailsBySid = (sid) => {
    return new Promise((resolve, reject) => {
      if (sid) {
        const apiUrl =
          process.env.REACT_APP_SERVER_URL + "/api/exotel/callDetails";
        const formData = new FormData();
        formData.append("sid", sid);

        fetch(apiUrl, { method: "POST", body: formData })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            if (data) {
              resolve(data.Calls);
            } else {
              reject(new Error("No data received"));
            }
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(new Error("SID is not provided"));
      }
    });
  };

  const saveCallLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: `${userName} called to ${customerMobileNumber}`,
      CHANGEIND: "",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };
  const saveCallDetailsAPI = (callDetails) => {
    // process.env.REACT_APP_SERVER_URL
    const apiUrl =
      process.env.REACT_APP_SERVER_URL + "/api/topBar/saveCallDetails";

    fetch(apiUrl, { method: "POST", body: callDetails })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          saveCallLog();
          snackbar.showSuccess("Call Deatails save successfully!");
        }
      })
      .catch((error) => {
        if (error) {
          snackbar.showError(
            "Error while saving call details. Please try again!"
          );
        }
      });
  };

  const initiateOutgoingCall = async () => {
    if (customerMobileNumber !== "") {
      const formData = new FormData();
      formData.append("From", loggedInUser?.mobile);
      formData.append("To", customerMobileNumber);
      formData.append("CallerId", "020-485-55656");
      formData.append("Record", true);
      const apiUrl = process.env.REACT_APP_SERVER_URL + "/api/exotel/make-call";
      fetch(apiUrl, { method: "POST", body: formData })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setCallAPI(true);
            setSid(data.Call.Sid);
            dispatch(searchBarAction.setSid(data.Call.Sid));
            setOpenActivityModal(false);
            setDisabledBtn(true);
            snackbar.showSuccess("Connecting to..." + customerMobileNumber);
          }
        })
        .catch((error) => {
          if (error) {
            snackbar.showError("Error while connecting. Please try again!");
          }
        });
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

  const maskPhoneNumber = (number) => {
    const maskedNumber =
      number.substring(0, number.length - 4).replace(/\d/g, "X") +
      number.substring(number.length - 4);
    return maskedNumber;
  };

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Checking Gera-parking site",
      CHANGEIND: "",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const handleParking = async () => {
    try {
      const formData = new FormData();
      const entryData = {
        crmId: userName,
        projectId: projectId,
      };
      formData.append("entryData", JSON.stringify(entryData));

      fetch(process.env.REACT_APP_SERVER_URL + `/api/topBar/getParkingToken`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("data########", data);
          const geraParkingUrl = `http://gera-parking-website.s3-website.ap-south-1.amazonaws.com?tokenTimeStamp=${data.data.tokenTimeStamp}`;
          console.log("##########geraparkingurl", geraParkingUrl);
          window.open(geraParkingUrl, "_blank", "noopener,noreferrer");
          saveLog();
          // window.location.href = geraParkingUrl;
        });
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while generating the token. Please try again.");
    }
  };

  return (
    <>
      <Grid
        sx={{
          display: "flex",
          flex: "1",
          overflow: "auto",
          height: "100vh",
          position: "relative",
        }}
      >
        <AppBar open={isOpen}>
          <Toolbar className="toolbarBgColor" position="relative">
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
                // navigate("/menus/home");
                navigate("/menus");
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

            {/* <Typography
              gutterBottom
              style={{
                fontSize: "14px",
                marginTop: "0.6em",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {projectName}
            </Typography> */}

            <Grid style={{ flexGrow: 1, position: "relative" }}>
              <SearchBar />
            </Grid>

            <IconButton
              size="large"
              color="inherit"
              onClick={(e) => {
                handleParking();
              }}
              disabled={!shouldShowMenus}
            >
              <DirectionsCarFilledIcon />
            </IconButton>

            <Grid style={{ paddingRight: "0.8em" }}>
              <Badge
                onClick={toggleList}
                color="secondary"
                badgeContent={0}
                showZero
              >
                <NotificationsIcon />
              </Badge>
            </Grid>

            <IconButton
              size="large"
              color="inherit"
              onClick={(e) => {
                setShowPrintMenus(true);
              }}
              disabled={!shouldShowMenus}
            >
              <PrintIcon />
            </IconButton>

            <IconButton
              size="large"
              color="inherit"
              onClick={(e) => {
                setShowSendMail(true);
              }}
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
                  setOpenActivityModal(true);
                  handleContinue();
                  if (!Sid) {
                    initiateOutgoingCall();
                  }
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
            {showList && (
              <div style={{}}>
                {/* <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={toggleList}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton> */}
                <Menu
                  style={{ marginTop: "50px" }}
                  id="menu-appbar"
                  anchorEl={showList}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(showList)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    <Grid container>
                      <Grid item
                        md={2}
                      >
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            cursor: "pointer",
                            marginRight: "1em",
                            backgroundColor: "white",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          <img
                            alt="chatImg"
                            src={require("../../../assets/notification.webp")}
                            style={{ width: "45px", height: "45px" }}
                          // onClick={() => {
                          //   setIsChatDrawerOpen(true);
                          // }}
                          />
                        </Avatar>

                      </Grid>
                      <Grid item md={10}>
                        <Typography>
                          <strong>Vishal Jaiswal </strong>
                        </Typography>
                        <Typography> Approved by CRM Manager <small>{timeAgo("2024-10-02", "10:30:00")}</small> </Typography>
                      </Grid>
                      <Grid item md={12}>
                        {" "}

                      </Grid>
                    </Grid>

                  </MenuItem>
                  <MenuItem sx={{ width: "500px" }} onClick={handleClose}>
                    My account
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>

        <motion.div
          animate={{
            width: isOpen ? "200px" : "68px",

            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className="sidebar"
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
              style={{ color: "gray", padding: "0.4em 0.4em 0.8em" }}
            >
              <FaBars onClick={toggle} />
            </div>
          </div>

          <section className="routes">
            {isOpen && (
              <InputField
                sx={{ padding: "0.5em" }}
                select
                id="crm"
                name="crm"
                label="CRM"
                value={crmId}
                onChange={(e) => {
                  dispatch(dashboardActions.setCrmId(e.target.value));
                  // setSelectedCRM(e.target.value);
                }}
              >
                <MenuItem value=""> {"Select CRM"} </MenuItem>

                {crmData.map((crm) => {
                  return (
                    <MenuItem value={crm.crmId} key={crm.name}>
                      {crm.name}
                    </MenuItem>
                  );
                })}
              </InputField>
            )}
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
                  style={
                    route.name === "Dashboard" || route.name === "File Movement"
                      ? { padding: "5px 6px" }
                      : { padding: "5px 11px" }
                  }
                  activeclassname="active"
                // isActive={() => route.path === "/dashboard" &&  }
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: "0.5em",
                    }}
                    onClick={() => {
                      if (route.path === "/dashboard") {
                        setShouldShowCustomerList(!shouldShowCustomerList);
                        setShouldShowBookingDetails(!shouldShowBookingDetails);
                      }
                      navigate(`/crm/crm${route.path}`);
                    }}
                  >
                    <Grid>{route.icon}</Grid>
                    {!isOpen && (
                      <Grid
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            textAlign: "center",
                            fontSize: "11px",
                            gap: "7px",
                          }}
                        >
                          {" "}
                          {route.name}
                        </Typography>
                      </Grid>
                    )}
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
                            setShouldShowBookingDetails(
                              !shouldShowBookingDetails
                            );
                          }
                          navigate(`/crm/crm${route.path}`);
                        }}
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
        </motion.div>

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
              <Route path="/crm/*">
                <Route index element={<CustomerDetails />} />
                <Route path="fileMovement" element={<FileMovement />} />
                <Route path="customerDetails" element={<CustomerDetails />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="callHistory" element={<CallHistory />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="activities" element={<Activities />} />

                <Route path="emailReport" element={<EmailReport />} />
                <Route path="serviceRequest" element={<ServiceRequest />} />
                <Route path="agingReport" element={<AgingReport />} />
                <Route path="cashBackReport" element={<CashbackReport />} />
                <Route
                  path="cancellationReport"
                  element={<CancellationReport />}
                />
                <Route path="bookingReport" element={<BookingReport />} />
              </Route>
            </Routes>
          </Grid>
        </div>

        <Grid
          sx={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
            position: "relative",
          }}
        >
          {showMenus()}
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

        <CrmModal
          maxWidth="xxl"
          show={openActivityModal}
          handleShow={() => {
            setOpenActivityModal(false);
          }}
        >
          <CreateActivity
            ref={ref}
            dpData={dpData}
            setCallAPI={setCallAPI}
            setSid={setSid}
            actTypeData={actTypeData}
            actModeData={actModeData}
            disabledBtn={disabledBtn}
            activityData={activityData}
            subActTypeData={subActTypeData}
            setDisabledBtn={setDisabledBtn}
            setActivityData={setActivityData}
            setOpenActivityModal={setOpenActivityModal}
            initiateOutgoingCall={initiateOutgoingCall}
          />
        </CrmModal>

        <CrmModal
          maxWidth="md"
          show={showPrintMenus}
          handleShow={() => {
            setShowPrintMenus(false);
          }}
          closeModal={() => {
            setShowPrintMenus(false);
          }}
        >
          <PrintOptions />
        </CrmModal>

        <CrmModal
          maxWidth="md"
          show={showSendMail}
          handleShow={() => {
            setShowSendMail(false);
          }}
          closeModal={() => {
            setShowSendMail(false);
          }}
        >
          <MailOptions />
        </CrmModal>
      </Grid>
    </>
  );
};

export default SideBar2;
