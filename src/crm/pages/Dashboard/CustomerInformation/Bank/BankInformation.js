import React, { useState, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import UpdateBankDetails from "./UpdateBankDetails";
import { Grid, Typography, Avatar } from "@mui/material";
import CrmModal from "../../../../components/crmModal/CrmModal";

export default function BankInformation({ customerInfo }) {
  const [isBankInfoEditable, setIsBankInfoEditable] = useState(false);

  const bankRef = useRef(null);

  const titleStyle = {
    "font-weight": "bold",
    "font-size": 14,
    marginLeft: "1em",
    paddinTop: "1em",
  };

  const gridStyle = {
    display: "flex",
    marginLeft: "-1em",
    "& .MuiGrid-item": "7px",
  };

  const validationSchema = Yup.object().shape({
    accountName: Yup.string().required("Required"),
    accountNumber: Yup.number().required("Required"),
    bankName: Yup.string().required("Required"),
    bankAddress: Yup.string().required("Required"),
    ifsc: Yup.string().required("Required"),
  });

  const saveBankDetails = () => {
    if (bankRef.current) {
      bankRef.current.saveBankDetails();
    }
  };

  const formik = useFormik({
    initialValues: {
      accountName: customerInfo?.bankAccName ? customerInfo?.bankAccName : "",
      accountNumber: customerInfo?.bankAccNo ? customerInfo?.bankAccNo : "",
      bankName: customerInfo?.bankName ? customerInfo?.bankName : "",
      bankAddress: customerInfo?.bankAddr ? customerInfo?.bankAddr : "",
      ifsc: customerInfo?.ifsc ? customerInfo?.ifsc : "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // const data = values;
      saveBankDetails();
    },
  });

  return (
    <>
      <Grid
        style={{
          border: "1px solid white",
          borderRadius: "18px",
          marginTop: "1em",
          paddingTop: "1em",
          paddingLeft: "1em",
          backgroundColor: "white",
        }}
      >
        <Grid
          container
          columns={12}
          columnGap={4}
          spacing={2}
          sx={{ display: "flex" }}
        >
          <Grid
            item
            sm={6}
            md={6}
            lg={6}
            style={{
              fontSize: "1.5em",
              padding: "0.5em",
              fontWeight: "bold",
              marginLeft: "1em",
            }}
          >
            Bank Details
          </Grid>
          <Grid
            item
            sm={5}
            md={5}
            lg={5}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Avatar sx={{ cursor: "pointer" }}>
              <EditIcon
                onClick={() => {
                  setIsBankInfoEditable(!isBankInfoEditable);
                  saveBankDetails();
                }}
              />
            </Avatar>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={4}
          sx={gridStyle}
          style={{ paddingTop: "0.5em" }}
        >
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            style={{ paddingTop: "2em" }}
            sx={{
              display: "flex",
              "&.MuiGrid-item": { paddingTop: "7px" },
            }}
          >
            <Grid xs={4} sm={4} md={4}>
              <Typography style={titleStyle}>
                Beneficiary/Account Name:
              </Typography>
            </Grid>
            <Grid xs={8} sm={8} md={8}>
              <Typography>{formik?.values?.accountName}</Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
          >
            <Grid xs={4} sm={4} md={4}>
              <Typography style={titleStyle}>Bank Account Number:</Typography>
            </Grid>
            <Grid xs={8} sm={8} md={8}>
              <Typography>{formik?.values?.accountNumber}</Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
          >
            <Grid xs={4} sm={4} md={4}>
              <Typography style={titleStyle}>Bank Name:</Typography>
            </Grid>
            <Grid xs={8} sm={8} md={8}>
              <Typography>{formik?.values?.bankName}</Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
          >
            <Grid xs={4} sm={4} md={4}>
              <Typography style={titleStyle}>Bank Address:</Typography>
            </Grid>
            <Grid xs={8} sm={8} md={8}>
              <Typography>{formik?.values?.bankAddress}</Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            sx={{ display: "flex", "&.MuiGrid-item": { paddingTop: "7px" } }}
          >
            <Grid xs={4} sm={4} md={4}>
              <Typography style={titleStyle}>IFSC:</Typography>
            </Grid>
            <Grid xs={8} sm={8} md={8}>
              <Typography>{formik?.values?.ifsc}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <br />
      </Grid>
      <CrmModal
        maxWidth="sm"
        title="Bank Details"
        show={isBankInfoEditable}
        handleShow={() => {
          setIsBankInfoEditable(false);
        }}
        primaryBtnText="Submit"
        SecondaryBtnText="Cancel"
        primarySave={() => {
          saveBankDetails();
        }}
        secondarySave={() => {
          setIsBankInfoEditable(false);
        }}
      >
        <UpdateBankDetails
          ref={bankRef}
          customerInfo={customerInfo}
          setIsBankInfoEditable={setIsBankInfoEditable}
        />
      </CrmModal>
    </>
  );
}
