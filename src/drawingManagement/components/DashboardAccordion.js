import React, { memo } from "react";
import {
  Grid,
  Button,
  Checkbox,
  MenuItem,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InputField from "../../crm/components/inputField/InputField";

const DashboardAccordion = memo(
  ({
    projectList,
    categoryList,
    locationList,
    stageList,
    selectedProjects,
    selectedCatogoreis,
    selectedStages,
    selectedLocations,
    handleProjectSelection,
    handleLocationSelection,
    handleStageSelection,
    handleCategorySelection,
    getTableData,
    loading,
  }) => {
    return (
      <Grid sx={{ marginTop: "0.5em" }}>
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
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                paddingBottom: "2em",
                alignItems: "left",
                justifyContent: "left",
                border: "1px solid white",
                borderRadius: "18px",
                alignSelf: "flex-start",
              }}
            >
              <Grid
                container
                spacing={2}
                sx={{ paddingLeft: "0.5em", paddingRight: "0.5em" }}
              >
                <Grid item xs={4}>
                  <InputField
                    select
                    label="Project"
                    value={selectedProjects}
                    onChange={handleProjectSelection}
                    SelectProps={{
                      multiple: false,
                      renderValue: (selected) =>
                        selected
                          .map(
                            (id) =>
                              projectList.find(
                                (project) => project.plntGrp === id
                              )?.plntGrpName
                          )
                          .join(", "),
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Project</em>
                    </MenuItem>
                    {projectList?.map((project) => (
                      <MenuItem key={project.plntGrp} value={project.plntGrp}>
                        <Checkbox
                          checked={
                            selectedProjects.indexOf(project.plntGrp) > -1
                          }
                        />
                        {project.plntGrpName}
                      </MenuItem>
                    ))}
                  </InputField>
                </Grid>

                <Grid item xs={4}>
                  <InputField
                    select
                    label="Location"
                    value={selectedLocations}
                    onChange={handleLocationSelection}
                    SelectProps={{
                      multiple: false,
                      renderValue: (selected) =>
                        selected
                          .map(
                            (id) =>
                              locationList.find(
                                (project) => project.building === id
                              )?.building
                          )
                          .join(", "),
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Location</em>
                    </MenuItem>
                    {locationList?.map((project) => (
                      <MenuItem key={project.building} value={project.building}>
                        <Checkbox
                          checked={
                            selectedLocations.indexOf(project.building) > -1
                          }
                        />
                        {project.building}
                      </MenuItem>
                    ))}
                  </InputField>
                </Grid>

                <Grid item xs={4}>
                  <InputField
                    select
                    label="Category"
                    value={selectedCatogoreis}
                    onChange={handleCategorySelection}
                    SelectProps={{
                      multiple: false,
                      renderValue: (selected) =>
                        selected
                          .map(
                            (id) =>
                              categoryList.find(
                                (project) => project.categ === id
                              )?.categTxt
                          )
                          .join(", "),
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Category</em>
                    </MenuItem>
                    {categoryList?.map((project) => (
                      <MenuItem key={project.categ} value={project.categ}>
                        <Checkbox
                          checked={
                            selectedCatogoreis.indexOf(project.categ) > -1
                          }
                        />
                        {project.categTxt}
                      </MenuItem>
                    ))}
                  </InputField>
                </Grid>

                <Grid item xs={4}>
                  <InputField
                    select
                    label="Stage"
                    value={selectedStages}
                    onChange={handleStageSelection}
                    SelectProps={{
                      multiple: false,
                      renderValue: (selected) =>
                        selected
                          .map(
                            (id) =>
                              stageList.find((project) => project.stage === id)
                                ?.stageTxt
                          )
                          .join(", "),
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Stage</em>
                    </MenuItem>
                    {stageList?.map((project) => (
                      <MenuItem key={project.stage} value={project.stage}>
                        <Checkbox
                          checked={selectedStages.indexOf(project.stage) > -1}
                        />
                        {project.stageTxt}
                      </MenuItem>
                    ))}
                  </InputField>
                </Grid>

                {/* <Grid item xs={4}>
                  <InputField
                    select
                    label="CRM"
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
                          .join(", "),
                    }}
                  >
                    <MenuItem value="">
                      <em>Select CRM</em>
                    </MenuItem>
                    {crmData?.map((crm) => (
                      <MenuItem key={crm.crmId} value={crm.crmId}>
                        <Checkbox
                          checked={selectedCrmIds.indexOf(crm.crmId) > -1}
                        />
                        {crm.name}
                      </MenuItem>
                    ))}
                  </InputField>
                </Grid> */}

                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <Button
                    // disabled={
                    //   (selectedCrmIds?.toString()?.trim()?.length === 0 &&
                    //     selectedProjects?.toString()?.trim()?.length === 0) ||
                    //   loading
                    // }
                    variant="contained"
                    onClick={() =>
                      getTableData(
                        selectedProjects,
                        selectedLocations,
                        selectedCatogoreis,
                        selectedStages
                      )
                    }
                  >
                    Apply
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    );
  }
);

export default DashboardAccordion;
