/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import dayjs from "dayjs";
import * as yup from "yup";
import { useFormik } from "formik";
import { Grid, MenuItem } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "react-vertical-timeline-component/style.min.css";
import { useSelector } from "react-redux/es/hooks/useSelector";
import GlobalFunctions from "../../../../utils/GlobalFunctions";
import { AcUnit, AccessTime } from "@mui/icons-material";
import CrmModal from "../../../../components/crmModal/CrmModal";
import InputField from "../../../../components/inputField/InputField";
import CrmDatePicker from "../../../../components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../../../components/snackbar/UseCustomSnackBar";
import moment from "moment";

const Timeline = () => {
  const [map, setMap] = useState("");
  const [city, setCity] = useState("");
  const [venue, setVenue] = useState([]);
  const [events, setEvents] = useState([]);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [contactDetails, setContactDetails] = useState([]);
  const [contactPersonDetails, setContactPersonDetails] = useState("");

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const OrderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: OrderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Sent Registration Invitation Successfully!",
      CHANGEIND: "U",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const sendInvitation = () => {
    const entryData = {
      date: moment(formik.values.date.$d).format("DD/MM/YYYY"),
      time: moment(formik.values.time.$d).format("HH:mm:ss"),
      contact: formik.values.contactPerson,
      haveli: formik.values.venue,
    };

    fetch(
      process.env.REACT_APP_SERVER_URL +
        `/sap/bc/react/crm/mail?sap-client=250&vbeln=${OrderId}&mail=REGISTER_INVITE`,
      {
        method: "POST",
        body: JSON.stringify(entryData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((response) => {
        return response;
      })
      .then((data) => {
        if (data) {
          saveLog();
          snackbar.showSuccess("Registration Invite Sent Successfully!");
          setAddress("");
          setMap("");
          setLocation("");
          setCity("");
          setOpenForm(false);
          formik.setFieldValue("venue", "");
          formik.setFieldValue("contactPerson", "");
          setContactPersonDetails("");
          setOpenForm(false);
        }
      })
      .catch((error) => {
        if (error) {
          setOpenForm(false);

          snackbar.showError(
            "Error While Sending Registration Invite. Please try again!"
          );
        }
      });
  };

  useEffect(() => {
    if (OrderId) {
      const formData = new FormData();
      formData.append("orderId", OrderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/timeline", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setEvents(data.RegTimeline);
          }
        });
    }
  }, [OrderId]);

  useEffect(() => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);

    fetch(process.env.REACT_APP_SERVER_URL + `/api/dashboard/haveli`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const haveliData = data[0].havelidata;
          setVenue(haveliData);
          const ContactPersonData = data[0].contactdata;
          setContactDetails(ContactPersonData);
        }
      });
    // if (OrderId) {
    //   const formData = new FormData();
    //   formData.append("orderId", OrderId);
    //   formData.append("userName", userName);
    //   formData.append("passWord", passWord);
    //   fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/so", {
    //     method: "POST",
    //     body: formData,
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       if (data[0].vbeln) {
    //         setBookingDetails(data[0]);
    //       }
    //     });
    // }
  }, []);

  const [lineColor, setLineColor] = useState("#FFA500");

  useEffect(() => {
    const isGreenLine = events?.some((event) => event.date !== null);
    setLineColor(isGreenLine ? "rgb(16, 204, 82)" : "#FFA500");
  }, [events]);

  const validationSchema = yup.object({
    date: yup.date(),
    time: yup.string(),
    contactPerson: yup.string(),
    venue: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      date: " ",
      time: "",
      contactPerson: "",
      venue: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // const data = values;
      sendInvitation();
    },
  });

  return (
    <div style={{ marginTop: "1em" }}>
      <VerticalTimeline lineColor={lineColor}>
        {events?.map((event, index) => (
          <VerticalTimelineElement
            key={index}
            className="vertical-timeline-element--work"
            contentStyle={{
              background: event.Reference
                ? "rgb(16, 204, 82)"
                : "rgb(33, 150, 243)",
              color: "#fff",
            }}
            contentArrowStyle={{
              borderRight: event.Reference
                ? "7px solid rgb(16, 204, 82)"
                : "7px solid rgb(33, 150, 243)",
            }}
            iconStyle={{
              background: event.Reference
                ? "rgb(16, 204, 82)"
                : "rgb(33, 150, 243)",
              color: "#fff",
            }}
            icon={event.Reference ? <AcUnit /> : <AccessTime />}
            date={event.Reference}
            dateClassName="date-text"
          >
            <h3 className="vertical-timeline-element-title">{event.Title}</h3>
            <p>{event.Description}</p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>

      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          margin: "2em",
        }}
      >
        <button
          style={{
            borderRadius: "1.2em",
            height: "2.6em",
            width: "16em",
            backgroundColor: "rgb(16, 204, 82)",
            color: "white",
          }}
          onClick={() => {
            setOpenForm(true);
          }}
        >
          {" "}
          Registration Invitation
        </button>
      </div>
      {/* )} */}

      <CrmModal
        maxWidth="md"
        show={openForm}
        handleShow={() => {
          setOpenForm(false);
        }}
        title="Registration Schedule"
        primaryBtnText="Send Invitation"
        SecondaryBtnText="Cancel"
        secondarySave={() => {
          setAddress("");
          setMap("");
          setLocation("");
          setCity("");
          setOpenForm(false);
          formik.setFieldValue("venue", "");
          formik.setFieldValue("contactPerson", "");
          setContactPersonDetails("");
        }}
        primarySave={() => {
          sendInvitation();
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <div style={{ marginTop: "2em" }}>
              <Grid item xs={8} sm={12} md={12}>
                <CrmDatePicker
                  id="date"
                  name="date"
                  label="Date of Registration"
                  value={dayjs(formik.values.date)}
                  onChange={(value) =>
                    formik.setFieldValue("date", value, true)
                  }
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                />
              </Grid>
            </div>
            <br />
            <div style={{ width: "30em" }}>
              <Grid item xs={8} sm={12} md={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    id="time"
                    name="time"
                    label="Time"
                    value={formik.values.time}
                    sx={{
                      "&.MuiInputBase-input": {
                        height: "0.8em",
                        padding: 0,
                      },
                      width: "85%",
                    }}
                    onChange={(value) =>
                      formik.setFieldValue("time", value, true)
                    }
                    error={formik.touched.time && Boolean(formik.errors.time)}
                    helperText={formik.touched.time && formik.errors.time}
                  />
                </LocalizationProvider>
              </Grid>
            </div>
            <br />
            <div style={{ width: "25.5em" }}>
              <Grid item xs={6} sm={12} md={12}>
                <InputField
                  select
                  id="venue"
                  name="venue"
                  label="Venue"
                  value={formik.values.venue}
                  onChange={formik.handleChange}
                >
                  <MenuItem> {"Select venue"} </MenuItem>
                  {venue.length > 0 &&
                    venue?.map((obj) => (
                      <MenuItem
                        value={obj.haveliNo}
                        key={obj.haveliNo}
                        onClick={() => {
                          setAddress(obj.address1 + obj.address2);
                          setMap(obj.map_link);
                          setLocation(obj.location);
                          setCity(obj.city);
                        }}
                      >
                        {obj.haveliText}
                      </MenuItem>
                    ))}
                </InputField>
              </Grid>
            </div>
            <br />
            <div style={{ width: "25.5em" }}>
              <Grid item xs={6} sm={12} md={12}>
                <InputField
                  select
                  id="contactPerson"
                  name="contactPerson"
                  label="Contact Person"
                  value={formik.values.contactPerson}
                  onChange={formik.handleChange}
                >
                  <MenuItem> {"Select venue"} </MenuItem>
                  {contactDetails?.map((obj) => (
                    <MenuItem
                      value={obj.contactNo}
                      key={obj.contactNo}
                      onClick={() => {
                        setContactPersonDetails(obj.contactDetails);
                      }}
                    >
                      {obj.contactDetails}
                    </MenuItem>
                  ))}
                </InputField>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <div style={{ marginTop: "2em" }}>
              <div>{contactPersonDetails}</div>
              <div>{address}</div>
              <div>{location}</div>
              <div>{city}</div>
              {map && <div>"Map Link": {map}</div>}
            </div>
          </Grid>
        </Grid>
      </CrmModal>
    </div>
  );
};
export default Timeline;
