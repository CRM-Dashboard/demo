/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
import React, { useEffect, useState } from "react";
import "./Style.css";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";

export default function CostSheet() {
  const [costInfo, setCostInfo] = useState([]);

  const reducerData = useSelector((state) => state);
  const OrderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  useEffect(() => {
    if (OrderId) {
      const formData = new FormData();
      formData.append("orderId", OrderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/so", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data[0].so[0].vbeln) {
            setCostInfo(data[0].so[0]);
          }
        });
    }
  }, []);

  return (
    <div style={{ marginTop: "1em" }}>
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
