// DashboardItem.tsx
import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DashboardItem = ({
  title,
  imageSrc,
  altText,
  navigateTo,
  isAccessible,
}) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (isAccessible) {
      navigate(navigateTo);
    }
  };

  return (
    <Grid
      item
      onClick={handleNavigation}
      sx={{
        width: "250px",
        height: "320px",
        cursor: isAccessible ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: isAccessible ? "0px 4px 12px rgba(0, 0, 0, 0.1)" : "none",
        borderRadius: "12px",
        padding: "16px",
        backgroundColor: isAccessible ? "#fff" : "#f0f0f0",
        opacity: isAccessible ? 1 : 0.7,
        textAlign: "center",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: isAccessible ? "scale(0.9)" : "none",
        },
      }}
      className={isAccessible ? "" : "non-clickable-grid"}
    >
      <Box
        sx={{
          width: "100%",
          height: "70%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          borderRadius: "8px",
          backgroundColor: "#eee", // Background color to fill any empty space
        }}
      >
        <img
          alt={altText}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // Ensures no empty spaces and consistent fill
          }}
          src={imageSrc}
        />
      </Box>
      <Typography
        sx={{ fontSize: "1.1rem", paddingTop: "0.2em", fontWeight: "bold" }}
      >
        {title}
      </Typography>
    </Grid>
  );
};

export default DashboardItem;
