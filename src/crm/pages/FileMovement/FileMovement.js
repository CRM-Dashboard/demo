/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from "react";
import "./Style.css";
import PropTypes from "prop-types";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import Tabs from "@mui/material/Tabs";
import FileDetails from "./FileDetails";
import FileUploader from "./FileUploader";
import { useSelector } from "react-redux";
import "react-chat-elements/dist/main.css";
import Stepper from "@mui/material/Stepper";
import { Button, Paper } from "@mui/material";
import Constants from "./../../utils/Constants";
import StepLabel from "@mui/material/StepLabel";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import StepContent from "@mui/material/StepContent";
import CrmModal from "../../components/crmModal/CrmModal";
import GlobalFunctions from "../../utils/GlobalFunctions";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import LabelWithCheckbox from "../../components/labelWithCheckBox/LabelWithCheckBox";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import CircularScreenLoader from "../../components/circularScreenLoader/CircularScreenLoader";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const steps = [
  {
    label: "Upload Customer KYC Details",
    description: `Sales Team to Upload customer cost sheet, PAN details, payment schedule and other KYC Details.`,
  },
  {
    label: "CRM Gate Keeper",
    description:
      "CRM Gate keeper to check and verify cost sheet details with system details.",
  },
  {
    label: "CRM Manager Confirmation",
    description: `CRM Manager confirm sales order and acceptance letter, agreement drafts will be trigger to customer.`,
  },
];

const checklistItems = [
  "Application Date as per Offer Letter",
  "Customers/co applicants name with salutation (to be spelt as on PAN card)",
  "Correct contact nos. / alternate contact no’s",
  "Correct email id with check on spelling",
  "Birth date and year for all applicants",
  "PAN details for all applicants",
  "Occupation for all applicants",
  "Kids Name/s and Age",
  "Consideration Value as per Offer Letter",
  "Summation of the schedule populated to be equal to the consideration value along with payment structure offered to customer",
  "Payment Schemes, if provided and approval for same",
  "In case of delay in file movement, approval provided",
  "Correct type of parking as per the Offer Letter",
  "Invoice to be raised as per scheme mentioned/5% of CV",
  "In the sales order under condition, check all the values which make the CV. Also check correct GST amount and input credit passed on is correct",
  "Admin Charges/ DG back up charges : Header bill plan should not be ticked for Admin Charges/ DG Back up charges to ensure that charges are not part of CV",
  "Stamp duty amount to be verified as per CV/ market value",
  "CIBIL consent form obtained by Sales Team from Individual customer",
  '"On Offer Letter" payment received',
];

