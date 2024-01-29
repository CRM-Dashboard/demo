import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";

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
        <Grid style={{ display: "flex", height: "80vh" }}>
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
