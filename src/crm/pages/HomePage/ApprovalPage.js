import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Grid } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
import RequestApprovalPage from "./RequestApprovalPage";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function ApprovalPage() {
  const [value, setValue] = React.useState("one");

  // const dispatch = useDispatch();
  // const reducerData = useSelector((state) => state);
  // const passWord = reducerData.LoginReducer.passWord;
  // const userName = reducerData.LoginReducer.userName;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //   useEffect(() => {
  //     fetch(
  //       `http://115.124.113.252:8000/sap/bc/react/crm/project?sap-client=250&sap-user=${userName}&sap-password=${passWord}`
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data?.ProjectList?.length) {
  //           dispatch(homePageAction.setAllProjects(data?.ProjectList));
  //         }
  //       });
  //   }, [dispatch]);

  const getMuiTheme = () =>
    createTheme({
      MuiTabs: {
        styleOverrides: {
          scroller: {
            display: "flex",
            height: "2em",
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
            paddingLeft: "20em",
          }}
          justifyContent="center"
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
              label="Pre-EMI/Rental Approval"
            />
            <Tab
              style={{ fontSize: 15 }}
              value="two"
              label="Cashback Approval"
            />
            <Tab
              style={{ fontSize: 15 }}
              value="three"
              label="Interest WaveOff approval"
            />
            <Tab
              style={{ fontSize: 15 }}
              value="four"
              label="Payment Deviation Approval"
            />
            <Tab
              style={{ fontSize: 15 }}
              value="five"
              label="Cancellation Approval"
              wrapped
            />
          </Tabs>
        </Grid>

        <Grid sx={{ height: "90vh" }}>
          {value === "one" && <RequestApprovalPage />}
          {/* {value === "two" && <CompletedProjects />}
          {value === "three" && <ChildCentricProjects />}
          {value === "four" && <CommercialProjects />}
          {value === "five" && <AllProjects />} */}
        </Grid>
      </ThemeProvider>
    </Grid>
  );
}
