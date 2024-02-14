/* eslint-disable no-unreachable */
import React from "react";
import "./Style.css";
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";

export default function CostSheet({ costInfo }) {
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
                <th colSpan={2}>Order/ Booking Summary </th>
              </tr>

              <tr>
                <td>{costInfo.maktx ? costInfo.maktx : "--"}</td>
                <td>{costInfo.unitValue}</td>
              </tr>

              <tr>
                <td>{costInfo.maktxPrk ? costInfo.maktxPrk : "--"}</td>
                <td>{costInfo.car}</td>
              </tr>

              <tr>
                <td>{costInfo.maktxAdmin ? costInfo.maktxAdmin : "--"}</td>
                <td>{costInfo.adminValue}</td>
              </tr>

              <tr>
                <td>{costInfo.maktxEv ? costInfo.maktxEv : "--"}</td>
                <td style={{ marginRight: "0" }}>{costInfo.evValue}</td>
              </tr>

              <tr>
                <td></td>
                <td>
                  <label style={{ fontWeight: "bold", marginLeft: "-3em" }}>
                    {" "}
                    Total :{" "}
                  </label>{" "}
                  {costInfo.allIncVal}
                </td>
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
                <th>Consideration / Agreement Value</th>
              </tr>
              <tr>
                <th style={{ height: "6.2em" }}>
                  <Typography style={{ fontWeight: "Bold", fontSize: "20px" }}>
                    {costInfo.cvVal}
                  </Typography>
                </th>
              </tr>
            </table>
          </Grid>
        </Grid>
      </div>
      <hr class="solid" style={{ margin: "2em", color: "black" }}></hr>
      <Grid style={{ paddingLeft: "2em", paddingRight: "2em" }}>
        <table style={{ width: "100%" }}>
          <tr className="mainTitle">
            <th colSpan={2}>Sales Order/ Booking Details</th>
          </tr>

          <tr>
            <th colSpan={2} className="subTitle">
              {costInfo.maktx}
            </th>
          </tr>
          <tr>
            <td>
              <Grid sx={{ fontWeight: "bold" }}> Base Value </Grid>
            </td>
            <td>
              <Grid> {costInfo.baseVal} </Grid>
            </td>
          </tr>
          <tr>
            <td>
              <Grid sx={{ fontWeight: "bold" }}> MESB Value </Grid>
            </td>
            <td>
              <Grid> {costInfo.mseb} </Grid>
            </td>
          </tr>
          <tr> </tr>
          <td>
            <Grid sx={{ fontWeight: "bold" }}> PMC/PMRDA/PCMC Charges</Grid>
          </td>
          <td>
            <Grid> {costInfo.pmc}</Grid>{" "}
          </td>
          <tr>
            <td>
              <Grid sx={{ fontWeight: "bold" }}> Club Charges</Grid>
            </td>
            <td>
              {" "}
              <Grid> {costInfo.club} </Grid>{" "}
            </td>
          </tr>
          <tr>
            <td>
              <Grid sx={{ fontWeight: "bold" }}> Exclusive Club Charges</Grid>
            </td>
            <td>
              <Grid> {costInfo.exclub} </Grid>{" "}
            </td>
          </tr>
          <tr>
            <td>
              <Grid sx={{ fontWeight: "bold" }}> Provision Charges </Grid>
            </td>
            <td>
              <Grid> {costInfo.provision} </Grid>{" "}
            </td>
          </tr>
          <tr>
            <td>
              <Grid sx={{ fontWeight: "bold" }}> Garden Charges </Grid>
            </td>
            <td>
              <Grid> {costInfo.garden}</Grid>{" "}
            </td>
          </tr>

          <tr>
            <th colSpan={7} className="subTitle">
              {costInfo.maktxPrk}
            </th>
          </tr>
          <tr>
            <td>
              <Grid sx={{ fontWeight: "bold" }}> Car Parking Charges </Grid>
            </td>
            <td>
              {" "}
              <Grid> {costInfo.car} </Grid>
            </td>
          </tr>

          {costInfo.maktxAdmin && (
            <>
              <tr>
                <th colSpan={7} className="subTitle">
                  {costInfo.maktxAdmin}
                </th>
              </tr>
              <tr>
                <td>
                  <Grid sx={{ fontWeight: "bold" }}> Admin charges </Grid>
                  <Grid> {costInfo.admin} </Grid>
                </td>
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
              </tr>
            </>
          )}

          {costInfo.maktxEv && (
            <>
              <tr>
                <th colSpan={7} className="subTitle">
                  {costInfo.maktxAdmin}
                </th>
              </tr>
              <tr>
                <td>
                  <Grid sx={{ fontWeight: "bold" }}> Ev charging point </Grid>
                  <Grid> {costInfo.evpOth} </Grid>
                </td>
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
              </tr>{" "}
            </>
          )}
        </table>
      </Grid>
    </div>
  );
}
