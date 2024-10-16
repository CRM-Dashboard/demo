/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AllProjects from "./AllProjects";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnGoingProjects from "./OnGoingProjects";
import CompletedProjects from "./CompletedProjects";
import CommercialProjects from "./CommercialProjects";
import { useDispatch, useSelector } from "react-redux";
import ChildCentricProjects from "./ChildCentricProjects";
import { Grid, Typography, Tooltip, IconButton } from "@mui/material";
import homePageAction from "./HomePageReducer/HomePageAction";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dashboardActions from "../Dashboard/DashboardReducer.js/DashboardActions";

export default function HomePage() {
  const [value, setValue] = React.useState("one");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(dashboardActions.setCrmId(""));
  }, []);

  useEffect(() => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(process.env.REACT_APP_SERVER_URL + "/api/project", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.ProjectList?.length) {
          dispatch(homePageAction.setAllProjects(data?.ProjectList));
        }
      });
  }, [dispatch]);

  const getMuiTheme = () =>
    createTheme({
      MuiTabs: {
        styleOverrides: {
          scroller: {
            display: "flex",
            height: "1.5em",
          },
        },
      },
    });

  return (
    <Grid>
      <ThemeProvider theme={() => getMuiTheme()}>
        <Grid
          container
          sx={{
            paddingTop: "10PX",
            paddingRight: "56px",
          }}
          justifyContent="space-evenly"
          alignItems="center"
          alignContent="center"
        >
          <div>
            {" "}
            <Tooltip title="Change Selected Project">
              <IconButton size="md" sx={{ marginBottom: "0.8em" }}>
                <ArrowBackIcon
                  onClick={() => {
                    navigate("/menus");
                  }}
                />
              </IconButton>
            </Tooltip>{" "}
          </div>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="wrapped label tabs example"
          >
            <Tab
              style={{ fontSize: 15 }}
              value="one"
              label={<Typography>Ongoing Projects</Typography>}
            />
            <Tab
              style={{ fontSize: 15 }}
              value="two"
              label={<Typography>Completed Projects</Typography>}
            />
            <Tab
              style={{ fontSize: 15 }}
              value="three"
              label={<Typography>Child centric Projects</Typography>}
            />
            <Tab
              style={{ fontSize: 15 }}
              value="four"
              label={<Typography>Commercial Projects</Typography>}
            />
            <Tab
              style={{ fontSize: 15 }}
              value="five"
              label={<Typography>All Projects</Typography>}
              wrapped
            />
          </Tabs>
          {/* <div>
            {" "}
            <ApprovalIcon
              onClick={() => {
                navigate("/requestApproval");
              }}
            />
          </div> */}
        </Grid>

        <Grid sx={{ height: "80vh" }}>
          {value === "one" && <OnGoingProjects />}
          {value === "two" && <CompletedProjects />}
          {value === "three" && <ChildCentricProjects />}
          {value === "four" && <CommercialProjects />}
          {value === "five" && <AllProjects />}
        </Grid>
      </ThemeProvider>
    </Grid>
  );
}
