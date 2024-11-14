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

const SurveyAccordion = ({
  surveyData = [],
  selectedSurvey = [],
  handleSurveySelection = () => {},

  getTableData = () => {},
  loading = false,
}) => {
  return (
    <>
      <Grid sx={{ marginTop: "0.5em" }}>
        <Accordion defaultExpanded>
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
                    label="Survey"
                    value={selectedSurvey || []}
                    onChange={handleSurveySelection}
                    SelectProps={{
                      multiple: false,
                      renderValue: (selected) =>
                        selected
                          .map(
                            (id) =>
                              surveyData?.find(
                                (survey) => survey.surveyId === id
                              )?.surveyTitle
                          )
                          .join(", "),
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Survey</em>
                    </MenuItem>
                    {surveyData?.map((survey) => (
                      <MenuItem key={survey.surveyId} value={survey.surveyId}>
                        <Checkbox
                          checked={
                            selectedSurvey?.indexOf(survey.surveyId) > -1
                          }
                        />
                        {survey.surveyTitle}
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
                      // selectedSurvey?.toString()?.trim()?.length === 0 ||
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

export default SurveyAccordion;
