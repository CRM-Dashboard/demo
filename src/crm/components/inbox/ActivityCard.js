import React from "react";
import { Box, Grid, Typography, Chip, Divider } from "@mui/material";
import { AccessTime, Event, Comment, Work, Person } from "@mui/icons-material";

const ActivityCard = ({ activitydata }) => {
  const {
    activityDes,
    assignedName,
    comments,
    dept,
    dueDt,
    hodDt,
    dueDays,
    priority,
    statTxt,
  } = activitydata;

  return (
    <Box
      sx={{
        // maxWidth: 600,
        margin: "20px auto",
        padding: 4,
        boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
        borderRadius: 4,
        // bgcolor: "#f9f9f9",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {/* <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 1,
          //   textAlign: "center",
          textAlign: "left",
          //   color: "primary.main",
        }}
      >
        {activityDes}
      </Typography> */}
      <Typography
        variant="h6"
        color="textSecondary"
        sx={{
          fontWeight: "bold",
          mb: 1,
          fontSize: "1.2rem",
          //   textAlign: "center",
          textAlign: "left",
          //   color: "primary.main",
        }}
      >
        <strong> {activityDes}</strong>
      </Typography>
      <Divider sx={{ mb: 1 }} />
      {/* Task Information */}
      <Grid container spacing={3}>
        {/* Due Date */}
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center" gap={1}>
            <Event color="primary" />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Due Date:
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {dueDt}
            </Typography>
          </Box>
        </Grid>

        {/* HOD Date */}
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center" gap={1}>
            <Event color="secondary" />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              HOD Date:
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {hodDt}
            </Typography>
          </Box>
        </Grid>

        {/* Due Days */}
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTime color="action" />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Due Days:
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {dueDays}
            </Typography>
          </Box>
        </Grid>

        {/* Department */}
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center" gap={1}>
            <Work color="action" />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Department:
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {dept}
            </Typography>
          </Box>
        </Grid>

        {/* Assignment To */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" gap={1}>
            <Person color="primary" />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Assignment To:
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", ml: 4, mt: 0.5 }}
          >
            {assignedName}
          </Typography>
        </Grid>

        {/* Comments */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" gap={1}>
            <Comment color="action" />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Comments:
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              ml: 4,
              mt: 0.5,
              bgcolor: "#f0f0f0",
              p: 1,
              borderRadius: 2,
            }}
          >
            {comments}
          </Typography>
        </Grid>
      </Grid>
      {/* Divider */}
      <Divider sx={{ my: 3 }} />
      {/* Priority and Status */}
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Chip
            icon={<Work />}
            label={priority}
            sx={{
              fontWeight: "bold",
              bgcolor: "success.light",
              color: "success.dark",
              px: 2,
            }}
          />
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Chip
            label={statTxt}
            color="info"
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              px: 2,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ActivityCard;
