import React, { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, Typography, Input, Avatar } from "@mui/material";

export default function UnitDetails({ unitDetails }) {
  const validationSchema = Yup.object().shape({
    projectName: Yup.string().required("Required"),
    property: Yup.string().required("Required"),
    building: Yup.string().required("Required"),
    floorNumber: Yup.string().required("Required"),
    flatNumber: Yup.string().required("Required"),
    propertyType: Yup.string().required("Required"),
    saleableArea: Yup.number().required("Required"),
    carpetArea: Yup.number().required("Required"),
    reraCarpetArea: Yup.number().required("Required"),
  });

  const saveCostSheet = () => {
    console.log("#######formik.values", formik.values);
  };

  const formik = useFormik({
    initialValues: {
      projectName: unitDetails?.project ? unitDetails?.project : "",
      property: unitDetails?.class ? unitDetails?.class : "",
      building: unitDetails?.building ? unitDetails?.building : "",
      floorNumber: unitDetails?.floor ? unitDetails?.floor : "",
      flatNumber: unitDetails?.flatno ? unitDetails?.flatno : "",
      propertyType: unitDetails?.property ? unitDetails?.property : "",
      saleableArea: unitDetails?.area ? unitDetails?.area : "",
      carpetArea: unitDetails?.carea ? unitDetails?.carea : "",
      reraCarpetArea: unitDetails?.reraCarpetArea
        ? unitDetails?.reraCarpetArea
        : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      saveCostSheet();
    },
  });

  const titleStyle = {
    "font-weight": "bold",
    "font-size": 14,
    marginLeft: "1em",
    paddinTop: "1em",
    width: "10em",
  };
  const dataStyle = { "font-size": 14, marginLeft: "1em" };
  const gridStyle = { display: "flex", marginLeft: "-1em" };

  useEffect(() => {
    console.log("######unitDetails", unitDetails);
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "2em",
        }}
      >
        <Avatar sx={{ cursor: "pointer" }}>
          <EditIcon
            onClick={() => {
              saveCostSheet();
            }}
          />
        </Avatar>
      </div>

      <Grid
        container
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          paddingLeft: "3em",
          paddingBottom: "4em",
        }}
      >
        {/* <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Project Name: </Typography>
            <Input
              id="projectName"
              name="projectName"
              style={dataStyle}
              value={formik?.values?.projectName}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Property:</Typography>
            <Input
              id="property"
              name="property"
              style={dataStyle}
              value={formik?.values?.property}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Building:</Typography>
            <Input
              id="building"
              name="building"
              style={dataStyle}
              value={formik?.values?.building}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Floor Number:</Typography>
            <Input
              id="floorNumber"
              name="floorNumber"
              style={dataStyle}
              value={formik?.values?.floorNumber}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Flat / Unit Number:</Typography>
            <Input
              id="flatNumber"
              name="flatNumber"
              style={dataStyle}
              value={formik?.values?.flatNumber}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Configuration:</Typography>
            <Input
              id="propertyType"
              name="propertyType"
              style={dataStyle}
              value={formik?.values?.propertyType}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Saleable Area:</Typography>
            <Input
              id="saleableArea"
              name="saleableArea"
              style={dataStyle}
              value={formik?.values?.saleableArea}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Carpet Area:</Typography>
            <Input
              id="carpetArea"
              name="carpetArea"
              style={dataStyle}
              value={formik?.values?.carpetArea}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <Typography style={titleStyle}>Rera Carpet Area:</Typography>
            <Input
              id="reraCarpetArea"
              name="reraCarpetArea"
              style={dataStyle}
              value={formik?.values?.reraCarpetArea}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid> */}

        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <div className="d-flex mb-1">
              <div className="mr-3">
                <Typography style={titleStyle}>Project Name: </Typography>
              </div>
              <div>
                <Typography style={{ width: "15em" }}>
                  {formik?.values?.projectName}
                </Typography>
              </div>
            </div>

            <div className="d-flex mb-1">
              <div className="mr-3">
                <Typography style={titleStyle}>Property:</Typography>
              </div>
              <div>
                <Typography>{formik?.values?.property}</Typography>
              </div>
            </div>

            <div className="d-flex mb-1">
              <div className="mr-3">
                <Typography style={titleStyle}>Building:</Typography>
              </div>
              <div>
                <Typography> {formik?.values?.building} </Typography>
              </div>
            </div>

            <div className="d-flex mb-1">
              <div className="mr-3">
                <Typography style={titleStyle}>Flat / Unit Number: </Typography>
              </div>
              <div>
                <Typography style={{ width: "15em" }}>
                  {formik?.values?.flatNumber}
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={gridStyle}>
          <Grid item xs={4} sm={3} md={3}>
            <div className="d-flex mb-1">
              <div className="mr-3">
                <Typography style={titleStyle}>Configuration:</Typography>
              </div>
              <div>
                <Typography>{formik?.values?.propertyType}</Typography>
              </div>
            </div>

            <div className="d-flex mb-1">
              <div className="mr-3">
                <Typography style={titleStyle}>Floor Number:</Typography>
              </div>
              <div>
                <Typography> {formik?.values?.floorNumber} </Typography>
              </div>
            </div>

            <div className="d-flex mb-1">
              <div className="mr-3">
                <Typography style={titleStyle}>Saleable Area:</Typography>
              </div>
              <div>
                <Typography>{formik?.values?.saleableArea}</Typography>
              </div>
            </div>

            <div className="d-flex mb-1">
              <div className="mr-3">
                <Typography style={titleStyle}>Carpet Area:</Typography>
              </div>
              <div>
                <Typography>{formik?.values?.carpetArea}</Typography>
              </div>
            </div>

            <div className="d-flex mb-1">
              <div className="mr-3">
                <Typography style={titleStyle}>Rera Carpet Area:</Typography>
              </div>
              <div>
                <Typography>{formik?.values?.reraCarpetArea}</Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
