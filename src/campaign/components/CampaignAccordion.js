import React from "react";
import {
  Grid,
  Checkbox,
  MenuItem,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingButton from "@mui/lab/LoadingButton";

import InputField from "../../crm/components/inputField/InputField";

const CampaignAccordion = ({
  projectData = [],
  selectedProjects = [],
  handleProjectSelection = () => {},

  crmData = [],
  selectedCrm = [],
  handleCrmSelection = () => {},

  getTableData = () => {},
  loading = false,
}) => {
  return (
    <>
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
                    value={selectedProjects || []}
                    onChange={handleProjectSelection}
                    SelectProps={{
                      multiple: false,
                      renderValue: (selected) =>
                        selected
                          .map(
                            (id) =>
                              projectData?.find(
                                (project) => project.projectId === id
                              )?.name
                          )
                          .join(", "),
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Project</em>
                    </MenuItem>
                    {projectData?.map((project) => (
                      <MenuItem
                        key={project.projectId}
                        value={project.projectId}
                      >
                        <Checkbox
                          checked={
                            selectedProjects?.indexOf(project.projectId) > -1
                          }
                        />
                        {project.name}
                      </MenuItem>
                    ))}
                  </InputField>
                </Grid>

                <Grid item xs={4}>
                  <InputField
                    select
                    label="CRM"
                    // disabled={!selectedProjects}
                    value={selectedCrm || []}
                    onChange={handleCrmSelection}
                    SelectProps={{
                      multiple: false,
                      renderValue: (selected) =>
                        selected
                          .map(
                            (id) =>
                              crmData?.find((crm) => crm.crmId === id)?.name
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
                          checked={selectedCrm?.indexOf(crm.crmId) > -1}
                        />
                        {crm.name}
                      </MenuItem>
                    ))}
                  </InputField>
                </Grid>

                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <LoadingButton
                    onClick={getTableData}
                    loading={loading}
                    disabled={
                      // selectedProjects?.toString()?.trim()?.length === 0 ||
                      // selectedCrm?.toString()?.trim()?.length === 0 ||
                      loading
                    }
                    loadingPosition="start" // Position of loading spinner ('start', 'center', 'end')
                    // startIcon={<FileUploadIcon //>}
                    variant="contained"
                    // loadingIndicator="Uploading..."
                    style={{
                      padding: "10px 20px",
                      marginLeft: "10px", // Space between buttons
                    }}
                  >
                    Apply
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </>
  );
};

export default CampaignAccordion;
