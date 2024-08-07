/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { Button, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import "react-chat-elements/dist/main.css";
import Typography from "@mui/material/Typography";
import { MessageList, Input } from "react-chat-elements";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";

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

export default function FileMovement() {
  const [response, setResponse] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const reducerData = useSelector((state) => state);
  const crmId = reducerData.dashboard.crmId;
  const OrderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData?.dashboard?.project?.projectId;

  useEffect(() => {
    getTableData();
  }, []);

  const getTableData = () => {
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
          setResponse(data[0].orderdata);

          const nonConfRecords = data[0].orderdata.filter((data) => {
            if (data.confStatus !== "Confirmed") {
              return data;
            }
          });
          setTableData(nonConfRecords);
        }
      });
  };

  const [value, setValue] = React.useState(0);
  const [messages, setMessages] = useState([
    {
      position: "left",
      type: "text",
      text: "Hello, how are you?",
      date: new Date(),
    },
    {
      position: "left",
      type: "text",
      text: "I am fine, thank you!",
      date: new Date(),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        {
          position: "right",
          type: "text",
          text: newMessage,
          date: new Date(),
        },
      ]);
      setNewMessage("");
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: "90vh",
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
            display: "flex",
            height: "80vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item sm={8} md={8} lg={8}>
            <Grid
              style={{
                width: "70vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                fontWeight: "bold",
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
                      <Typography>{step.description}</Typography>
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {index === steps.length - 1 ? "Finish" : "Continue"}
                          </Button>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Back
                          </Button>
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

          <Grid item sm={4} md={4} lg={4}>
            <MessageList
              className="message-list"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={messages}
            />
            <Input
              placeholder="Type here..."
              multiline={false}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rightButtons={<button onClick={handleSend}>Send</button>}
            />
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
}
