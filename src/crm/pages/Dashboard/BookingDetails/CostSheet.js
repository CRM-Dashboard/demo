/* eslint-disable no-unreachable */
import React, { useState } from "react";
import TableMuiTheme from "./../../../utils/TableMuiTheme";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Grid } from "@mui/material";
import "./Style.css";
import { Typography } from "@mui/material";

export default function CostSheet({ costInfo }) {
  const [tableData, setTableData] = useState([]);

  const reducerData = useSelector((state) => state);
  const getMuiTheme = TableMuiTheme.getMuiTheme(reducerData);

  // const validationSchema = Yup.object().shape({
  //   baseRate: Yup.number().required("Required"),
  //   baseValue: Yup.number().required("Required"),
  //   carParkingValue: Yup.number().required("Required"),
  //   pmc_pmrda: Yup.number().required("Required"),
  //   mseb: Yup.number().required("Required"),
  //   clubCharges: Yup.number().required("Required"),
  //   exclClubCharges: Yup.number().required("Required"),
  //   evPointCharges: Yup.number().required("Required"),
  //   considerationRate: Yup.number().required("Required"),
  //   otherCharges: Yup.number().required("Required"),
  //   gstOtherAmt: Yup.number().required("Required"),
  //   gstOtherpercentage: Yup.number().required("Required"),
  //   allInclusiveRate: Yup.number().required("Required"),
  //   allInclusiveValue: Yup.number().required("Required"),
  //   considerationValue: Yup.number().required("Required"),
  //   gstPercenatge: Yup.number().required("Required"),
  //   gstAmount: Yup.number().required("Required"),
  // });

  // const formik = useFormik({
  //   initialValues: {
  //     baseRate: costInfo?.baseRate ? costInfo?.baseRate : "",
  //     baseValue: costInfo?.baseVal ? costInfo?.baseVal : "",
  //     carParkingValue: costInfo?.car ? costInfo?.car : "",
  //     pmc_pmrda: costInfo?.pmc ? costInfo?.pmc : "",
  //     mseb: costInfo?.mseb ? costInfo?.mseb : "",
  //     clubCharges: costInfo?.club ? costInfo?.club : "",
  //     exclClubCharges: costInfo?.exclub ? costInfo?.exclub : "",
  //     evPointCharges: costInfo?.evpOth ? costInfo?.evpOth : "",
  //     considerationRate: costInfo?.considerationRate
  //       ? costInfo?.considerationRate
  //       : "",
  //     otherCharges: costInfo?.other ? costInfo?.other : "",
  //     gstOtherAmt: costInfo?.gstOther ? costInfo?.gstOther : "",
  //     gstOtherpercentage: costInfo?.gstOtherPer ? costInfo?.gstOtherPer : "",
  //     allInclusiveRate: costInfo?.allIncRate ? costInfo?.allIncRate : "",
  //     allInclusiveValue: costInfo?.allIncVal ? costInfo?.allIncVal : "",
  //     considerationValue: costInfo?.considerationValue
  //       ? costInfo?.considerationValue
  //       : "",
  //     gstPercenatge: costInfo?.gstPer ? costInfo?.gstPer : "",
  //     gstAmount: costInfo?.gst ? costInfo?.gst : "",
  //   },
  //   validationSchema,
  //   onSubmit: (values, { resetForm }) => {
  //     const data = values;
  //     saveCostSheet();
  //   },
  // });

  // const columns = [
  //   {
  //     name: "Milestone",
  //     label: "Milestone",
  //   },
  //   {
  //     name: "Due Date",
  //     label: "Due Date",
  //   },
  //   {
  //     name: "GST Amount",
  //     label: "GST Amount",
  //   },
  //   {
  //     name: "Invoice Date",
  //     label: "Invoice Date",
  //   },
  //   {
  //     name: "Unit Installment",
  //     label: "Unit Installment",
  //   },
  //   {
  //     name: "Terms",
  //     label: "Terms",
  //   },
  //   {
  //     name: "Total Amount",
  //     label: "Total Amount",
  //   },
  // ];

  return (
    <div>
      <div>
        <Grid container spacing={4} sx={{ marginLeft: "0.5em" }}>
          <Grid
            item
            xs={4}
            sm={8}
            md={8}
            sx={{
              display: "flex",
              backgroundColor: "white",
              marginTop: "2em",
            }}
          >
            <table style={{ width: "100%" }}>
              <tr className="mainTitle">
                <th>Data</th>
              </tr>
              <tr>
                <td>Aishwarya Bingewar</td>
              </tr>
              <tr>
                <td> --------- </td>
              </tr>
              <tr>
                <td> --------- </td>
              </tr>
              <tr>
                <td> --------- </td>
              </tr>
            </table>
          </Grid>
          <Grid
            item
            xs={4}
            sm={3}
            md={3}
            sx={{
              display: "flex",
              backgroundColor: "white",
              marginTop: "2em",
            }}
          >
            <table style={{ width: "100%" }}>
              <tr className="mainTitle">
                <th>Data</th>
              </tr>
              <tr>
                <th style={{ height: "6.2em" }}>
                  <Typography style={{ fontWeight: "Bold", fontSize: "20px" }}>
                    {" "}
                    $ 1,20,000
                  </Typography>
                </th>
              </tr>
            </table>
          </Grid>
        </Grid>
      </div>
      <hr class="solid" style={{ margin: "2em", color: "black" }}></hr>
      <div style={{ paddingLeft: "2em", paddingRight: "2em" }}>
        <table style={{ width: "100%" }}>
          <tr className="mainTitle">
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Age</th>
          </tr>
          <tr className="subTitle">
            <th>Personal Info</th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <td>Jill</td>
            <td>Smith</td>
            <td>50</td>
          </tr>
          <tr>
            <td>Eve</td>
            <td>Jackson</td>
            <td>94</td>
          </tr>
          <tr>
            <td>Eve</td>
            <td>Jackson</td>
            <td>94</td>
          </tr>

          <tr className="subTitle">
            <th>Personal Info</th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <td>Jill</td>
            <td>Smith</td>
            <td>50</td>
          </tr>
          <tr>
            <td>Eve</td>
            <td>Jackson</td>
            <td>94</td>
          </tr>
          <tr>
            <td>Eve</td>
            <td>Jackson</td>
            <td>94</td>
          </tr>
        </table>
      </div>
    </div>
  );
}
