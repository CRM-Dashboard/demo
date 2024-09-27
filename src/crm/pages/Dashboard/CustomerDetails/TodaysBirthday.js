import React, { useState, forwardRef } from "react";
import { Box, IconButton, Card, CardContent } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";

const BirthdaySlider = forwardRef((props, ref) => {
  const [index, setIndex] = useState(0);

  const slides = [
    { title: "Customer Birthdays", data: props?.data?.customerBirthday },
    { title: "Child Birthdays", data: props?.data?.childBirthday },
    { title: "Anniversaries", data: props?.data?.anniversary },
  ];

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  // Define columns for different slides
  const getColumns = () => {
    if (index === 1) {
      // Add "Customer Name" column for children's birthdays
      return [
        {
          name: "",
          label: "",
          options: {
            customBodyRender: () => (
              <img
                src={require("../../../../assets/BaloonsImg.jfif")} // Replace this with your actual image source
                alt="Avatar"
                style={{ height: "30px", width: "30px", borderRadius: "50%" }}
              />
            ),
          },
        },
        {
          name: "name",
          label: "Name",
        },
        {
          name: "customerName",
          label: "Customer Name",
        },
        {
          name: "birtdt",
          label: "Birthday / Anniversary Date",
          options: {
            customBodyRender: (value, tableMeta) => {
              return value ? value : tableMeta.rowData[2]; // annivDt is assumed to be at index 2 if provided
            },
          },
        },
        {
          name: "age",
          label: "Age",
          options: {
            customBodyRender: (value) => (value ? `${value} years` : ""),
          },
        },
      ];
    } else {
      // Default columns
      return [
        {
          name: "",
          label: "",
          options: {
            customBodyRender: () => (
              <img
                src={require("../../../../assets/BaloonsImg.jfif")} // Replace this with your actual image source
                alt="Avatar"
                style={{ height: "30px", width: "30px", borderRadius: "50%" }}
              />
            ),
          },
        },
        {
          name: "name",
          label: "Name",
        },
        {
          name: "birtdt",
          label: "Birthday / Anniversary Date",
          options: {
            customBodyRender: (value, tableMeta) => {
              return value ? value : tableMeta.rowData[2]; // annivDt is assumed to be at index 2 if provided
            },
          },
        },
        {
          name: "age",
          label: "Age",
          options: {
            customBodyRender: (value) => (value ? `${value} years` : ""),
          },
        },
      ];
    }
  };

  // Define data processing for different slides
  const getData = () => {
    if (index === 1) {
      // Process data for children's birthdays
      return slides[index]?.data?.map((item) => ({
        ...item,
        name: item.childName,
        customerName: item.name || "N/A", // Assuming `customerName` exists for index 1
      }));
    } else if (index === 2) {
      // Process data for children's birthdays
      return slides[index]?.data?.map((item) => ({
        ...item,
        birtdt: item.annivDt,
      }));
    } else {
      // Default data processing
      return slides[index]?.data;
    }
  };

  const options = {
    selectableRows: "none", // Disables row selection
    responsive: "standard",
    pagination: false,
    print: false,
    download: false,
    search: false,
    viewColumns: false,
    filter: false,
  };

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiToolbar: {
          styleOverrides: {
            root: {
              minHeight: "32px",
            },
          },
        },
        MUIDataTableBodyCell: {
          styleOverrides: {
            root: {
              paddingTop: "0.2em",
              paddingBottom: "0.2em",
              fontSize: "0.7rem",
            },
          },
        },
        MuiTypography: {
          styleOverrides: {
            root: {
              fontSize: "1rem",
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              padding: "2px",
            },
          },
        },
        MUIDataTableHeadCell: {
          styleOverrides: {
            data: {
              fontSize: "0.8rem",
              fontWeight: "bold",
            },
          },
        },
      },
    });

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      {/* Left arrow */}
      <IconButton onClick={handlePrev}>
        <ArrowBackIos />
      </IconButton>

      {/* Slide content */}
      <Card sx={{ width: "50em" }}>
        <CardContent>
          {/* Render Data Table */}
          {slides[index].data?.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <img
                alt="Gera"
                style={{ height: "12em", width: "12em", borderRadius: "8em" }}
                src={require("../../../../assets/BirthdayImage.jpg")}
              />
            </Box>
          ) : (
            <ThemeProvider theme={() => getMuiTheme()}>
              <MUIDataTable
                title={slides[index].title}
                data={getData()}
                columns={getColumns()}
                options={options}
              />
            </ThemeProvider>
          )}
        </CardContent>
      </Card>

      {/* Right arrow */}
      <IconButton onClick={handleNext}>
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
});

export default BirthdaySlider;
