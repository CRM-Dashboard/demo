import React, { useState } from "react";
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

const CartDetails = ({ collaborator }) => {
  //   if (!collaborator) return null;
  const {
    description,
    comment,
    department,
    assigned: { name, id },
  } = collaborator;

  return (
    <Paper
      sx={{
        position: "absolute",
        top: "70px",
        left: "220px",
        padding: "16px",
        backgroundColor: "#fff",
        boxShadow: 3,
        borderRadius: "8px",
        width: "200px",
        zIndex: 10,
      }}
    >
      <Typography variant="h6">{description}</Typography>
      <Typography variant="body2">{name}</Typography>
      <Typography variant="body2">{department}</Typography>
      {/* You can add cart items or other details here */}
      <Typography variant="body2" color="textSecondary">
        {comment}
      </Typography>
    </Paper>
  );
};

export default CartDetails;
