import React from "react";
import DonutChartWrapper from "./DonutChartWrapper";
import { Grid, Box, Typography } from "@mui/material";
export const surveyData = [
  {
    questionId: 1,
    analyse: "Ease of getting in touch with the CRM team when needed",
    responses: [
      {
        response: "Very Difficult",
        responseCnt: 1,
        responsePer: 11.11,
      },
      {
        response: "Easy",
        responseCnt: 2,
        responsePer: 22.22,
      },
      {
        response: "Very Easy",
        responseCnt: 3,
        responsePer: 33.33,
      },
      {
        response: "Neutral",
        responseCnt: 2,
        responsePer: 22.22,
      },
      {
        response: "Difficult",
        responseCnt: 1,
        responsePer: 11.11,
      },
    ],
  },
  {
    questionId: 2,
    analyse: "Timeliness of responses from the CRM team",
    responses: [
      {
        response: "Delayed",
        responseCnt: 2,
        responsePer: 22.22,
      },
      {
        response: "Timely",
        responseCnt: 2,
        responsePer: 22.22,
      },
      {
        response: "Very Timely",
        responseCnt: 3,
        responsePer: 33.33,
      },
      {
        response: "Very Delayed",
        responseCnt: 1,
        responsePer: 11.11,
      },
      {
        response: "Neutral",
        responseCnt: 1,
        responsePer: 11.11,
      },
    ],
  },
  {
    questionId: 3,
    analyse: "Professionalism and courtesy of the CRM team members",
    responses: [
      {
        response: "Excellent",
        responseCnt: 2,
        responsePer: 22.22,
      },
      {
        response: "Very Poor",
        responseCnt: 1,
        responsePer: 11.11,
      },
      {
        response: "Poor",
        responseCnt: 1,
        responsePer: 11.11,
      },
      {
        response: "Good",
        responseCnt: 2,
        responsePer: 22.22,
      },
      {
        response: "Fair",
        responseCnt: 3,
        responsePer: 33.33,
      },
    ],
  },
  {
    questionId: 4,
    analyse:
      "Explain the benefits of our referral program and loyalty benefits",
    responses: [
      {
        response: "Yes, it was explained",
        responseCnt: 4,
        responsePer: 44.44,
      },
      {
        response: "No, it was not explained",
        responseCnt: 3,
        responsePer: 33.33,
      },
      {
        response: "Yes, but the explanation was unclear",
        responseCnt: 2,
        responsePer: 22.22,
      },
    ],
  },
  {
    questionId: 5,
    analyse:
      "Knowledge and ability of the CRM team to resolve your issue or inquiry",
    responses: [
      {
        response: "Poor",
        responseCnt: 1,
        responsePer: 11.11,
      },
      {
        response: "Good",
        responseCnt: 2,
        responsePer: 22.22,
      },
      {
        response: "Excellent",
        responseCnt: 3,
        responsePer: 33.33,
      },
      {
        response: "Fair",
        responseCnt: 1,
        responsePer: 11.11,
      },
      {
        response: "Very Poor",
        responseCnt: 2,
        responsePer: 22.22,
      },
    ],
  },
  {
    questionId: 6,
    analyse: "Overall satisfaction with your experience with the CRM team",
    responses: [
      {
        response: "Very Dissatisfied",
        responseCnt: 2,
        responsePer: 22.22,
      },
      {
        response: "Neutral",
        responseCnt: 3,
        responsePer: 33.33,
      },
      {
        response: "Very Satisfied",
        responseCnt: 3,
        responsePer: 33.33,
      },
      {
        response: "Satisfied",
        responseCnt: 1,
        responsePer: 11.11,
      },
    ],
  },
  {
    questionId: 7,
    analyse: "Comments",
    responses: [
      {
        response: "good",
        responseCnt: 4,
        responsePer: 44.44,
      },
      {
        response: "poor",
        responseCnt: 3,
        responsePer: 33.33,
      },
      {
        response: "average",
        responseCnt: 1,
        responsePer: 11.11,
      },
    ],
  },
];

const Testing = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{ textAlign: "center", mb: 3 }}
      >
        Survey Analysis
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

export default Testing;
