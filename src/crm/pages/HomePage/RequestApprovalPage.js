import React, { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import "react-chat-elements/dist/main.css";
import Typography from "@mui/material/Typography";
import { MessageList, Input } from "react-chat-elements";

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

export default function RequestApprovalPage() {
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
        <Tab
          label={
            <Box
              sx={{
                justifyContent: "space-between",
                display: "flex",
                width: "20em",
                "&.MuiButtonBase-root": {
                  "text-transform": "capitalize",
                },
              }}
            >
              <div style={{ margin: "1em" }}>
                <div style={{ fontSize: "1.2em" }}>Pre Emi / Rental</div>
                <br />
                <br />
                <div style={{ fontSize: "1em" }}>04/01/2024</div>
              </div>
              <div style={{ margin: "1em" }}>
                <div style={{ fontSize: "1.2em" }}>1</div>
                <div style={{ fontSize: "0.8em" }}>Day</div>
                <br />
                <div style={{ fontSize: "1em" }}>Pending</div>
              </div>
            </Box>
          }
          {...a11yProps(0)}
        />
        <Tab
          label={
            <Box
              sx={{
                justifyContent: "space-between",
                display: "flex",
                width: "20em",
                "&.MuiButtonBase-root": {
                  "text-transform": "capitalize",
                },
              }}
            >
              <div style={{ margin: "1em" }}>
                <div style={{ fontSize: "1.2em" }}>Pre Emi / Rental</div>
                <br />
                <br />
                <div style={{ fontSize: "1em" }}>04/01/2024</div>
              </div>
              <div style={{ margin: "1em" }}>
                <div style={{ fontSize: "1.2em" }}>1</div>
                <div style={{ fontSize: "0.8em" }}>Day</div>
                <br />
                <div style={{ fontSize: "1em" }}>Pending</div>
              </div>
            </Box>
          }
          {...a11yProps(1)}
        />
        <Tab
          label={
            <Box
              sx={{
                justifyContent: "space-between",
                display: "flex",
                width: "20em",
                "&.MuiButtonBase-root": {
                  "text-transform": "capitalize",
                },
              }}
            >
              <div style={{ margin: "1em" }}>
                <div style={{ fontSize: "1.2em" }}>Pre Emi / Rental</div>
                <br />
                <br />
                <div style={{ fontSize: "1em" }}>04/01/2024</div>
              </div>
              <div style={{ margin: "1em" }}>
                <div style={{ fontSize: "1.2em" }}>1</div>
                <div style={{ fontSize: "0.8em" }}>Day</div>
                <br />
                <div style={{ fontSize: "1em" }}>Pending</div>
              </div>
            </Box>
          }
          {...a11yProps(2)}
        />
        <Tab
          label={
            <Box
              sx={{
                justifyContent: "space-between",
                display: "flex",
                width: "20em",
                "&.MuiButtonBase-root": {
                  "text-transform": "capitalize",
                },
              }}
            >
              <div style={{ margin: "1em" }}>
                <div style={{ fontSize: "1.2em" }}>Pre Emi / Rental</div>
                <br />
                <br />
                <div style={{ fontSize: "1em" }}>04/01/2024</div>
              </div>
              <div style={{ margin: "1em" }}>
                <div style={{ fontSize: "1.2em" }}>1</div>
                <div style={{ fontSize: "0.8em" }}>Day</div>
                <br />
                <div style={{ fontSize: "1em" }}>Pending</div>
              </div>
            </Box>
          }
          {...a11yProps(3)}
        />
        <Tab
          label={
            <Box
              sx={{
                justifyContent: "space-between",
                display: "flex",
                width: "20em",
                "&.MuiButtonBase-root": {
                  "text-transform": "capitalize",
                },
              }}
            >
              <div style={{ margin: "1em" }}>
                <div style={{ fontSize: "1.2em" }}>Pre Emi / Rental</div>
                <br />
                <br />
                <div style={{ fontSize: "1em" }}>04/01/2024</div>
              </div>
              <div style={{ margin: "1em" }}>
                <div style={{ fontSize: "1.2em" }}>1</div>
                <div style={{ fontSize: "0.8em" }}>Day</div>
                <br />
                <div style={{ fontSize: "1em" }}>Pending</div>
              </div>
            </Box>
          }
          {...a11yProps(4)}
        />
        <Tab
          label={
            <Box
              sx={{
                justifyContent: "space-between",
                display: "flex",
                width: "20em",
                "&.MuiButtonBase-root": {
                  "text-transform": "capitalize",
                },
              }}
            >
              <div style={{ margin: "1em" }}>
                <div style={{ fontSize: "1.2em" }}>Pre Emi / Rental</div>
                <br />
                <br />
                <div style={{ fontSize: "1em" }}>04/01/2024</div>
              </div>
              <div style={{ margin: "1em" }}>
                <div style={{ fontSize: "1.2em" }}>1</div>
                <div style={{ fontSize: "0.8em" }}>Day</div>
                <br />
                <div style={{ fontSize: "1em" }}>Pending</div>
              </div>
            </Box>
          }
          {...a11yProps(5)}
        />
        <Tab
          label={
            <Box
              sx={{
                justifyContent: "space-between",
                display: "flex",
                // width: "100vw",
                "&.MuiButtonBase-root": {
                  "text-transform": "capitalize",
                },
              }}
            >
              <div style={{ margin: "1em" }}>
                <div style={{ fontSize: "1.2em" }}>Pre Emi / Rental</div>
                <br />
                <br />
                <div style={{ fontSize: "1em" }}>04/01/2024</div>
              </div>
              <div style={{ margin: "1em" }}>
                <div style={{ fontSize: "1.2em" }}>1</div>
                <div style={{ fontSize: "0.8em" }}>Day</div>
                <br />
                <div style={{ fontSize: "1em" }}>Pending</div>
              </div>
            </Box>
          }
          {...a11yProps(6)}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Grid container spacing={2} style={{ display: "flex", height: "80vh" }}>
          <Grid item sm={8} md={8} lg={8}>
            <Grid
              style={{
                width: "70vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              {" "}
              Pre Emi / Rental{" "}
            </Grid>

            <Grid
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              {" "}
              <Button>Approve</Button>{" "}
            </Grid>
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
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel>
    </Box>
  );
}
