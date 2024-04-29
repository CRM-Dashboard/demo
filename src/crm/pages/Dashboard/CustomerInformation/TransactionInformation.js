import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, Typography, Input, Avatar } from "@mui/material";

export default function TransactionInformation() {
  const titleStyle = {
    "font-weight": "bold",
    "font-size": 14,
    marginLeft: "1.5em",
    marginTop: "0.8em",
  };
  const dataStyle = { "font-size": 14, marginLeft: "1.5em", paddinTop: "1em" };
  const gridStyle = { display: "flex", marginLeft: "-1em", marginTop: "0.5em" };

  const validationSchema = Yup.object().shape({
    pendingUnit: Yup.string().required("Required"),
    pendingGst: Yup.number().required("Required"),
    pendingAmtTimeline: Yup.string().required("Required"),
    registrationDeviation: Yup.string().required("Required"),
    registerTimeline: Yup.string().required("Required"),
    ifSeflFunding: Yup.string().required("Required"),
  });

  const saveBankDetails = () => {
    console.log("#######formik.values", formik.values);
  };

  const formik = useFormik({
    initialValues: {
      pendingUnit: "",
      pendingGst: "",
      pendingAmtTimeline: "",
      registrationDeviation: "",
      registerTimeline: "",
      ifSeflFunding: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // const data = values;
      saveBankDetails();
    },
  });

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
              saveBankDetails();
            }}
          />
        </Avatar>
      </div>

      <Grid container spacing={4} sx={gridStyle}>
        <Grid item xs={4} sm={5} md={5}>
          <Typography style={titleStyle}>
            Pending Unit Amount(Before Registration):
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Input
            id="pendingUnit"
            name="pendingUnit"
            style={dataStyle}
            value={formik?.values?.pendingUnit}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={gridStyle}>
        <Grid item xs={4} sm={5} md={5}>
          <Typography style={titleStyle}>
            {" "}
            Pending GST Amount(Before Registration):
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Input
            id="pendingGst"
            name="pendingGst"
            style={dataStyle}
            value={formik?.values?.pendingGst}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={gridStyle}>
        <Grid item xs={4} sm={5} md={5}>
          <Typography style={titleStyle}>
            {" "}
            Timeline for pending amounts(Before Registration):
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Input
            id="pendingAmtTimeline"
            name="pendingAmtTimeline"
            style={dataStyle}
            value={formik?.values?.pendingAmtTimeline}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={gridStyle}>
        <Grid item xs={4} sm={5} md={5}>
          <Typography style={titleStyle}>Registration Deviation:</Typography>
        </Grid>{" "}
        <Grid item xs={4} sm={4} md={4}>
          <Input
            id="registrationDeviation"
            name="registrationDeviation"
            style={dataStyle}
            value={formik?.values?.registrationDeviation}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={gridStyle}>
        <Grid item xs={4} sm={5} md={5}>
          <Typography style={titleStyle}>Timeline for Registration:</Typography>
        </Grid>{" "}
        <Grid item xs={4} sm={4} md={4}>
          <Input
            id="registerTimeline"
            name="registerTimeline"
            style={dataStyle}
            value={formik?.values?.registerTimeline}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={gridStyle}>
        <Grid item xs={4} sm={5} md={5}>
          <Typography style={titleStyle}>If Self Funding:</Typography>
        </Grid>{" "}
        <Grid item xs={4} sm={4} md={4}>
          <Input
            id="ifSeflFunding"
            name="ifSeflFunding"
            style={dataStyle}
            value={formik?.values?.ifSeflFunding}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
    </>
  );
}
