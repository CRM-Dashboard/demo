/* eslint-disable no-useless-concat */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo, memo } from "react";
import dayjs from "dayjs";
import CrmModal from "../../crm/components/crmModal/CrmModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { IconButton, Box, Button, Typography, Chip } from "@mui/material";
import FileDetails from "../FileOperations/FileDetails";
import FileUploader from "../FileOperations/FileUploader";
import CrmDatePicker from "../../crm/components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";

import withTable from "../../crm/components/TableFilter/withTable";
import TableFilter from "../../crm/components/TableFilter/TableFilter";
import CustomDialog from "../components/CustomDialog";
import FormComponent from "../components/FormComponent";
import axios from "axios";
import CircularScreenLoader from "../../crm/components/circularScreenLoader/CircularScreenLoader";
const HOCTable = withTable(memo(TableFilter));

const Changes = ({ data }) => {
  const [users, setUsers] = useState([]);
  const [changeNo, setChangeNo] = useState();
  const [loading, setLoading] = useState([]);
  const [modules, setModules] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState();
  const [statuses, setStatuses] = useState([]);
  const [fileIndex, setFileIndex] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [changeTypes, setChangeTypes] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [fileUrlReqNo, setFileUrlReqNo] = useState("");
  const [openShowFiles, setOpenShowFiles] = useState(false);
  const [openFileUpload, setOpenFileUpload] = useState(false);
  const [openCreateChange, setOpenCreateChange] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const loggedInUser = reducerData.LoginReducer.loggedInUser;

  const sendMail = () => {
    const entryData = {
      PROJECT: [],
      TASK: [],
      TICKET: [],
      CHANGE: [
        {
          ...selectedItems,
          mailInd: "X",
        },
      ],
    };

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(entryData));

    // process.env.REACT_APP_SERVER_URL
    fetch(process.env.REACT_APP_SERVER_URL + `/api/activity/createProject`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          snackbar.showSuccess("Send Mail successfully!");
        }
      })
      .catch((error) => {
        if (error) {
          snackbar.showError("Error while Sending Mail. Please try again!");
        }
      });
  };

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTableBodyCell: {
          styleOverrides: {
            root: {
              paddingTop: "0.2em",
              paddingBottom: "0.2em",
              fontSize: "0.7rem",
            },
          },
        },
        MUIDataTableSelectCell: {
          styleOverrides: {
            headerCell: {
              backgroundColor: "#4D7AFF",
              color: "white",
            },
          },
        },
        MUIDataTableHeadCell: {
          styleOverrides: {
            data: {
              fontSize: "0.8rem",
              fontWeight: "bold",
            },
            root: {
              backgroundColor: "#4D7AFF",
              color: "white",
            },
          },
        },
      },
    });

  const getTableData = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    setLoading(true);
    // process.env.REACT_APP_SERVER_URL +
    fetch(
      // `https://gera-crm-server.azurewebsites.net//api/activity/getProjectTracker`,
      `${process.env.REACT_APP_SERVER_URL}/api/activity/getProjectTracker`,
      { method: "POST", body: formData }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data?.length > 0) {
          setUsers(data[0].user);
          setModules(data[0].module);
          setProjects(data[0].project);
          setChangeTypes(data[0].changeTyp);
          setStatuses(data[0].projectStatus);
          setPriorities(data[0].projectPriority);
          setLoading(false);

          const addedId = data[0].change?.map((proj) => {
            const obj = { ...proj };
            obj.id = proj.changeNo;
            return obj;
          });
          setTableData(addedId);
        }
      });
  };

  const getFilesCount = () => {
    const formData = new FormData();
    formData.append("reqNo", changeNo);
    formData.append("orderId", projectId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("process", "TRACKER");
    fetch(
      // "https://gera-crm-server.azurewebsites.net//api/activity/getFileUrlsByReqNo",
      `${process.env.REACT_APP_SERVER_URL}` +
        "/api/activity/getFileUrlsByReqNo",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const maxLoIndex = data?.data?.reduce((max, current) => {
            return current.loIndex > max ? current.loIndex : max;
          }, -Infinity);
          setFileIndex(data.data.length === 0 ? data.data.length : maxLoIndex);
        }
      });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "LOW":
        return "#89CFF0";
      case "MEDIUM":
        return "#0066b2";
      case "HIGH":
        return "#0000FF";
      default:
        return "inherit";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "1":
        return "#6A5ACD";
      case "2":
        return "#FEBE10";
      case "3":
        return "#006400";
      default:
        return "inherit";
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Change Description",
        accessor: "ddtext",
      },
      {
        Header: "Type",
        accessor: "typeTxt",
      },
      {
        Header: "Assigned To",
        accessor: "assigned",
        Cell: ({ value }) => {
          const user = users?.find((user) => user.bname === value);
          return <>{user ? user.name : ""}</>;
        },
      },
      {
        Header: "Requster",
        accessor: "requester",
        Cell: ({ value }) => {
          const user = users?.find((user) => user.bname === value);
          return <>{user ? user.name : ""}</>;
        },
      },
      {
        Header: "Module",
        accessor: "moduleTxt",
      },

      {
        Header: "Priority",
        accessor: "priority",
        Cell: ({ value }) => {
          return (
            value && (
              <Chip label={value} sx={{ color: getPriorityColor(value) }} />
            )
          );
        },
      },
      {
        Header: "Status",
        accessor: "statusTxt",
        Cell: ({ value, row }) => {
          return (
            value && (
              <Chip
                label={value}
                sx={{ color: getStatusColor(row.original.status) }}
              />
            )
          );
        },
      },

      {
        Header: "Plan Start",
        accessor: "fsavd",
        Cell: ({ value }) => {
          return (
            <CrmDatePicker
              readOnly
              height={28}
              width={125}
              iconHeight={"0.6em"}
              iconWidth={"0.6em"}
              fontSize={"0.7rem"}
              buttonBase={"1em"}
              id={`actualStart-${value}`}
              name="actualStart"
              value={value === "0000-00-00" ? "" : dayjs(value)}
            />
          );
        },
      },

      {
        Header: "Planned End Date",
        accessor: "fsedd",
        Cell: ({ value }) => {
          return (
            <CrmDatePicker
              readOnly
              height={28}
              width={125}
              iconHeight={"0.6em"}
              iconWidth={"0.6em"}
              fontSize={"0.7rem"}
              buttonBase={"1em"}
              id={`fsedd-${value}`}
              name="fsedd"
              value={value === "0000-00-00" ? "" : dayjs(value)}
            />
          );
        },
      },
      {
        Header: "Plan Days",
        accessor: "planDays",
      },
      {
        Header: "Actual Start",
        accessor: "startDt",
        Cell: ({ value }) => {
          return (
            <CrmDatePicker
              readOnly
              height={28}
              width={125}
              iconHeight={"0.6em"}
              iconWidth={"0.6em"}
              fontSize={"0.7rem"}
              buttonBase={"1em"}
              id={`fsedd-${value}`}
              name="fsedd"
              value={value === "0000-00-00" ? "" : dayjs(value)}
            />
          );
        },
      },
      {
        Header: "Actual End",
        accessor: "endDt",
        Cell: ({ value }) => {
          return (
            <CrmDatePicker
              readOnly
              height={28}
              width={125}
              iconHeight={"0.6em"}
              iconWidth={"0.6em"}
              fontSize={"0.7rem"}
              buttonBase={"1em"}
              id={`fsedd-${value}`}
              name="fsedd"
              value={value === "0000-00-00" ? "" : dayjs(value)}
            />
          );
        },
      },
      {
        Header: "Actual Days",
        accessor: "actDays",
      },
      {
        Header: "Tester",
        accessor: "tester",
        Cell: ({ value }) => {
          const user = users?.find((user) => user.bname === value);
          return <>{user ? user.name : ""}</>;
        },
      },
      {
        Header: "Technical Object",
        accessor: "objects",
      },
      {
        Header: "Notes",
        accessor: "notes",
      },
      {
        Header: "Files",
        accessor: "projectId",
        Cell: ({ value }) => {
          return (
            <IconButton
              style={{ color: "blue" }}
              onClick={() => {
                setOpenShowFiles(true);
                setFileUrlReqNo(value);
              }}
            >
              <InsertDriveFileIcon />
            </IconButton>
          );
        },
      },
    ],
    [users]
  );

  const formFields = [
    {
      label: "Change Description",
      name: "ddtext",
      type: "text",
      defaultValue: "",
    },
    {
      label: "Type",
      name: "changeType",
      type: "select",
      defaultValue: "",
      options: changeTypes.map((data) => ({
        value: data.change,
        label: data.changeTxt,
      })),
    },

    {
      label: "AssignedTo",
      name: "assigned",
      type: "select",
      defaultValue: "",
      options: users.map((data) => ({
        value: data.bname,
        label: data.name,
      })),
    },
    {
      label: "Module",
      name: "moduleSys",
      type: "select",
      defaultValue: "",
      options: modules.map((data) => ({
        value: data.module,
        label: data.moduleTxt,
      })),
    },
    {
      label: "Requster",
      name: "requester",
      type: "select",
      defaultValue: "",
      options: users.map((data) => ({
        value: data.bname,
        label: data.name,
      })),
    },
    {
      label: "Priority",
      name: "priority",
      type: "select",
      defaultValue: "",
      options: priorities.map((data) => ({
        value: data.priority,
        label: data.priority,
      })),
    },
    {
      label: "Status",
      name: "status",
      type: "select",
      defaultValue: "",
      options: statuses.map((data) => ({
        value: data.status,
        label: data.statusTxt,
      })),
    },

    // { label: "Progress", name: "progress", type: "number", defaultValue: 0 },
    { label: "Plan Start", name: "fsavd", type: "date", defaultValue: null },
    {
      label: "Planned End Date",
      name: "fsedd",
      type: "date",
      defaultValue: null,
    },
    // { label: "Plan Days", name: "planDays", type: "number", defaultValue: 0 },
    {
      label: "Actual Start",
      name: "startDt",
      type: "date",
      defaultValue: null,
    },
    { label: "Actual End", name: "endDt", type: "date", defaultValue: null },
    // { label: "Actual Days", name: "actDays", type: "number", defaultValue: 0 },
    {
      label: "Tester",
      name: "tester",
      type: "select",
      defaultValue: "",
      options: users.map((data) => ({
        value: data.bname,
        label: data.name,
      })),
    },
    {
      label: "Project",
      name: "projectId",
      type: "select",
      defaultValue: "",
      options: projects.map((data) => ({
        value: data.projectId,
        label: data.projectName,
      })),
    },
    { label: "Notes", name: "notes", type: "text", defaultValue: "" },
    // { label: "Files", name: "projectId", type: "file", defaultValue: "" },
  ];

  const memoizedData = useMemo(() => tableData, [tableData]);

  useEffect(() => {
    getTableData();
  }, []);

  const saveUrls = (fileUrls) => {
    const entryData = [];
    var Index = fileIndex;
    // eslint-disable-next-line array-callback-return
    fileUrls?.map((obj) => {
      entryData.push({
        DOKNR: changeNo, //projectId /taskId/Ticketid
        REFERENCE: projectId, //projectId
        LO_INDEX: Index + 1,
        PROCESS: "TRACKER",
        FILENAME: obj?.key?.split("/")?.pop(),
        URL: obj.url,
        AEDAT: new Date()?.toISOString()?.split("T")[0],
        AENAM: loggedInUser.name,
        AEZET: new Date()?.toLocaleTimeString("en-GB", { hour12: false }),
      });
      Index = Index + 1;
    });

    const formData = new FormData();
    formData.append("entryData", JSON.stringify(entryData));
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(
      process.env.REACT_APP_SERVER_URL + "/api/activity/saveUploadedFiles",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          snackbar.showSuccess("File URLs data saved successfully");
          setProjectId("");
        }
      });
  };

  const handleDelete = () => {
    var data = selectedItems;

    const entryData = {
      CHANGE: data,
    };

    const formdata = new FormData();
    formdata.append("userName", userName);
    formdata.append("passWord", passWord);
    formdata.append("entryData", JSON.stringify(entryData));

    fetch(
      process.env.REACT_APP_SERVER_URL + `/api/activity/deleteProjectDetails`,
      {
        method: "POST",
        body: formdata,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          snackbar.showSuccess("Change deleted successfully!");
          setOpenModal(false);
          getTableData();
        }
      })
      .catch((error) => {
        if (error) {
          snackbar.showError(
            "Error while deleting change Request. Please try again!"
          );
          setOpenModal(false);
        }
      });
  };

  function formatDate(dateString) {
    // Create a new Date object from the input date string
    const date = new Date(dateString);

    // Get the full year (e.g., 2021)
    const year = date.getFullYear();

    // Get the month (0-based index, so we add 1)
    // Pad the month with a leading zero if it's less than 10
    const month = String(date.getMonth() + 1).padStart(2, "0");

    // Get the day of the month and pad with a leading zero if it's less than 10
    const day = String(date.getDate()).padStart(2, "0");

    // Combine year, month, and day to form the desired output
    const formattedDate = `${year}${month}${day}`;
    return formattedDate;
  }

  const createUpdateChange = async (data) => {
    try {
      const changeNo =
        selectedItems.length > 0
          ? selectedItems[selectedItems.length - 1]?.changeNo
          : "";
      const entryData = {
        CHANGE: [
          {
            changeNo,
            endDt: formatDate(data.endDt),
            fsavd: formatDate(data.fsavd),
            fsedd: formatDate(data.fsedd),
            startDt: formatDate(data.startDt),
            projectId: data.projectId,
            ddtext: data.ddtext,
            changeType: data.changeType,
            assigned: data.assigned,
            moduleSys: data?.moduleSys,
            requester: data?.requester,
            priority: data.priority,
            status: data.status,
            tester: data.tester,
            notes: data.notes,
          },
        ],
        PROJECT: [],
        TICKET: [],
        TASK: [],
      };

      // Create form data
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("entryData", JSON.stringify(entryData));

      // Send POST request using axios
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/activity/createProject`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Handle success response
      snackbar.showSuccess("Change created successfully!");
      setOpenCreateChange(false);
      getTableData();
      setSelectedItems([]);
    } catch (error) {
      // Handle errors
      const errorMessage =
        error.response?.data?.message ||
        "Error while creating change. Please try again!";
      snackbar.showError(errorMessage);
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          disableElevation
          disableFocusRipple
          size="sm"
          onClick={() => {
            setOpenCreateChange(true);
          }}
          disabled={selectedItems.length > 0}
          id="create"
          sx={{
            margin: "0.2em",
            "&.MuiButton-root": {
              textTransform: "none",
              backgroundColor: "#228B22",
              height: "2em",
              fontSize: "0.8rem",
            },
          }}
        >
          New Change
        </Button>
        <Button
          variant="contained"
          disableElevation
          disableFocusRipple
          size="small"
          sx={{
            margin: "0.2em",
            "&.MuiButton-root": {
              textTransform: "none",
              backgroundColor: "#228B22",
              height: "2em",
              fontSize: "0.8rem",
            },
          }}
          disabled={selectedItems.length === 0}
          onClick={() => {
            setOpenFileUpload(true);
            getFilesCount();
          }}
        >
          Choose Files to Upload
        </Button>
        <Button
          variant="contained"
          disableElevation
          disableFocusRipple
          size="small"
          sx={{
            margin: "0.2em",
            "&.MuiButton-root": {
              textTransform: "none",
              backgroundColor: "#228B22",
              height: "2em",
              fontSize: "0.8rem",
            },
          }}
          disabled={selectedItems.length === 0}
          onClick={() => {
            sendMail();
          }}
        >
          Send Mail
        </Button>

        <Button
          variant="contained"
          disableElevation
          disableFocusRipple
          size="small"
          sx={{
            margin: "0.2em",
            "&.MuiButton-root": {
              textTransform: "none",
              backgroundColor: "#228B22",
              height: "2em",
              fontSize: "0.8rem",
            },
          }}
          disabled={selectedItems.length === 0}
          onClick={() => setOpenModal(true)}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          disableElevation
          disableFocusRipple
          size="small"
          id="edit"
          // ref={buttonRef}
          sx={{
            margin: "0.2em",
            "&.MuiButton-root": {
              textTransform: "none",
              backgroundColor: "#228B22",
              height: "2em",
              fontSize: "0.8rem",
            },
          }}
          disabled={selectedItems.length === 0}
          onClick={() => {
            // setOpenCreateForm(true);
            setOpenCreateChange(true);
          }}
        >
          Edit
        </Button>
      </div>

      {tableData.length > 0 ? (
        <ThemeProvider theme={() => getMuiTheme()}>
          <HOCTable
            columns={columns}
            data={memoizedData}
            pageSize={1000}
            pagination={false}
            select={true}
            showFilter={false}
            setSelectedItems={setSelectedItems}
            maxHeight={"80vh"}
          />
        </ThemeProvider>
      ) : (
        <CircularScreenLoader />
      )}
      <CrmModal
        maxWidth="sm"
        show={openModal}
        handleShow={() => {
          setOpenModal(false);
        }}
        primaryBtnText="Yes"
        SecondaryBtnText="No"
        primarySave={() => {
          handleDelete();
        }}
        secondarySave={() => {
          setOpenModal(false);
        }}
      >
        <Box>
          {" "}
          <Typography fontSize={20}>
            {"Are you sure you want to delete this record?"}
          </Typography>
        </Box>
      </CrmModal>

      <CustomDialog
        open={openCreateChange}
        onClose={() => setOpenCreateChange(false)}
        title={selectedItems.length > 0 ? "Upadte Change" : "Create New Change"}
        content={
          <FormComponent
            formFields={formFields}
            onCancel={() => setOpenCreateChange(false)}
            onSubmit={createUpdateChange}
            selectedValues={selectedItems[selectedItems.length - 1]}
            // validationSchema={{}}
          />
        }
      />
      <CrmModal
        maxWidth="sm"
        show={openFileUpload}
        handleShow={() => {
          setOpenFileUpload(false);
        }}
        SecondaryBtnText="Close"
        secondarySave={() => {
          setOpenFileUpload(false);
        }}
      >
        <FileUploader
          requestNo={projectId}
          setOpenFileUpload={setOpenFileUpload}
          callBack={saveUrls}
        />
      </CrmModal>
      <CrmModal
        maxWidth="sm"
        show={openShowFiles}
        handleShow={() => {
          setOpenShowFiles(false);
          setFileUrlReqNo("");
          setProjectId("");
          setChangeNo("");
        }}
        SecondaryBtnText="Close"
        secondarySave={() => {
          setOpenShowFiles(false);
          setFileUrlReqNo("");
          setProjectId("");
          setChangeNo("");
        }}
      >
        <FileDetails fileUrlReqNo={fileUrlReqNo} taskNo={changeNo} />
      </CrmModal>
    </>
  );
};

export default Changes;
