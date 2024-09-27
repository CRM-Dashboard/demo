/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Grid, Button, Checkbox, MenuItem, Typography } from "@mui/material";
import Booking from "./Booking";

import Accordion from "@mui/material/Accordion";
import { useSelector } from "react-redux";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import InputField from "../../../../../components/inputField/InputField";
import CircularScreenLoader from "../../../../../components/circularScreenLoader/CircularScreenLoader";

export default function BookingData() {
  const reducerData = useSelector((state) => state);
  const crmId = reducerData.dashboard.crmId;
  const OrderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  // const projectId = reducerData?.dashboard?.project?.projectId;
  const bookingsFilters = reducerData?.BookingReducer?.BookingsDetailsFilter;

  const [crmData, setCrmData] = useState([]);
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [selectedCrmIds, setSelectedCrmIds] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  const getFilteredData = (data) => {
    const {
      Registration_status,
      Confirmation_status,
      Possession_status,
      Building,
      Unit_Number,
      Property_type,
      CrmData,
    } = bookingsFilters;

    if (
      Registration_status?.length === 0 &&
      Confirmation_status?.length === 0 &&
      Possession_status?.length === 0 &&
      CrmData?.length === 0 &&
      !Building &&
      !Unit_Number &&
      !Property_type
    ) {
      return response;
    }

    // Helper function to check if a filter group has mutually exclusive selections
    const hasMutuallyExclusiveSelections = (filterGroup) => {
      return filterGroup?.length > 1;
    };

    // Check if there are mutually exclusive selections in Registration_status
    if (hasMutuallyExclusiveSelections(Registration_status)) {
      return [];
    }

    // Check if there are mutually exclusive selections in Confirmation_status
    if (hasMutuallyExclusiveSelections(Confirmation_status)) {
      return [];
    }

    // Check if there are mutually exclusive selections in Possession_status
    if (hasMutuallyExclusiveSelections(Possession_status)) {
      return [];
    }

    let filteredData = data;

    if (Registration_status?.length > 0) {
      filteredData = filteredData.filter((item) =>
        Registration_status.includes(item.regStatus)
      );
    }

    if (Confirmation_status?.length > 0) {
      filteredData = filteredData.filter((item) =>
        Confirmation_status.includes(item.confStatus)
      );
    }

    if (Possession_status?.length > 0) {
      filteredData = filteredData.filter((item) =>
        Possession_status.includes(item.possStatus)
      );
    }

    if (CrmData?.length > 0) {
      filteredData = filteredData.filter((item) => item.crmid === CrmData);
    }

    if (Building) {
      filteredData = filteredData.filter((item) => item.building === Building);
    }

    if (Unit_Number) {
      filteredData = filteredData.filter((item) => item.flatno === Unit_Number);
    }

    if (Property_type) {
      filteredData = filteredData.filter(
        (item) => item.property === Property_type
      );
    }

    setTableData(filteredData);

    return filteredData;
  };

  const getTableData = () => {
    const formData = new FormData();

    formData.append("orderId", OrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    crmId
      ? formData.append("crmId", crmId)
      : formData.append("crmIds", selectedCrmIds.toString());
    formData.append("projectIds", selectedProjects.toString());
    // formData.append("projectId", projectId);

    setLoading(true);

    fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/so_list", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setResponse(data[0].orderdata);
          setTableData(data[0].orderdata);
          // getUniqueStatuses(data[0].orderdata);
          setLoading(false);
        }
      });
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

  const getCrmDetails = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("crmId", userName);

    fetch(process.env.REACT_APP_SERVER_URL + `/api/dashboard/getCrmManager`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.length > 0) {
          setCrmData(data);
        }
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

  const handleCrmSelection = (event) => {
    const value = event.target.value;
    setSelectedCrmIds(typeof value === "string" ? value.split(",") : value);
    console.log(
      "###########selected crms",
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    getTableData();
  }, [crmId]);

  useEffect(() => {
    // getTableData();
    getCrmDetails();
    getProjectData();
  }, []);

  // useEffect(() => {
  //   dispatch(BookingAction.setBookingDetailsFilter(selectedItems));
  //   console.log("Selected Items:", selectedItems);
  // }, [selectedItems]);

  return !loading ? (
    <>
      <Grid sx={{ marginTop: "0.5em" }}>
        {/* <Grid container columns={12} columnSpacing={1}> */}

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography sx={{ fontWeight: "bold", fontSize: "0.9em" }}>
              Filters
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid
              sx={{
                "&.MuiGrid-item": { paddingLeft: "0px" },
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                paddingBottom: "2em",
                alignItems: "left",
                justifyContent: "left",
                height: "20%",
                border: "1px solid white",
                borderRadius: "18px",
                // position: "sticky",
                alignSelf: "flex-start",
              }}
            >
              {/* Dropdowns */}
              <Grid
                container
                spacing={2}
                columnSpacing={2}
                columns={12}
                sx={{ paddingLeft: "0.5em", paddingRight: "0.5em" }}
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
                              projectData.find(
                                (project) => project.projectId === id
                              )?.name
                          )
                          .join(", "), // Shows project names as comma-separated values
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Project</em>
                    </MenuItem>

                    {projectData?.map((project) => (
                      <MenuItem
                        key={project?.projectId}
                        value={project?.projectId}
                      >
                        <Checkbox
                          sx={{
                            "&.MuiButtonBase-root": {
                              padding: "0px",
                              paddingRight: "9px",
                            },
                          }}
                          checked={
                            selectedProjects.indexOf(project?.projectId) > -1
                          }
                        />
                        {project?.name}
                      </MenuItem>
                    ))}
                  </InputField>
                </Grid>

                <Grid item xs={4} sm={4} lg={4} md={4}>
                  <InputField
                    select
                    label={"CRM"}
                    value={selectedCrmIds}
                    onChange={handleCrmSelection}
                    SelectProps={{
                      multiple: true,
                      renderValue: (selected) =>
                        selected
                          .map(
                            (id) =>
                              crmData.find((crm) => crm.crmId === id)?.name
                          )
                          .join(", "), // Shows CRM names as comma-separated values
                    }}
                  >
                    <MenuItem value="">
                      <em>Select CRM</em>
                    </MenuItem>

                    {crmData?.map((crm) => (
                      <MenuItem key={crm.crmId} value={crm.crmId}>
                        <Checkbox
                          sx={{
                            "&.MuiButtonBase-root": {
                              padding: "0px",
                              paddingRight: "9px",
                            },
                          }}
                          checked={selectedCrmIds.indexOf(crm.crmId) > -1}
                        />
                        {crm.name}
                      </MenuItem>
                    ))}
                  </InputField>
                </Grid>

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
                    disabled={
                      selectedCrmIds?.toString()?.trim()?.length === 0 &&
                      selectedProjects?.toString()?.trim()?.length === 0
                    }
                    variant="contained"
                    onClick={() => {
                      getTableData();
                    }}
                  >
                    {" "}
                    Apply{" "}
                  </Button>
                </Grid>
              </Grid>
              <br />
              <>
                <Grid
                  container
                  spacing={2}
                  columnSpacing={2}
                  sx={{ paddingLeft: "0.5em", paddingRight: "0.5em" }}
                ></Grid>
              </>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid sx={{ marginTop: "0.5em" }}>
        {/* <CustomTabLayout tabPanels={tabs} /> */}
        <Booking
          tableDetails={tableData}
          response={response}
          getFilteredData={getFilteredData}
        />
      </Grid>
    </>
  ) : (
    // </Grid>
    <CircularScreenLoader />
  );
}
