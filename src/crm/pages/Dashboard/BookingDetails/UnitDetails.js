/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Grid, Typography, Avatar } from "@mui/material";

export default function UnitDetails({ unitDetails }) {
  const [unitData, setUnitData] = useState("");

  const reducerData = useSelector((state) => state);
  const OrderId = reducerData?.searchBar?.orderId;

  useEffect(() => {
    if (OrderId) {
      fetch(`/sap/bc/react/crm/so?sap-client=250&vbeln=${OrderId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data[0].vbeln) {
            setUnitData(data[0]);
          }
        });
    }
  }, [OrderId]);

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
      projectName: unitData?.project ? unitData?.project : "",
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
  const dataStyle = { width: "20em", "font-size": 14 };
  const gridStyle = { display: "flex", marginLeft: "-1em" };

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
          "&.MuiGrid-root": { marginLeft: "-2em" },
          marginleft: "3em",
          marginRight: "10em",
          paddingLeft: "3em",
          paddingTop: "1em",
          paddingBottom: "1em",
        }}
      >
        <Grid
          sx={{
            border: "1px solid #AFAAA0",
            boxShadow: "10px 10px 5px lightblue",
            backgroundColor: "#FFFFFF",
            borderRadius: "1em",
            padding: "1em",
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={4} sm={3} md={3}>
              <div style={gridStyle}>
                <div className="mr-3">
                  <Typography style={titleStyle}>Project Name: </Typography>
                </div>
                <div>
                  <Typography style={dataStyle}>
                    {formik?.values?.projectName}
                  </Typography>
                </div>
              </div>

              <div style={gridStyle}>
                <div className="mr-3">
                  <Typography style={titleStyle}>Property:</Typography>
                </div>
                <div>
                  <Typography style={dataStyle}>
                    {formik?.values?.property}
                  </Typography>
                </div>
              </div>

              <div style={gridStyle}>
                <div className="mr-3">
                  <Typography style={titleStyle}>Building:</Typography>
                </div>
                <div>
                  <Typography style={dataStyle}>
                    {" "}
                    {formik?.values?.building}{" "}
                  </Typography>
                </div>
              </div>

              <div style={gridStyle}>
                <div className="mr-3">
                  <Typography style={titleStyle}>
                    Flat / Unit Number:{" "}
                  </Typography>
                </div>
                <div>
                  <Typography style={dataStyle}>
                    {formik?.values?.flatNumber}
                  </Typography>
                </div>
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={4} sm={3} md={3}>
              <div style={gridStyle}>
                <div className="mr-3">
                  <Typography style={titleStyle}>Configuration:</Typography>
                </div>
                <div>
                  <Typography style={dataStyle}>
                    {formik?.values?.propertyType}
                  </Typography>
                </div>
              </div>

              <div className="d-flex mb-1" style={gridStyle}>
                <div className="mr-3">
                  <Typography style={titleStyle}>Floor Number:</Typography>
                </div>
                <div>
                  <Typography style={dataStyle}>
                    {" "}
                    {formik?.values?.floorNumber}{" "}
                  </Typography>
                </div>
              </div>

              <div className="d-flex mb-1" style={gridStyle}>
                <div className="mr-3">
                  <Typography style={titleStyle}>Saleable Area:</Typography>
                </div>
                <div>
                  <Typography style={dataStyle}>
                    {formik?.values?.saleableArea}
                  </Typography>
                </div>
              </div>

              <div style={gridStyle}>
                <div className="mr-3">
                  <Typography style={titleStyle}>Carpet Area:</Typography>
                </div>
                <div>
                  <Typography style={dataStyle}>
                    {formik?.values?.carpetArea}
                  </Typography>
                </div>
              </div>

              <div style={gridStyle}>
                <div className="mr-3">
                  <Typography style={titleStyle}>Rera Carpet Area:</Typography>
                </div>
                <div>
                  <Typography style={dataStyle}>
                    {formik?.values?.reraCarpetArea}
                  </Typography>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
