import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Box, Typography, Paper } from "@mui/material";

const DonutChartWrapper = ({
  data,
  chartTitle,
  dataKey,
  nameKey,
  width = 350,
  height = 350,
}) => {
  const totalValue = data.reduce((sum, entry) => sum + entry[dataKey], 0);

  const [colors, setColors] = useState([]);

  useEffect(() => {
    // Generate dynamic colors based on the number of items in the data
    const colorPalette = [
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#FF8042", // You can expand this palette
      "#FF0000",
      "#00FFFF",
      "#800080",
      "#FFFF00",
      "#FF5733",
      "#C70039",
      "#900C3F",
      "#581845",
    ];

    // Assign colors dynamically, looping over the color palette if necessary
    const dynamicColors = data.map(
      (_, index) => colorPalette[index % colorPalette.length]
    );
    setColors(dynamicColors);
  }, [data]);

  // Function to render label showing both value and percentage
  const renderLabel = ({ value }) => {
    const percentage = (value / totalValue) * 100; // Use the percentage directly from the data
    return `${value.toFixed(0)} (${percentage?.toFixed(1)}%)`; // Display value and percentage
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
        }}
      >
        <Typography sx={{ mb: 1, fontWeight: "bold", fontSize: "12" }}>
          {chartTitle}
        </Typography>
        <PieChart width={width} height={height}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey={dataKey}
            nameKey={nameKey}
            label={renderLabel} // Use the renderLabel function to show value and percentage
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Paper>
    </Box>
  );
};

export default DonutChartWrapper;
