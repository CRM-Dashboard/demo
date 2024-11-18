import { Box, Typography, Grid } from "@mui/material";
import DonutChartWrapper from "./DonutChartWrapper";

const SurveyAnalysis = ({ surveyData }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{ textAlign: "center", mb: 3 }}
      >
        {surveyData && surveyData.length > 0 ? "Survey Analysis" : ""}
      </Typography>

      <Grid container spacing={3}>
        {surveyData?.map(({ questionId, responses, analyse }) => (
          <Grid item xs={12} sm={6} md={4} key={questionId}>
            <DonutChartWrapper
              data={responses}
              dataKey="responseCnt"
              nameKey="response"
              chartTitle={analyse}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SurveyAnalysis;
