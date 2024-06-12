/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, Typography, Avatar } from "@mui/material";
import UpdatePersonalDetails from "./UpdatePersonalDetails";
import UpdateAddressDetails from "./UpdateAddressDetails";
import CrmModal from "../../../../components/crmModal/CrmModal";
import CircularScreenLoader from "../../../../components/circularScreenLoader/CircularScreenLoader";

export default function BasicInformation({
  titleData,
  occupations,
  countryData,
  stateData,
}) {
  const [customerInfo, setCustomerInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPersonalDetailsEditable, setIsPersonalDetailsEditable] =
    useState(false);
  const [isAddressEditable, setIsAddressEditable] = useState(false);

  const personalInfoRef = useRef(null);
  const addressInfoRef = useRef(null);

  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const orderId = reducerData.searchBar.orderId;
  const projectId = reducerData?.dashboard?.project?.projectId;
  const custId = reducerData?.searchBar?.accountStatement.CustomerNumber;

  const getUpdatedData = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("projectId", projectId);
    fetch(process.env.REACT_APP_SERVER_URL + `/api/dashboard/customer`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data) {
          // setTitleData(data[0].titledata);
          // setCountryData(data[0].countrydata);
          // setOccupation(data[0].occupationdata);
          // setStateData(data[0].statedata);
          if (orderId) {
            const filteredArray = data[0]?.customerdata?.filter(
              (obj) => obj.orderId === orderId
            );
            const finalArray = filteredArray?.filter(
              (data) => data.customerId === custId
            );
            console.log("###########finalArray", finalArray[0], custId);
            console.log("##########custId", custId);

            await setCustomerInfo(finalArray[0]);
            setLoading(false);
          }
        }
      });
  };

  useEffect(() => {
    getUpdatedData();
  }, [isPersonalDetailsEditable, isAddressEditable]);

  // const validationSchema = Yup.object().shape({
  //   customerName: Yup.string().required("Required"),
  //   mobile: Yup.number().required("Required"),
  //   alterhateMobile: Yup.number().required("Required"),
  //   city: Yup.string().required("Required"),
  //   gender: Yup.string().required("Required"),
  //   pincode: Yup.number().required("Required"),
  //   adharNumber: Yup.number().required("Required"),
  //   country: Yup.string().required("Required"),
  //   state: Yup.string().required("Required"),
  //   pan: Yup.string().required("Required"),
  //   email: Yup.string().required("Required"),
  //   dob: Yup.date().required("Required"),
  //   age: Yup.number().required("Required"),
  //   occupation: Yup.string().required("Required"),
  //   designation: Yup.string().required("Required"),
  //   company: Yup.string().required("Required"),
  //   maritalStatus: Yup.string().required("Required"),
  //   ethnicity: Yup.string().required("Required"),
  //   industry: Yup.string().required("Required"),
  //   workplace: Yup?.string()?.required("Required"),
  //   childs: Yup?.number()?.required("required"),
  //   agreementAddr: Yup?.string()?.required("Required"),
  //   address: Yup?.string()?.required("required"),
  //   salaried: Yup?.string()?.required("required"),
  //   vipCustomer: Yup?.string()?.required("required"),
  //   vipReason: Yup?.string()?.required("required"),
  //   cibilScore: Yup?.string()?.required("required"),
  // });

  // const saveBasicDetails = () => {
  //   console.log("#######formik.values", formik.values);
  // };

  const savePersonalDetails = () => {
    if (personalInfoRef.current) {
      personalInfoRef.current.savePersonalDetails();
    }
  };

  const saveAddressDetails = () => {
    if (addressInfoRef.current) {
      addressInfoRef.current.saveAddressDetails();
    }
  };

  // const formik = useFormik({
  //   initialValues: {
  //     customerName: customerInfo.customerName,
  //     mobile: customerInfo?.Mobile ? customerInfo?.Mobile : "",
  //     alterhateMobile: customerInfo?.alterhateMobile
  //       ? customerInfo?.alterhateMobile
  //       : "",
  //     city: customerInfo?.city ? customerInfo?.city : "",
  //     gender: customerInfo?.Gender ? customerInfo?.Gender : "",
  //     pincode: customerInfo?.pincode ? customerInfo?.pincode : "",
  //     adharNumber: customerInfo?.adharNumber ? customerInfo?.adharNumber : "",
  //     country: customerInfo?.Country ? customerInfo?.Country : "",
  //     state: customerInfo?.State ? customerInfo?.State : "",
  //     pan: customerInfo?.PAN ? customerInfo?.PAN : "",
  //     email: customerInfo?.Email ? customerInfo?.Email : "",
  //     dob: customerInfo?.DOB ? customerInfo?.DOB : "",
  //     age: customerInfo?.Age ? customerInfo?.Age : "",
  //     occupation: customerInfo?.Occupation ? customerInfo?.Occupation : "",
  //     designation: customerInfo?.Designation ? customerInfo?.Designation : "",
  //     company: customerInfo?.Company ? customerInfo?.Company : "",
  //     maritalStatus: customerInfo?.maritalStatus
  //       ? customerInfo?.maritalStatus
  //       : "",
  //     ethnicity: customerInfo?.ethnicity ? customerInfo?.ethnicity : "",
  //     industry: customerInfo?.Industry ? customerInfo?.industry : "",
  //     workplace: customerInfo?.workplace ? customerInfo?.workplace : "",
  //     childs: customerInfo?.childs ? customerInfo?.childs : "",
  //     agreementAddr: customerInfo?.agreementAddr
  //       ? customerInfo?.agreementAddr
  //       : "",
  //     address: customerInfo?.Address ? customerInfo?.Address : "",
  //     salaried: customerInfo?.salaried ? customerInfo?.salaried : "",
  //     vipCustomer: customerInfo?.vip ? customerInfo?.vip : "",
  //     vipReason: customerInfo?.vipRsn ? customerInfo?.vipRsn : "",
  //     cibilScore: customerInfo?.cibil ? customerInfo?.cibil : "",
  //   },
  //   validationSchema,
  //   onSubmit: (values, { resetForm }) => {
  //     saveBasicDetails();
  //   },
  // });

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

  return (
    <>
      <div style={{ padding: "1em" }} />
      {!loading && customerInfo ? (
        <>
          {/* Personal Details */}
          <Grid
            style={{
              border: "1px solid white",
              borderRadius: "18px",
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
                Personal Details
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
                      setIsPersonalDetailsEditable(!isPersonalDetailsEditable);
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Customer Name:</Typography>
                </Grid>
                <Grid xs={9} sm={9} md={9}>
                  <Typography>{customerInfo.customerName}</Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                sx={{
                  display: "flex",
                  "&.MuiGrid-item": { paddingTop: "7px" },
                }}
              >
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>PAN:</Typography>
                </Grid>
                <Grid xs={8} sm={8} md={8}>
                  <Typography>{customerInfo.PAN}</Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                sx={{
                  display: "flex",
                  "&.MuiGrid-item": { paddingTop: "7px" },
                }}
              >
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Marital Status:</Typography>
                </Grid>
                <Grid xs={8} sm={8} md={8}>
                  <Typography>{customerInfo?.maritalStatus}</Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                sx={{
                  display: "flex",
                  "&.MuiGrid-item": { paddingTop: "7px" },
                }}
              >
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Ethnicity:</Typography>
                </Grid>
                <Grid xs={5} sm={5} md={5}>
                  <Typography>{customerInfo?.ethnicity}</Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                sx={{
                  display: "flex",
                  "&.MuiGrid-item": { paddingTop: "7px" },
                }}
              >
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Salaried:</Typography>
                </Grid>
                <Grid xs={5} sm={5} md={5}>
                  <Typography>
                    {customerInfo?.salaried === "X" ? "Yes" : "No"}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                sx={{
                  display: "flex",
                  "&.MuiGrid-item": { paddingTop: "7px" },
                }}
              >
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>VIP Customer:</Typography>
                </Grid>
                <Grid xs={5} sm={5} md={5}>
                  <Typography>
                    {customerInfo?.vip === "X" ? "Yes" : "No"}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                sx={{
                  display: "flex",
                  "&.MuiGrid-item": { paddingTop: "7px" },
                }}
              >
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>VIP Reason:</Typography>
                </Grid>
                <Grid xs={5} sm={5} md={5}>
                  <Typography>{customerInfo?.vipRsn}</Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                sx={{
                  display: "flex",
                  "&.MuiGrid-item": { paddingTop: "7px" },
                }}
              >
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Cibil Score:</Typography>
                </Grid>
                <Grid xs={5} sm={5} md={5}>
                  <Typography>{customerInfo?.cibil}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <br />
          </Grid>

          {/* Address Details */}
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
                Address Details
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
                      setIsAddressEditable(!isAddressEditable);
                      // saveBasicDetails();
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
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Address:</Typography>
                </Grid>
                <Grid xs={9} sm={9} md={9}>
                  <Typography>{customerInfo?.Address}</Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                sx={{
                  display: "flex",
                  "&.MuiGrid-item": { paddingTop: "7px" },
                }}
              >
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>City:</Typography>
                </Grid>
                <Grid xs={5} sm={5} md={5}>
                  <Typography>{customerInfo.city}</Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                sx={{
                  display: "flex",
                  "&.MuiGrid-item": { paddingTop: "7px" },
                }}
              >
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Pincode:</Typography>
                </Grid>
                <Grid xs={5} sm={5} md={5}>
                  <Typography>{customerInfo.postCode1}</Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                sx={{
                  display: "flex",
                  "&.MuiGrid-item": { paddingTop: "7px" },
                }}
              >
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>State:</Typography>
                </Grid>
                <Grid xs={8} sm={8} md={8}>
                  <Typography>{customerInfo?.State}</Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                sx={{
                  display: "flex",
                  "&.MuiGrid-item": { paddingTop: "7px" },
                }}
              >
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Country:</Typography>
                </Grid>
                <Grid xs={5} sm={5} md={5}>
                  <Typography>{customerInfo?.Country}</Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                sx={{
                  display: "flex",
                  "&.MuiGrid-item": { paddingTop: "7px" },
                }}
              >
                <Grid xs={3} sm={3} md={3}>
                  <Typography style={titleStyle}>Work Place:</Typography>
                </Grid>
                <Grid xs={5} sm={5} md={5}>
                  <Typography>{customerInfo?.workplace}</Typography>
                </Grid>
              </Grid>
            </Grid>

            <br />
          </Grid>
        </>
      ) : (
        <CircularScreenLoader />
      )}

      {/* Update Personal Modal */}
      <CrmModal
        maxWidth="md"
        title="Personal Details"
        show={isPersonalDetailsEditable}
        handleShow={() => {
          setIsPersonalDetailsEditable(false);
        }}
        primaryBtnText="Yes"
        SecondaryBtnText="No"
        primarySave={() => {
          savePersonalDetails();
        }}
        secondarySave={() => {
          setIsPersonalDetailsEditable(false);
        }}
      >
        <UpdatePersonalDetails
          ref={personalInfoRef}
          customerInfo={customerInfo}
          titleData={titleData}
          occupations={occupations}
          countryData={countryData}
          getUpdatedData={getUpdatedData}
          setIsPersonalDetailsEditable={setIsPersonalDetailsEditable}
        />
      </CrmModal>

      <CrmModal
        maxWidth="md"
        title="Address Details"
        show={isAddressEditable}
        handleShow={() => {
          setIsAddressEditable(false);
        }}
        primaryBtnText="Submit"
        SecondaryBtnText="Cancel"
        primarySave={() => {
          saveAddressDetails();
        }}
        secondarySave={() => {
          setIsAddressEditable(false);
        }}
      >
        <UpdateAddressDetails
          ref={addressInfoRef}
          customerInfo={customerInfo}
          stateData={stateData}
          countryData={countryData}
          getUpdatedData={getUpdatedData}
          setIsAddressEditable={setIsAddressEditable}
        />
      </CrmModal>
    </>
  );
}
