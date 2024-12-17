import React, { useEffect, useState } from "react";

import CustomTabs from "../../crm/components/inbox/CustomTabs";

import { Grid } from "@mui/material";

import axios from "axios";

import api from "../../services/api";

import TicketCart from "../../crm/components/inbox/TicketCart";
import { useSelector } from "react-redux";
import { IoIosMailOpen } from "react-icons/io";
import { FcProcess } from "react-icons/fc";
import { RiMailCloseFill } from "react-icons/ri";
import Badge from "@mui/material/Badge";

import * as Yup from "yup";
import ListAcivity from "./ListAcivity";

const statuses = {
  Open: "1",
  "In Progress": "2",
  "Customer Action Pending": "3",
  Closed: "4",
};

const validationSchema = Yup.object({
  // title: Yup.string().required("Title is required"),
  // priority: Yup.string().required("Priority is required"),
  // assignee: Yup.string().required("Assignee is required"),
});

const TicketList = () => {
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);
  const [dpData, setDpdata] = useState([]);

  const [ticketId, setTicketId] = useState("");

  console.log("ticket Id", ticketId);
  const [tickets, setTicket] = useState({
    open: [],
    inprocess: [],
    closed: [],
  });

  const [selectedTicket, setSelectedTicket] = useState({});
  const [values, setValues] = useState({});
  const getValuesFromForm = (value) => {
    setValues(value);
  };

  const ticketFields = [
    {
      label: "Description",
      name: "activityDes",
      type: "typo",
      defaultValue: "",
      isDisabled: true,
    },
    {
      label: "Due Date",
      name: "dueDt",
      type: "text",
      defaultValue: "",
      isDisabled: true,
    },
    {
      label: "HOD Date",
      name: "hodDt",
      type: "text",
      defaultValue: "",
      isDisabled: true,
    },
    {
      label: "Due Days",
      name: "dueDays",
      type: "text",
      defaultValue: "",
    },

    {
      label: "Department",
      name: "dept",
      type: "text",
      defaultValue: "",
      isDisabled: true,
    },
    {
      label: "Comments",
      name: "comments",
      type: "text",
      defaultValue: "",
      isDisabled: false,
    },
    {
      label: "Priority",
      name: "priority",
      type: "text",
      defaultValue: "",
    },
    {
      label: "Status",
      name: "statTxt",
      type: "text",
      defaultValue: "",
    },
  ];

  const handleSubmit = async (values, btnType, tabname) => {
    console.log("values", values, btnType, tabname);
    try {
      const {
        activityDes,

        comments,
        dueDays,
        // createdDateTime,
        // description,
        // maktx,
        // name,,
        // priority,
        // sender,
        statTxt,
        // subject,
      } = values;
      // type        TYPE zcrm_ticket-type,
      //          subtyp      TYPE zcrm_ticket-subtyp,
      //          dp_code     TYPE zcrm_ticket-dp_code,
      //          comments    TYPE zcrm_ticket-comments,
      //          comp_ind     TYPE zcrm_ticket-comp_ind,
      //          status
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("ticketId", selectedTicket?.ticketId);
      formData.append("activityId", ticketId);

      // activity_des ,comments ,due_days ,status ,comp_ind,  cust_pending,init

      let data = {};

      if (btnType === "submit") {
        data = {
          due_days: dueDays,
          comments,
          status: 2,
          activity_des: activityDes,
          cust_pending: "",
          comp_ind: "",
          init: tabname === "open" ? "X" : "",
        };
      } else if (btnType === "complete") {
        data = {
          due_days: dueDays,
          comments,
          comp_ind: "X",
          status: 4,
          cust_pending: "",
          init: "",

          activity_des: activityDes,
        };
      } else if (btnType === "customer") {
        data = {
          due_days: dueDays,
          comments,
          status: 3,
          activity_des: activityDes,
          cust_pending: "X",
          init: "",
          comp_ind: "",
        };
      }

      // const data = {
      //   activity_des: activityDes,

      //   comments,
      //   due_days: dueDays,
      //   cust_pending: "",
      //   init: "",

      //   comp_ind: "",
      //   status: statuses[statTxt],
      // };
      formData.append("data", JSON.stringify(data));
      const url = `/api/ticket/post-activity`;
      const res = await api.post(url, formData);
      if (res) {
        getTicketList();
      }
    } catch (error) {
      console.log("errrer", error);
    }
  };
  // /post-ticket

  const handleCancel = () => {
    console.log("Form canceled");
  };

  const getTicketList = async () => {
    try {
      const url = `/api/ticket/get-activity-list`;
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("employeeId", userName?.toUpperCase());

      const response = (await api.post(url, formData)).data;
      console.log(response, "dfjedhfdyh");

      setTicket(response?.response[0]);
    } catch (error) {
      console.log("errr", error);
      return error;
    }
  };

  useEffect(() => {
    getTicketList();
  }, [userName]);

  const getTicketDetails = async (activityId) => {
    try {
      const url = `/api/ticket/get-activity-details`;

      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("activityId", activityId);
      const res = (await api.post(url, formData)).data;

      setSelectedTicket(res?.response[0]);

      console.log("resese", res);
    } catch (error) {
      console.log("errsrd");
    }
  };

  const handleTicketClick = async (ticket, index) => {
    console.log("tickete", ticket);
    setTicketId(ticket.activityNo);
    const details = await getTicketDetails(ticket.activityNo);
  };

  const tabData = [
    {
      label: "Open",
      content: (
        <Grid container spacing={3}>
          <Grid item md={4} sm={4} xl={4}>
            {" "}
            <ListAcivity
              tickets={tickets?.open}
              onTicketClick={handleTicketClick}
              listWrapperStyle={{
                margin: "20px auto",
                backgroundColor: "#f9f9f9",
                padding: "0px",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              listItemStyle={{
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
              itemTextStyle={{
                "& .MuiTypography-primary": {
                  fontWeight: "bold",
                  color: "#333",
                },
                "& .MuiTypography-secondary": {
                  color: "#777",
                },
              }}
              emptyMessage="No activity to show."
            />
          </Grid>
          <Grid item md={8} sm={8} xl={8}>
            {Object.keys(selectedTicket)?.length === 0 && (
              <h3>Please Select Activity</h3>
            )}
            {Object.keys(selectedTicket)?.length > 0 && (
              <TicketCart
                ticketFields={ticketFields}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                validationSchema={validationSchema}
                selectedTicket={selectedTicket}
                tabname={"open"}
              />
            )}
          </Grid>
        </Grid>
      ),
      icon: (
        <Badge badgeContent={tickets?.open?.length} color="primary">
          <IoIosMailOpen color="black" size={20} />
        </Badge>
      ),
    },
    {
      label: "In Progress",
      content: (
        <Grid container spacing={3}>
          <Grid item md={4} sm={4} xl={4}>
            {" "}
            <ListAcivity
              tickets={tickets?.inprocess}
              onTicketClick={handleTicketClick}
              listWrapperStyle={{
                // maxWidth: "600px",
                margin: "20px auto",
                backgroundColor: "#f9f9f9",
                padding: "0px",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              listItemStyle={{
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
              itemTextStyle={{
                "& .MuiTypography-primary": {
                  fontWeight: "bold",
                  color: "#333",
                },
                "& .MuiTypography-secondary": {
                  color: "#777",
                },
              }}
              emptyMessage="No activity to show."
            />
          </Grid>
          <Grid item md={8} sm={8} xl={8}>
            {Object.keys(selectedTicket)?.length === 0 && (
              <h3>Please Select Activity</h3>
            )}
            {Object.keys(selectedTicket)?.length > 0 && (
              <TicketCart
                ticketFields={ticketFields}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                validationSchema={validationSchema}
                selectedTicket={selectedTicket}
                tabname={"inprogress"}
              />
            )}
          </Grid>
        </Grid>
      ),
      icon: (
        <Badge badgeContent={tickets?.inprocess?.length} color="primary">
          <FcProcess color="black" size={20} />
        </Badge>
      ),
    },
    {
      label: "Closed",
      content: (
        <Grid container spacing={3}>
          <Grid item md={4} sm={4} xl={4}>
            {" "}
            <ListAcivity
              tickets={tickets?.closed}
              onTicketClick={handleTicketClick}
              renderTicketAction={(ticket, index) => <></>}
              listWrapperStyle={{
                // maxWidth: "600px",
                margin: "20px auto",
                backgroundColor: "#f9f9f9",
                padding: "0px",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              listItemStyle={{
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
              itemTextStyle={{
                "& .MuiTypography-primary": {
                  fontWeight: "bold",
                  color: "#333",
                },
                "& .MuiTypography-secondary": {
                  color: "#777",
                },
              }}
              emptyMessage="No activity to show."
            />
          </Grid>
          <Grid item md={8} sm={8} xl={8}>
            {/* <Grid item sx={5} md={5} xl={6}> */}

            {Object.keys(selectedTicket)?.length > 0 && (
              <TicketCart
                ticketFields={ticketFields}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                validationSchema={validationSchema}
                selectedTicket={selectedTicket}
                tabname={"closed"}
              />
            )}
            {/* </Grid> */}
            {Object.keys(selectedTicket)?.length === 0 && (
              <h3>Please Select Activity</h3>
            )}
          </Grid>
        </Grid>
      ),
      icon: (
        <Badge badgeContent={tickets?.closed?.length} color="primary">
          <RiMailCloseFill color="black" size={20} />
        </Badge>
      ),
    },
  ];

  const handleTabChange = (index) => {
    setSelectedTicket({});
    console.log("Active tab index:", index);
  };

  return (
    <div>
      <Grid container></Grid>

      <CustomTabs
        tabs={tabData}
        defaultTab={0}
        onChange={handleTabChange}
        variant="scrollable"
        // centered
        tabsWrapperStyle={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          padding: "8px",
        }}
        tabStyle={{
          fontWeight: "bold",
          color: "#333",
          "&.Mui-selected": {
            color: "#1976d2",
          },
        }}
        contentWrapperStyle={{
          //   padding: "16px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      />
    </div>
  );
};

export default TicketList;