export default function FileMovement() {
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [messages, setMessages] = useState([]);
  const [fileIndex, setFileIndex] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [checkedItems, setCheckedItems] = useState(
    Array(checklistItems.length).fill(false)
  );
  const [checkListData, setCheckListData] = useState();
  const [currentOrderId, setCurrentOrderId] = useState();
  const [fileUploadType, setfileUploadType] = useState();
  const [currentStepData, setCurrentStepData] = useState([]);
  const [openFileUpload, setOpenFileUpload] = useState(false);
  const [checks, setChecks] = useState({
    CHECK_1: "",
    CHECK_2: "",
    CHECK_3: "",
    CHECK_4: "",
    CHECK_5: "",
    CHECK_6: "",
    CHECK_7: "",
    CHECK_8: "",
    CHECK_9: "",
    CHECK_10: "",
    CHECK_11: "",
    CHECK_12: "",
    CHECK_13: "",
    CHECK_14: "",
    CHECK_15: "",
    CHECK_16: "",
    CHECK_17: "",
    CHECK_18: "",
    CHECK_19: "",
  });
  const [allChecked, setAllChecked] = useState(false);

  const ref = useRef(null);
  const fileRef = useRef(null);
  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const crmId = reducerData.dashboard.crmId;
  const OrderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const accessConstants = Constants.accessConstants;
  const userName = reducerData.LoginReducer.userName;
  const accessRoles = reducerData.LoginReducer.accessRoles;
  const loggedInUser = reducerData.LoginReducer.loggedInUser;
  const projectId = reducerData?.dashboard?.project?.projectId;

  const handleCheckListChange = (index) => {
    const updatedChecks = { ...checks };
    updatedChecks[`CHECK_${index + 1}`] =
      updatedChecks[`CHECK_${index + 1}`] === "X" ? "" : "X";
    setChecks(updatedChecks);
    // const updatedCheckedItems = [...checkedItems];
    // updatedCheckedItems[index] = !updatedCheckedItems[index];
    // setCheckedItems(updatedCheckedItems);
  };

  const sendMail = (mailId) => {
    const formData = new FormData();
    formData.append("orderId", currentOrderId);
    formData.append("mailId", mailId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);

    fetch(process.env.REACT_APP_SERVER_URL + "/api/topBar/mail", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response;
      })
      .then((data) => {
        if (data) {
          snackbar.showSuccess(
            <Typography> Sent Mail(s) Successfully!</Typography>
          );
        }
        // getTableData();
      })
      .catch((error) => {
        if (error) {
          snackbar.showError("Error while sending mail. Please try again!");
        }
      });
  };

  const handleFinish = () => {
    saveChats();
    sendMail("ACCEPT");
    sendMail("AGREEMENT");
  };

  const getCheckList = () => {
    const formData = new FormData();

    formData.append("orderId", currentOrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);

    fetch(process.env.REACT_APP_SERVER_URL + "/api/fileMovement/getCheckList", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log("#########checklistdata", data);
          setCheckListData(data[0]);
        }
      });
  };

  useEffect(() => {
    setChecks({
      CHECK_1: checkListData?.CHECK_1,
      CHECK_2: checkListData?.CHECK_2,
      CHECK_3: checkListData?.CHECK_3,
      CHECK_4: checkListData?.CHECK_4,
      CHECK_5: checkListData?.CHECK_5,
      CHECK_6: checkListData?.CHECK_6,
      CHECK_7: checkListData?.CHECK_7,
      CHECK_8: checkListData?.CHECK_8,
      CHECK_9: checkListData?.CHECK_9,
      CHECK_10: checkListData?.CHECK_10,
      CHECK_11: checkListData?.CHECK_11,
      CHECK_12: checkListData?.CHECK_12,
      CHECK_13: checkListData?.CHECK_13,
      CHECK_14: checkListData?.CHECK_14,
      CHECK_15: checkListData?.CHECK_15,
      CHECK_16: checkListData?.CHECK_16,
      CHECK_17: checkListData?.CHECK_17,
      CHECK_18: checkListData?.CHECK_18,
      CHECK_19: checkListData?.CHECK_19,
    });
  }, [checkListData]);

  useEffect(() => {
    setAllChecked(Object.values(checks).every((check) => check === "X"));
  }, [checks]);

  const handleSaveChecklist = () => {
    // Prepare data for API call
    const updatedData = [
      {
        ...checkListData,
        ...checks,
      },
    ];

    const formData = new FormData();

    formData.append("orderId", currentOrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(updatedData));

    fetch(process.env.REACT_APP_SERVER_URL + "/api/fileMovement/checkList", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          getCheckList();
          snackbar.showSuccess("CheckList Submitted SuccessFully");
        }
      });

    console.log("Updated checklist Data**********:", updatedData);
  };

  const handleNext = (index) => {
    //Handeled Continue Button
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (index === steps.length - 1) {
      handleFinish();
      savCurrentStepByIdAndAction("CRM", "A");
      saveChats("Files have been Approved by CRM Manager!");
    } else if (index === 1) {
      savCurrentStepByIdAndAction("CGK", "A");
      saveChats("Gate Keeper Transfered File To CRM manager.");
    } else if (index === 0) {
      savCurrentStepByIdAndAction("SM", "A");
      saveChats("Sales Team Transfered File to Gate Keeper.");
    } else if (index === 2) {
      savCurrentStepByIdAndAction("CRM", "A");
      saveChats("CRM Manager has been Confirmed File!");
    }
  };

  const handleBack = (index) => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (index === 1) {
      savCurrentStepByIdAndAction("CGK", "R");
      saveChats("Gate Keeper Returned File To Sales Team.");
    } else if (index === 2) {
      savCurrentStepByIdAndAction("CRM", "R");
      saveChats("CRM Manager has Returned file to Gate Keeper!");
    }
  };

  const handleBackToSales = (index) => {
    setActiveStep((prevActiveStep) => prevActiveStep - 2);
    saveChats("CRM Manager Returned file to Sales Team!");

    savCurrentStepByIdAndAction("CRM", "R1");
    saveChats("CRM Manager has Returned file to Sales Team!");
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getData = () => {
    if (ref.current) {
      ref.current.getData();
    }
  };

  const getTableData = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("crmId", crmId);
    formData.append("orderId", OrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("projectId", projectId);

    fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/so_list", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setResponse(data[0]?.orderdata);
          const nonConfRecords = data[0]?.orderdata.filter((data) => {
            if (data.confStatus !== "Confirmed") {
              return data;
            }
          });
          // setCurrentOrderId(nonConfRecords[0].orderId);
          getCurrentStep(nonConfRecords[0].orderId);
          setTableData(nonConfRecords);
          console.log("##############nonConfRecords", nonConfRecords);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  function formatCustomDate(dateStr, timeStr) {
    // Create a new Date object by combining the date and time
    const dateTime = new Date(`${dateStr}T${timeStr}`);

    // Convert the date object to the desired format
    const formattedDate = dateTime.toString();

    return formattedDate;
  }

  function convertToISO8601(dateString, timeString) {
    // Split the date string into year, month, and day
    const [year, month, day] = dateString.split("-").map(Number);

    // Split the time string into hours, minutes, and seconds
    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    // Create a new Date object with the provided date and time (Month is 0-indexed)
    const date = new Date(
      Date.UTC(year, month - 1, day, hours, minutes, seconds)
    );

    // Convert to ISO string in UTC time zone (Z denotes UTC)
    const isoString = date.toISOString();

    return isoString;
  }

  function transformData(inputArray) {
    return inputArray.map((item) => ({
      position: "left",
      type: "text",
      title: `${item.ernam}`,
      text: item.remark,
      date: convertToISO8601(item.erdat, item.uzeit),
    }));
  }

  const getChats = () => {
    const formData = new FormData();

    if (currentOrderId) {
      formData.append("orderId", currentOrderId);
    }

    formData.append("userName", userName);
    formData.append("passWord", passWord);

    fetch(process.env.REACT_APP_SERVER_URL + "/api/fileMovement/getChats", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          // const finalMessages = transformData(data);
          const updatedData = data.map((item) => ({
            ...item,
            sentTime: timeAgo(item.erdat, item.uzeit),
          }));
          console.log("############chats", updatedData);
          setMessages(updatedData);
        }
      });
  };

  const saveChats = (message) => {
    const entryData = [
      {
        vbeln: currentOrderId ? currentOrderId : OrderId,
        process: "FILE_MOVEMNET",
        remark: message ? message : newMessage,
      },
    ];

    const formData = new FormData();

    formData.append("entryData", JSON.stringify(entryData));
    formData.append("userName", userName);
    formData.append("passWord", passWord);

    fetch(process.env.REACT_APP_SERVER_URL + "/api/fileMovement/saveChats", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          getChats();
          setNewMessage("");
          console.log("############chats", data);
        }
      });
  };

  // const updateTableData = () => {
  //   const nonConfRecords = response?.filter((data) => {
  //     if (data.orderId !== OrderId) {
  //       return data;
  //     }
  //   });
  //   // setCurrentOrderId(nonConfRecords[0].orderId);
  //   getCurrentStep(nonConfRecords[0]?.orderId);
  //   setTableData(nonConfRecords);
  // };

  useEffect(() => {
    getTableData();
    // getCurrentStep();
    getCheckList();
    getChats();
  }, []);

  useEffect(() => {
    // getTableData();
    getCheckList();
    getChats();
    getCurrentStep();
    // OrderId ? updateTableData() : getTableData();
  }, [OrderId, currentOrderId]);

  const handleSend = () => {
    if (newMessage?.trim() !== "") {
      setMessages([...messages, newMessage]);
      setNewMessage("");
    }
    saveChats();
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const saveUrls = (fileUrls) => {
    const entryData = [];
    var Index = fileIndex;
    // eslint-disable-next-line array-callback-return
    fileUrls?.map((obj) => {
      entryData.push({
        DOKNR: currentOrderId,
        REFERENCE: currentOrderId,
        LO_INDEX: Index + 1,
        PROCESS: "FILE_MOVEMENT",
        FILENAME: obj?.key?.split("/")?.pop(),
        URL: obj.url,
        AEDAT: new Date()?.toISOString()?.split("T")[0],
        AENAM: loggedInUser.name,
        AEZET: new Date()?.toLocaleTimeString("en-GB", { hour12: false }),
      });
      Index = Index + 1;
    });

    const formData = new FormData();
    formData.append("entryData", JSON.stringify(entryData));
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(
      process.env.REACT_APP_SERVER_URL + "/api/activity/saveUploadedFiles",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          snackbar.showSuccess("File URLs data saved successfully");
          getData();
        }
      });
  };

  const getFilesCount = () => {
    const formData = new FormData();
    formData.append("reqNo", currentOrderId);
    formData.append("orderId", currentOrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("process", "FILE_MOVEMENT");
    fetch(
      process.env.REACT_APP_SERVER_URL + "/api/activity/getFileUrlsByReqNo",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setFileIndex(data.data.length);
        }
      });
  };

  const getTabDetails = (tabName) => {
    if (tabName === "Upload Customer KYC Details") {
      return (
        <Grid>
          <Grid container columns={12} spacing={1} sx={{ paddingTop: "0.5em" }}>
            <Grid item sm={6} md={6} lg={6}>
              <Typography sx={{ fontSize: "13px" }}>Offer Letter</Typography>
            </Grid>
            <Grid item sm={6} md={6} lg={6}>
              <Button
                sx={{
                  border: "1px solid blue",
                  borderRadius: "1.3em",
                  fontSize: "13px",
                  width: "10em ",
                  height: "2em",
                }}
                disabled={!currentOrderId}
                onClick={() => {
                  setfileUploadType("Offer_Letter");
                  setOpenFileUpload(true);
                  getFilesCount();
                }}
              >
                {" "}
                Upload Files
              </Button>
            </Grid>
          </Grid>
          <Grid container columns={12} spacing={1} sx={{ paddingTop: "0.5em" }}>
            <Grid item sm={6} md={6} lg={6}>
              <Typography sx={{ fontSize: "13px" }}>Cost Sheet</Typography>
            </Grid>
            <Grid item sm={6} md={6} lg={6}>
              <Button
                sx={{
                  border: "1px solid blue",
                  borderRadius: "1.3em",
                  fontSize: "13px",
                  width: "10em ",
                  height: "2em",
                }}
                disabled={!currentOrderId}
                onClick={() => {
                  setfileUploadType("Cost_Sheet");
                  setOpenFileUpload(true);
                  getFilesCount();
                }}
              >
                {" "}
                Upload Files
              </Button>
            </Grid>
          </Grid>
          <Grid container columns={12} spacing={1} sx={{ paddingTop: "0.5em" }}>
            <Grid item sm={6} md={6} lg={6}>
              <Typography sx={{ fontSize: "13px" }}>
                Payment Schedule
              </Typography>
            </Grid>
            <Grid item sm={6} md={6} lg={6}>
              <Button
                sx={{
                  border: "1px solid blue",
                  borderRadius: "1.3em",
                  fontSize: "13px",
                  width: "10em ",
                  height: "2em",
                }}
                disabled={!currentOrderId}
                onClick={() => {
                  setfileUploadType("Payment_Schedule");
                  setOpenFileUpload(true);
                  getFilesCount();
                }}
              >
                {" "}
                Upload Files
              </Button>
            </Grid>
          </Grid>
          <Grid container columns={12} spacing={1} sx={{ paddingTop: "0.5em" }}>
            <Grid item sm={6} md={6} lg={6}>
              <Typography sx={{ fontSize: "13px" }}>KYC Details</Typography>
            </Grid>
            <Grid item sm={6} md={6} lg={6}>
              <Button
                sx={{
                  border: "1px solid blue",
                  borderRadius: "1.3em",
                  fontSize: "13px",
                  width: "10em ",
                  height: "2em",
                }}
                disabled={!currentOrderId}
                onClick={() => {
                  setfileUploadType("Kyc_Details");
                  setOpenFileUpload(true);
                  getFilesCount();
                }}
              >
                {" "}
                Upload Files
              </Button>
            </Grid>
          </Grid>
          <Grid container columns={12} spacing={1} sx={{ paddingTop: "0.5em" }}>
            <Grid item sm={6} md={6} lg={6}>
              <Typography sx={{ fontSize: "13px" }}>Scheme Details</Typography>
            </Grid>
            <Grid item sm={6} md={6} lg={6}>
              <Button
                sx={{
                  border: "1px solid blue",
                  borderRadius: "1.3em",
                  fontSize: "13px",
                  width: "10em ",
                  height: "2em",
                }}
                disabled={!currentOrderId}
                onClick={() => {
                  setfileUploadType("Scheme_Details");
                  setOpenFileUpload(true);
                  getFilesCount();
                }}
              >
                {" "}
                Upload Files
              </Button>
            </Grid>
          </Grid>
        </Grid>
      );
    } else if (tabName === "CRM Gate Keeper") {
      return checklistItems?.map((item, index) => (
        <div key={index} style={{ display: "flex" }}>
          <LabelWithCheckbox
            // value={checkedItems[index]}
            onChange={() => handleCheckListChange(index)}
            value={checks[`CHECK_${index + 1}`] === "X"}
          />
          <Typography
            sx={{ width: "100%", fontSize: "13px", marginTop: "1em" }}
          >
            {item}
          </Typography>
        </div>
      ));
    }
  };

  const shouldButtonDisable = (index) => {
    if (index === 1) {
      return (
        !allChecked &&
        GlobalFunctions.allowAccessByRoles(
          accessRoles,
          accessConstants.fileMovementGateKeeper
        )
      );
    } else if (index === 0) {
      return !GlobalFunctions.allowAccessByRoles(
        accessRoles,
        accessConstants.fileMovementSales
      );
    } else if (index === 2) {
      return !GlobalFunctions.allowAccessByRoles(
        accessRoles,
        accessConstants.fileMovementRelManager
      );
    }
  };

  const getCurrentStep = (id) => {
    console.log("############currentOrderId", currentOrderId || id);
    if (currentOrderId || id) {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("orderId", currentOrderId || id);

      fetch(
        process.env.REACT_APP_SERVER_URL + "/api/fileMovement/getFileRelease",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data) {
            console.log("#@@@@@@@@@@@@@@@currentstep", data[0].CURRENT_STEP);
            setCurrentStepData(data[0].STEP_DATA);
            if (data?.[0]?.CURRENT_STEP) {
              const latestStep = data?.[0]?.CURRENT_STEP.replace("0", "");
              console.log("currenStep!!!!!!!!!!!", latestStep, latestStep - 1);
              setActiveStep(latestStep - 1);
            }
            snackbar.showSuccess(
              <Typography> Get Current step status Successfully!</Typography>
            );
          }
          // getTableData();
        })
        .catch((error) => {
          if (error) {
            snackbar.showError(
              "Error while getting current step. Please try again!"
            );
          }
        });
    }
  };

  const savCurrentStepByIdAndAction = (Id, Action) => {
    const currentActiveData = currentStepData.filter((data) => {
      if (data.STEP_NO === activeStep + 1) {
        return data;
      }
    });
    console.log("###############currentActiveData", currentActiveData);

    const entryData = activeStep === 0 ? [] : [currentActiveData[0]];

    const formData = new FormData();
    formData.append("id", Id);
    formData.append("action", Action);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("orderId", currentOrderId);
    formData.append("entryData", JSON.stringify(entryData));

    fetch(
      process.env.REACT_APP_SERVER_URL + "/api/fileMovement/saveFileRelease",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => {
        return response;
      })
      .then((data) => {
        if (data) {
          snackbar.showSuccess(
            <Typography> Saved Step Successfully!</Typography>
          );
          getCurrentStep();
        }
      })
      .catch((error) => {
        if (error) {
          snackbar.showError(
            "Error while saving current Step. Please try again!"
          );
        }
      });
  };

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

  const formatDateTime = (dateString, timeString) => {
    const date = new Date(`${dateString}T${timeString}`);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Ensures AM/PM format
    };
    return date.toLocaleString("en-US", options);
  };

  return loading ? (
    <CircularScreenLoader />
  ) : tableData.length > 0 ? (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: "90vh",
        overflowY: "scroll",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        {tableData?.map((tabData, index) => {
          return (
            <Tab
              onClick={() => {
                setCurrentOrderId(tabData.orderId);
              }}
              label={
                <Box
                  sx={{
                    justifyContent: "center",
                    display: "flex",
                    width: "20em",
                    margin: "0.5em",
                    "&.MuiButtonBase-root": {
                      "text-transform": "capitalize",
                    },
                  }}
                >
                  <div style={{ margin: "1em" }}>
                    <div style={{ fontSize: "0.8em" }}>
                      {tabData?.customerName}
                    </div>

                    <div style={{ fontSize: "0.8em" }}>{tabData?.property}</div>

                    <div style={{ fontSize: "1em" }}>{tabData?.building}</div>

                    <div style={{ fontSize: "1em" }}>{tabData?.flatno}</div>
                  </div>
                </Box>
              }
              {...a11yProps(index)}
            />
          );
        })}
      </Tabs>
      <TabPanel>
        <Grid
          container
          spacing={2}
          style={{
            height: "100vh",
            "&.MuiGrid-item": { paddingLeft: "0px" },
            display: "flex",
            flexDirection: "column",
            // marginTop: "1em",
            backgroundColor: "white",
            paddingBottom: "2em",
            alignItems: "flex-start",
            justifyContent: "left",
            border: "1px solid white",
            borderRadius: "18px",
            position: "sticky",
            // top: "4em",
            alignSelf: "flex-start",
          }}
        >
          <Grid item sm={7} md={7} lg={7}>
            <Grid
              style={{
                width: "50vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                fontWeight: "bold",
                marginLeft: "3em  ",
              }}
            >
              {" "}
              File Movement
            </Grid>

            {/* //Stepper */}
            <Box sx={{ maxWidth: 400 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      optional={
                        index === 2 ? (
                          <Typography variant="caption">Last step</Typography>
                        ) : null
                      }
                    >
                      {step.label}
                    </StepLabel>
                    <StepContent>
                      {/* <Typography>{step.description}</Typography> */}
                      {getTabDetails(step.label)}
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <Button
                            variant="contained"
                            onClick={() => {
                              handleNext(index);
                            }}
                            sx={{ mt: 1, mr: 1 }}
                            disabled={shouldButtonDisable(index)}
                          >
                            {index === steps.length - 1 ? "Finish" : "Continue"}
                          </Button>
                          {index === 1 && (
                            <Button
                              disabled={index === 2}
                              onClick={() => {
                                handleSaveChecklist();
                              }}
                              sx={{ mt: 1, mr: 1 }}
                            >
                              Save
                            </Button>
                          )}
                          <Button
                            disabled={index === 0}
                            onClick={() => {
                              handleBack(index);
                            }}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Back
                          </Button>
                          {index === steps.length - 1 && (
                            <Button
                              disabled={index === 0}
                              onClick={() => {
                                handleBackToSales(index);
                              }}
                              sx={{ mt: 1, mr: 1 }}
                            >
                              Back To Sales
                            </Button>
                          )}
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                  <Typography>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                    Reset
                  </Button>
                </Paper>
              )}
            </Box>
          </Grid>

          <Grid item sm={5} md={5} lg={5} sx={{ paddingTop: "0em" }}>
            <Grid
              sx={{
                border: "1px solid gray",
                borderRadius: "1em",
                padding: "0.5em",
              }}
            >
              <FileDetails
                fileUrlReqNo={currentOrderId}
                ref={ref}
                activeStep={activeStep}
              />
            </Grid>

            <Grid
              sx={{
                marginTop: "0.5em",
                border: "1px solid gray",
                borderRadius: "1em",
                padding: "0.5em",
              }}
            >
              <MainContainer>
                <ChatContainer style={{ height: "300px" }}>
                  <></>
                  <MessageList>
                    {messages.map((msg, index) => {
                      // Determine if a MessageSeparator should be rendered
                      const showSeparator =
                        index === 0 || messages[index - 1].erdat !== msg.erdat;

                      return (
                        <React.Fragment key={index}>
                          {showSeparator && (
                            <MessageSeparator
                              content={formatDateTime(msg.erdat, msg.uzeit)}
                            />
                          )}
                          <Message
                            model={{
                              direction: "outgoing",
                              position: "last",
                              message: `~${msg.name}\n${msg.remark}`,
                              sentTime: msg.sentTime,
                              sender: msg.ernam,
                            }}
                          />
                        </React.Fragment>
                      );
                    })}
                  </MessageList>
                  <MessageInput
                    autoFocus
                    attachButton="false"
                    value={newMessage}
                    onSend={handleSend}
                    onChange={(event) => {
                      console.log("##########e.target.value", event);
                      setNewMessage(event);
                    }}
                    placeholder="Type message here"
                  />
                </ChatContainer>
              </MainContainer>
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>
      <CrmModal
        maxWidth="sm"
        show={openFileUpload}
        handleShow={() => {
          setOpenFileUpload(false);
        }}
        SecondaryBtnText="Close"
        secondarySave={() => {
          setOpenFileUpload(false);
        }}
      >
        <FileUploader
          ref={fileRef}
          requestNo={currentOrderId}
          setOpenFileUpload={setOpenFileUpload}
          callBack={saveUrls}
          type={fileUploadType}
          setfileUploadType={setfileUploadType}
          getData={getData}
        />
      </CrmModal>
    </Box>
  ) : (
    <Grid
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <Typography>No Data Available for File Movement!</Typography>
    </Grid>
  );
}