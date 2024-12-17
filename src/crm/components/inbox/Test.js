import React, { useEffect, useState, useMemo } from "react";
import CustomTabs from "./CustomTabs";
import { Grid } from "@mui/material";
import CustomList from "./CustomList";
import EmailCart from "./EmailCart";
import axios from "axios";
import api from "../../../services/api";
import TicketCart from "./TicketCart";
import { useSelector } from "react-redux";
import { IoIosMailOpen } from "react-icons/io";
import { FcProcess } from "react-icons/fc";
import { RiMailCloseFill } from "react-icons/ri";
import Badge from "@mui/material/Badge";
import * as Yup from "yup";
import ActivityCard from "./ActivityCard";
import ThreeDotLoading from "../../../components/ThreeDot";

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

const Test = () => {
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);
  const crmId = useSelector((state) => state?.dashboard?.crmId);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [emailCartData, setEmailCartData] = useState([]);
  const [dpData, setDpdata] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [assignData, setAssignData] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [activitydata, setActivitydata] = useState([]);
  const [isTicketLoading, setIsTicketLoading] = useState(false);

  const [tickets, setTicket] = useState({
    open: [],
    inprocess: [],
    closed: [],
  });

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [values, setValues] = useState({});
  const getValuesFromForm = (value) => {
    setValues(value);
  };

  const ticketFields = useMemo(
    () => [
      { label: "Subject", name: "subject", type: "text", defaultValue: "" },
      {
        label: "Priority",
        name: "priority",
        type: "text",
        defaultValue: "",
      },

      {
        label: "Project",
        name: "maktx",
        type: "text",
        defaultValue: "",
      },
      {
        label: "Date",
        name: "createdDateTime",
        type: "text",
        defaultValue: "",
      },

      {
        label: "Customer Name",
        name: "name",
        type: "text",
        defaultValue: "",
      },

      {
        label: "Status",
        name: "statTxt",
        type: "text",
        defaultValue: "",
      },
      {
        label: "Category",
        name: "type",
        type: "select",
        defaultValue: "",
        options: category?.map((data) => ({
          value: data.typ,
          label: data.typTxt,
        })),
      },
      {
        label: "SubCategory",
        name: "subtyp",
        type: "select",
        defaultValue: "",
        options: subcategory
          ?.filter((opt) => opt?.actTyp === values?.type)
          ?.map((data) => ({
            value: data.actSubtyp,
            label: data.actSubtypTxt,
          })),
      },

      // dpCode

      {
        label: "Description",
        name: "description",
        type: "text",
        defaultValue: "",
      },
      { label: "Comments", name: "comments", type: "text", defaultValue: "" },
      {
        label: "Disposition",
        name: "dpCode",
        type: "select",
        defaultValue: "",
        options: dpData?.map((data) => ({
          value: data.dpCode,
          label: data.dpTxt,
        })),
      },
      {
        label: "Sender",
        name: "sender",
        type: "text",
        defaultValue: "",
      },
    ],

    [category, subcategory, values, dpData]
  );

  const handleSubmit = async (values, btnType, tabname) => {
    try {
      const { type, subtyp, comments, statTxt, dpCode, description } = values;
      // type        TYPE zcrm_ticket-type,
      //          subtyp      TYPE zcrm_ticket-subtyp,
      //          dp_code     TYPE zcrm_ticket-dp_code,
      //          comments    TYPE zcrm_ticket-comments,
      //          comp_ind     TYPE zcrm_ticket-comp_ind,
      //          status
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("ticketId", ticketId);

      let data = {};

      if (btnType === "submit") {
        data = {
          type,
          subtyp,
          dp_code: dpCode,
          comments,
          comp_ind: "",
          status: 2,
          description: description,
          init: tabname === "open" ? "X" : "",
        };
      } else if (btnType === "complete") {
        data = {
          type,
          subtyp,
          dp_code: dpCode,
          comments,
          comp_ind: "X",
          status: 4,
          description: description,
        };
      } else if (btnType === "customer") {
        data = {
          type,
          subtyp,
          dp_code: dpCode,
          comments,
          comp_ind: "",
          status: 3,
          description: description,
        };
      }

      formData.append("data", JSON.stringify(data));

      const url = `/api/ticket/post-ticket`;
      const res = await api.post(url, formData);
      if (res) {
        getTicketList();
        setEmailCartData([]);

        setSelectedTicket({});
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
      const url = `/api/ticket/get-ticket-list`;
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      if (!crmId) {
        formData.append("crmId", userName?.toUpperCase());
      } else if (crmId) {
        formData.append("crmId", crmId);
      }

      const response = (await api.post(url, formData)).data;

      setTicket(response.response[0]);
    } catch (error) {
      console.log("errr", error);
      return error;
    }
  };

  useEffect(() => {
    getTicketList();
  }, [crmId]);

  const getAccessToken = async () => {
    const url = `/api/ticket/get-token`;

    try {
      const tokenData = (await api.get(url)).data;

      return tokenData;
    } catch (error) {
      return error;
    }
  };

  const getTicketDetails = async (ticketId) => {
    try {
      const url = `/api/ticket/get-ticket-details`;

      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("ticketId", ticketId);

      const res = (await api.post(url, formData)).data;

      setCategory(res?.response[0]?.typdata);
      setSubcategory(res?.response[0]?.subtypdata);
      setDpdata(res?.response[0]?.dpdata);
      setSelectedTicket(res?.response[0]?.ticketdata[0]);
      setDeptData(res?.response[0]?.deptdata);
      setAssignData(res?.response[0]?.userdata);
      setActivitydata(res?.response[0]?.activitydata);

      return res.response[0]?.ticketdata[0];
    } catch (error) {
    } finally {
    }
  };

  const fetchMessagesByConversation = async (conversationId) => {
    try {
      //   setLoading(true); // Set loading state to true while fetching data
      //   setError(null); // Reset any previous errors

      const token = await getAccessToken(); // Get the access token

      const encodedConversationId = encodeURIComponent(conversationId); // URL encode the conversationId
      const url = `https://graph.microsoft.com/v1.0/users/c8fec0e4-c259-49c3-b4ff-64d31353a571/messages?$filter=conversationId eq '${encodedConversationId}'`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update state with fetched messages
      setEmailCartData(response?.data?.value?.reverse());
    } catch (err) {
      // Handle any errors
      //   setError(
      //     "Error fetching messages: " +
      //       (err.response ? err.response.data.error.message : err.message)
      //   );
    } finally {
      //   setLoading(false); // Set loading state to false when done
    }
  };

  const handleTicketClick = async (ticket, index) => {
    try {
      setEmailCartData([]);

      setSelectedTicket({});
      setTicketId(ticket.ticketId);
      setIsTicketLoading(true);
      const details = await getTicketDetails(ticket.ticketId);
      await fetchMessagesByConversation(details?.conversationId);
    } catch (error) {
    } finally {
      setIsTicketLoading(false);
    }
  };

  const tabData = [
    {
      label: "Open",
      content: (
        <Grid container spacing={3}>
          <Grid item md={4} sm={4} xl={4}>
            {" "}
            <CustomList
              tickets={tickets?.open}
              onTicketClick={handleTicketClick}
              listWrapperStyle={{
                margin: "20px auto",
                // backgroundColor: "#f9f9f9",
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
              emptyMessage="No tickets to show."
            />
          </Grid>
          <Grid item md={8} sm={8} xl={8}>
            {isTicketLoading && (
              <>
                <ThreeDotLoading />
              </>
            )}
            {!isTicketLoading && emailCartData.length === 0 && (
              <h3>Please Select Ticket</h3>
            )}
            {emailCartData?.length > 0 && (
              <TicketCart
                ticketFields={ticketFields}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                validationSchema={validationSchema}
                selectedTicket={selectedTicket}
                deptData={deptData}
                assignData={assignData}
                tabname={"open"}
                getValuesFromForm={getValuesFromForm}
              />
            )}
            {activitydata?.length > 0 &&
              emailCartData?.length > 0 &&
              activitydata?.map((activity) => {
                return <ActivityCard activitydata={activity} />;
              })}
            {emailCartData?.length > 0 &&
              emailCartData?.map((email) => {
                return (
                  <EmailCart
                    key={email.id}
                    content={email?.body?.content}
                    email={email}
                    to={selectedTicket?.sender}
                    tabname={"open"}
                  />
                );
              })}
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
            <CustomList
              tickets={tickets?.inprocess}
              onTicketClick={handleTicketClick}
              listWrapperStyle={{
                // maxWidth: "600px",
                margin: "20px auto",
                // backgroundColor: "#f9f9f9",
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
              emptyMessage="No tickets to show."
            />
          </Grid>
          <Grid item md={8} sm={8} xl={8}>
            {isTicketLoading && (
              <>
                <ThreeDotLoading />
              </>
            )}
            {!isTicketLoading && emailCartData.length === 0 && (
              <h3>Please Select Ticket</h3>
            )}
            {emailCartData?.length > 0 && (
              <TicketCart
                ticketFields={ticketFields}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                validationSchema={validationSchema}
                selectedTicket={selectedTicket}
                tabname={"inprogress"}
                deptData={deptData}
                assignData={assignData}
                getValuesFromForm={getValuesFromForm}
              />
            )}
            {emailCartData.length > 0 &&
              activitydata?.length > 0 &&
              activitydata?.map((activity) => {
                return <ActivityCard activitydata={activity} />;
              })}
            {emailCartData?.length > 0 &&
              emailCartData?.map((email) => {
                return (
                  <EmailCart
                    key={email.id}
                    content={email?.body?.content}
                    email={email}
                    to={selectedTicket?.sender}
                    tabname={"inprogress"}
                  />
                );
              })}
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
            <CustomList
              tickets={tickets?.closed}
              onTicketClick={handleTicketClick}
              renderTicketAction={(ticket, index) => (
                <></>
                // <Box>
                //   <IconButton
                //     edge="end"
                //     aria-label="delete"
                //     onClick={(e) => {
                //       e.stopPropagation(); // Prevent triggering ticket click
                //       handleDelete(ticket, index);
                //     }}
                //   >
                //     <DeleteIcon color="error" />
                //   </IconButton>
                //   <IconButton
                //     edge="end"
                //     aria-label="reply"
                //     onClick={(e) => {
                //       e.stopPropagation(); // Prevent triggering ticket click
                //       handleReply(ticket, index);
                //     }}
                //   >
                //     <ReplyIcon color="primary" />
                //   </IconButton>
                // </Box>
              )}
              listWrapperStyle={{
                // maxWidth: "600px",
                margin: "20px auto",
                // backgroundColor: "#f9f9f9",
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
              emptyMessage="No tickets to show."
            />
          </Grid>
          <Grid item md={8} sm={8} xl={8}>
            {/* <Grid item sx={5} md={5} xl={6}> */}
            {isTicketLoading && (
              <>
                <ThreeDotLoading />
              </>
            )}

            {emailCartData?.length > 0 && (
              <TicketCart
                ticketFields={ticketFields}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                validationSchema={validationSchema}
                selectedTicket={selectedTicket}
                tabname={"closed"}
                deptData={deptData}
                assignData={assignData}
                getValuesFromForm={getValuesFromForm}
              />
            )}
            {emailCartData.length > 0 &&
              activitydata?.length > 0 &&
              activitydata?.map((activity) => {
                return <ActivityCard activitydata={activity} />;
              })}
            {/* </Grid> */}
            {!isTicketLoading && emailCartData.length === 0 && (
              <h3>Please Select Ticket</h3>
            )}
            {emailCartData?.length > 0 &&
              emailCartData?.map((email) => {
                return (
                  <EmailCart
                    key={email.id}
                    content={email?.body?.content}
                    email={email}
                    to={selectedTicket?.sender}
                    tabname={"closed"}
                  />
                );
              })}
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
    setEmailCartData([]);

    setSelectedTicket({});
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

export default Test;
