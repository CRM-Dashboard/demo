/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Grid } from "@mui/material";
import AllProjects from "./AllProjects";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OnGoingProjects from "./OnGoingProjects";
import CompletedProjects from "./CompletedProjects";
import CommercialProjects from "./CommercialProjects";
import ChildCentricProjects from "./ChildCentricProjects";
import homePageAction from "./HomePageReducer/HomePageAction";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function HomePage() {
  const [value, setValue] = React.useState("one");

  const dispatch = useDispatch();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
          <div></div>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="wrapped label tabs example"
          >
            <Tab
              style={{ fontSize: 15 }}
              value="one"
              label="Ongoing Projects"
            />
            <Tab
              style={{ fontSize: 15 }}
              value="two"
              label="Completed Projects"
            />
            <Tab
              style={{ fontSize: 15 }}
              value="three"
              label="Child centric Projects"
            />
            <Tab
              style={{ fontSize: 15 }}
              value="four"
              label="Commercial Projects"
            />
            <Tab
              style={{ fontSize: 15 }}
              value="five"
              label="All Projects"
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
