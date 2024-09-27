/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "mui-datatables";
import AgingGraph from "./AgingGraph";
import { useSelector } from "react-redux";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import { Grid, MenuItem, Checkbox, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputField from "../../../components/inputField/InputField";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";

export default function UnitOutstandingAgeing() {
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  const reducerData = useSelector((state) => state);
  // const crmId = reducerData?.dashboard?.crmId;
  const OrderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  // const projectId = reducerData.dashboard.project.projectId;

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiIconButton: {
          styleOverrides: {
            root: {
              variant: "contained",
            },
          },
        },
        MuiSvgIcon: {
          styleOverrides: {
            root: {
              color: "Blue",
            },
          },
        },
        MUIDataTableToolbar: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiTablePagination: {
          styleOverrides: {
            selectLabel: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
            selectIcon: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
            displayedRows: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
            select: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            footer: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MUIDataTableHeadRow: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MUIDataTableHeadCell: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MUIDataTableBodyCell: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              paddingTop: 0,
              paddingBottom: 0,
              lineHeight: "2.2em",
            },
          },
        },
        MuiCheckbox: {
          styleOverrides: {
            root: {
              padding: 0,
            },
          },
        },
      },
    });

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.NAME,
        item?.ARKTX,
        item?.BAL_0_15,
        item?.BAL_15_30,
        item?.BAL_30_60,
        item?.BAL_60_90,
        item?.BAL_90_120,
        item?.BAL_120_150,
        item?.BAL_150_180,
        item?.BAL_180 && GlobalFunctions.getFormatedNumber(item?.BAL_180),
      ];
    });
    return modifiedResponse;
  };

  const getProjectData = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(process.env.REACT_APP_SERVER_URL + "/api/project", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setProjectData(data.ProjectList);
      });
  };

  const handleProjectSelection = (event) => {
    const value = event.target.value;
    setSelectedProjects(typeof value === "string" ? value.split(",") : value);
    console.log(
      "###########selected projects",
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    getProjectData();
    // getData();
  }, []);

  async function getData() {
    const formData = new FormData();
    formData.append("projectId", selectedProjects.toString());
    formData.append("crmId", "");
    formData.append("orderId", OrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    // formData.append("projectId", projectId);

    setLoading(true);

    fetch(process.env.REACT_APP_SERVER_URL + "/api/reports/aging", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setGraphData(modifyResponse(data[0]?.AGING));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  const columns = [
    { name: "Name" },
    { name: "Unit" },
    {
      name: "0-15",
    },
    {
      name: "15-30",
    },
    {
      name: "30-60",
    },
    {
      name: "60-90",
    },
    {
      name: "90-120",
    },
    {
      name: "120-150",
    },
    {
      name: "150-180",
    },
    {
      name: "> 180",
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    print: true,
    download: true,
    search: true,
    viewColumns: true,
    filter: true,
    pagination: false,
  };

  // useEffect(() => {
  //   getData();
  // }, [OrderId, projectId, crmId]);

  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <Grid sx={{ paddingTop: "0.5em" }}>
      <Grid
        container
        spacing={2}
        columnSpacing={2}
        columns={12}
        sx={{
          paddingLeft: "0.5em",
          paddingRight: "0.5em",
          paddingBottom: "0.5em",
          marginTop: "0.5em",
          marginLeft: "0.01em",
          marginRight: "1em",
          backgroundColor: "white",
        }}
      >
        <Grid item xs={4} sm={4} lg={4} md={4}>
          <InputField
            select
            label={"Project"}
            value={selectedProjects}
            onChange={handleProjectSelection}
            SelectProps={{
              multiple: true,
              renderValue: (selected) =>
                selected
                  .map(
                    (id) =>
                      projectData.find((project) => project.projectId === id)
                        ?.name
                  )
                  .join(", "), // Shows project names as comma-separated values
            }}
          >
            <MenuItem value="">
              <em>Select Project</em>
            </MenuItem>

            {projectData?.map((project) => (
              <MenuItem key={project?.projectId} value={project?.projectId}>
                <Checkbox
                  sx={{
                    "&.MuiButtonBase-root": {
                      padding: "0px",
                      paddingRight: "9px",
                    },
                  }}
                  checked={selectedProjects.indexOf(project?.projectId) > -1}
                />
                {project?.name}
              </MenuItem>
            ))}
          </InputField>
        </Grid>
        <Grid item xs={4} sm={4} lg={4} md={4} />
        <Grid
          item
          xs={4}
          sm={4}
          lg={4}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Button
            disabled={selectedProjects?.toString()?.trim()?.length === 0}
            variant="contained"
            onClick={() => {
              // [
              //   "Registration_status",
              //   "Confirmation_status",
              //   "Possession_status",
              // ].map((group) => {
              //   console.log(
              //     "####################status codes",
              //     getSelectedStatusCodes(group)
              //   );
              // });
              // console.log(
              //   "############# selectddata",
              //   selectedProjects,
              //   selectedCrmIds
              // );
              // getSelectedStatusCodes();
              getData();
            }}
          >
            {" "}
            Apply{" "}
          </Button>
        </Grid>
      </Grid>
      <br />

      <Grid
        sx={{
          // width: "48%",
          backgroundColor:
            reducerData.ThemeReducer.mode === "theme-mode-light" ||
            reducerData.ThemeReducer.mode === null
              ? "#ffffff"
              : "#2d2d2d",
          // backgroundColor: "white",
          borderRadius: "0.8em",
          marginBottom: "0.5em",
        }}
      >
        <AgingGraph />
      </Grid>
      {!loading ? (
        <ThemeProvider theme={() => getMuiTheme()}>
          <Table data={graphData} columns={columns} options={options}></Table>
        </ThemeProvider>
      ) : (
        <CircularScreenLoader />
      )}
    </Grid>
  );
}
