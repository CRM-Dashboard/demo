import React, { useMemo, memo } from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import withTable from "../../../components/TableFilter/withTable";
import ZigzagTable from "../../../components/TableFilter/ZigzagTable";

const HOCTable = withTable(memo(ZigzagTable));

const BirthdayGrid = ({ data }) => {
  // Define slides as an array of objects for cards
  const slides = [
    { title: "Customer Birthdays", data: data?.customerBirthday },
    { title: "Child Birthdays", data: data?.childBirthday },
    { title: "Anniversaries", data: data?.anniversary },
  ];

  // Define table columns dynamically for each slide
  const getColumns = (index) => {
    if (index === 1) {
      // Columns for child birthdays
      return [
        { Header: "Name", accessor: "childName" },
        { Header: "Customer Name", accessor: "customerName" },
        { Header: "Birthday", accessor: "birtdt" },
        {
          Header: "Age",
          accessor: "age",
          Cell: ({ value }) => (value ? `${value} years` : ""),
        },
      ];
    } else if (index === 2) {
      // Columns for anniversaries
      return [
        { Header: "Name", accessor: "name" },
        { Header: "Anniversary Date", accessor: "annivDt" },
        {
          Header: "Age",
          accessor: "age",
          Cell: ({ value }) => (value ? `${value} years` : ""),
        },
      ];
    } else {
      // Default columns
      return [
        { Header: "Name", accessor: "name" },
        { Header: "Birthday Date", accessor: "birtdt" },
        {
          Header: "Age",
          accessor: "age",
          Cell: ({ value }) => (value ? `${value} years` : ""),
        },
      ];
    }
  };

  const getData = (index) => {
    if (index === 1) {
      return slides[index]?.data?.map((item) => ({
        ...item,
        childName: item.childName,
        customerName: item.name || "N/A",
      }));
    } else if (index === 2) {
      return slides[index]?.data?.map((item) => ({
        ...item,
        annivDt: item.annivDt,
      }));
    } else {
      return slides[index]?.data;
    }
  };

  return (
    <Grid container spacing={2}>
      {slides.map((slide, index) => {
        const columns = getColumns(index);
        const tableData = getData(index);

        return (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {slide.title}
                </Typography>
                {tableData?.length === 0 ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    sx={{
                      backgroundColor: "#f9f9f9",
                      borderRadius: "1em",
                      padding: "2em",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#888" }}>
                      No Data Available
                    </Typography>
                  </Box>
                ) : (
                  <HOCTable
                    columns={columns || []}
                    data={tableData || []}
                    select={false}
                    pagination={false}
                    showFilter={false}
                    pageSize={100}
                    maxHeight={300}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default BirthdayGrid;
