/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, memo, useMemo } from "react";
import moment from "moment";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import FileDetails from "../FileOperations/FileDetails";
import FileUploader from "../FileOperations/FileUploader";
import CrmModal from "../../crm/components/crmModal/CrmModal";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { DateRangePicker } from "@maxstudener/react-mui-daterange-picker";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";
import { Button, Typography, IconButton, Grid, Chip } from "@mui/material";
import CrmDatePicker from "../../crm/components/crmDatePicker/CrmDatePicker";
import CircularScreenLoader from "../../crm/components/circularScreenLoader/CircularScreenLoader";
import CircularProgressWithLabel from "../../crm/components/CircularProgressWithLabel/circularProgressWithLabel";
import withTable from "../../crm/components/TableFilter/withTable";
import TableFilter from "../../crm/components/TableFilter/TableFilter";
import CustomDialog from "../components/CustomDialog";
import FormComponent from "../components/FormComponent";
import axios from "axios";
const HOCTable = withTable(memo(TableFilter));

const Projects = () => {
  const [users, setUsers] = useState([]);
  const [stages, setStages] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [projectId, setProjectId] = useState();
  const [loading, setLoading] = useState(false);
  const [fileIndex, setFileIndex] = useState(0);
  const [categories, setCategory] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [dateRange, setDateRange] = useState("false");
  const [fileUrlReqNo, setFileUrlReqNo] = useState("");
  const [openShowFiles, setOpenShowFiles] = useState(false);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openFileUpload, setOpenFileUpload] = useState(false);
  const [shouldShowDateRange, setShouldShowDateRange] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const buttonRef = useRef(null);

  const reducerData = useSelector((state) => state);

  const snackbar = UseCustomSnackbar();
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const loggedInUser = reducerData.LoginReducer.loggedInUser;

  const sendMail = () => {
    const entryData = {
      PROJECT: [
        {
          ...selectedItems,
          mailInd: "X",
        },
      ],
      TASK: [],
      TICKET: [],
    };

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(entryData));

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
          snackbar.showError("Error while sending mail!");
        }
      });
  };

  const saveUrls = (fileUrls) => {
    const entryData = [];
    var Index = fileIndex;
    // eslint-disable-next-line array-callback-return
    fileUrls?.map((obj) => {
      entryData.push({
        DOKNR: projectId, //projectId /taskId/Ticketid
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

  const getFilesCount = () => {
    const formData = new FormData();
    formData.append("reqNo", selectedItems[0]?.projectId);
    formData.append("orderId", selectedItems[0]?.projectId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("process", "TRACKER");
    fetch(
      process.env.REACT_APP_SERVER_URL + "/api/activity/getFileUrlsByReqNo",
      // "http://localhost:5000/api/activity/getFileUrlsByReqNo",
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

  const handleDelete = () => {
    var data = selectedItems;

    const entryData = {
      PROJECT: [data[0]],
      TASK: [data[0]?.tasks],
      TICKET: [data[0]?.tickets],
    };
    const formData = new FormData();

    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(entryData));

    fetch(
      process.env.REACT_APP_SERVER_URL + "/api/activity/deleteProjectDetails",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          snackbar.showSuccess("Task deleted successfully!");
          setOpenModal(false);
          getTableData();
        }
      })
      .catch((error) => {
        if (error) {
          snackbar.showError("Error while deleting project. Please try again!");
          setOpenModal(false);
        }
      });
  };
  const columns = useMemo(
    () => [
      {
        Header: "Category",
        accessor: "categTxt",
      },
      {
        Header: "Name",
        accessor: "projectName",
      },
      {
        Header: "Description",
        accessor: "projectDesc",
      },
      {
        Header: "Project Manager",
        accessor: "projectMgr",
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
        Header: "Stage",
        accessor: "stageTxt",
        Cell: ({ value, row }) => {
          return (
            value && (
              <Chip
                label={value}
                sx={{ color: getStageColor(row.original.stage) }}
              />
            )
          );
        },
      },

      {
        Header: "Progress",
        accessor: "progress",
        Cell: ({ value }) => {
          return <CircularProgressWithLabel value={value} />;
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
    []
  );

  const formFields = [
    {
      label: "Category",
      name: "category",
      type: "select",
      defaultValue: "",
      options: categories.map((data) => ({
        value: data.categ,
        label: data.categTxt,
      })),
    },
    { label: "Name", name: "projectName", type: "text", defaultValue: "" },
    {
      label: "Description",
      name: "projectDesc",
      type: "text",
      defaultValue: "",
    },
    {
      label: "Project Manager",
      name: "projectMgr",
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
    {
      label: "Stage",
      name: "stage",
      type: "select",
      defaultValue: "",
      options: stages.map((data) => ({
        value: data.stage,
        label: data.stageTxt,
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
    { label: "Remarks", name: "remark", type: "text", defaultValue: "" },
    // { label: "Files", name: "projectId", type: "file", defaultValue: "" },
  ];

  const memoizedData = useMemo(() => tableData, [tableData]);

  const getStatusColor = (status) => {
    switch (status) {
      case "1":
        return "#6A5ACD";
      case "2":
        return "#FEBE10";
      case "3":
        return "#FF380D";
      case "4":
        return "#006400";
      case "5":
        return "#FF0000";
      default:
        return "inherit";
    }
  };

  const getStageColor = (status) => {
    switch (status) {
      case "1":
        return "#D8BFD8";
      case "2":
        return "#DDA0DD";
      case "3":
        return "#EE82EE";
      case "4":
        return "#662d91";
      case "5":
        return "#720e9e";
      case "6":
        return "#800080";
      default:
        return "inherit";
    }
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

  const getTableData = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    setLoading(true);
    fetch(
      // `https://gera-crm-server.azurewebsites.net//api/activity/getProjectTracker`,
      `${process.env.REACT_APP_SERVER_URL}/api/activity/getProjectTracker`,
      { method: "POST", body: formData }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setUsers(data[0].user);
          setCategory(data[0].category);
          setStages(data[0].projectStage);
          setStatuses(data[0].projectStatus);
          // setTableData(modifyResponse(data[0].project));
          const addedId = data[0].project?.map((proj) => {
            const obj = { ...proj };
            obj.id = proj.projectId;
            return obj;
          });
          // setTableData(data[0].project);
          setTableData(addedId);
          setPriorities(data[0].projectPriority);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    getTableData();
  }, []);

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

  const createProject = async (data) => {
    try {
      // Prepare project entry data
      const projectId =
        selectedItems.length > 0
          ? selectedItems[selectedItems.length - 1]?.projectId
          : "";
      const entryData = {
        PROJECT: [
          {
            projectId,
            endDt: formatDate(data.endDt),
            fsavd: formatDate(data.fsavd),
            fsedd: formatDate(data.fsedd),
            startDt: formatDate(data.startDt),
            projectName: data.projectName,
            projectDesc: data.projectDesc,
            projectMgrId: data.projManager,
            projectMgr: data.projectMgr,
            priority: data.priority,
            category: data.category,
            remark: data.remark,
            status: data.status,
            stage: data.stage,
            // progress: data.progress,
            // planDays: data.planDays,
            // actDays: data.actDays,
          },
        ],
        TASK: [],
        TICKET: [],
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
      snackbar.showSuccess("Project created successfully!");
      setOpenCreateForm(false);
      getTableData();
      setSelectedItems([]);
    } catch (error) {
      // Handle errors
      const errorMessage =
        error.response?.data?.message ||
        "Error while creating project. Please try again!";
      snackbar.showError(errorMessage);
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "#fff",
          padding: "0.5em 0",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            disableElevation
            disableFocusRipple
            size="sm"
            id="create"
            ref={buttonRef}
            onClick={() => {
              if (selectedItems.length > 0) {
                setSelectedItems([]);
              }
              setOpenCreateForm(true);
            }}
            disabled={selectedItems.length > 0}
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
            New Project
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
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            disableElevation
            disableFocusRipple
            size="small"
            id="edit"
            ref={buttonRef}
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
              setOpenCreateForm(true);
            }}
          >
            Edit
          </Button>
        </div>
      </div>
      {!loading ? (
        <ThemeProvider theme={() => getMuiTheme()}>
          <HOCTable
            columns={columns}
            data={memoizedData}
            pageSize={100}
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
        maxWidth="md"
        show={shouldShowDateRange}
        handleShow={() => {
          setShouldShowDateRange(false);
        }}
        primaryBtnText="Save"
        primarySave={() => {
          const finalRange =
            moment(dateRange.startDate).format("DD/MM/YYYY") +
            " - " +
            moment(dateRange.endDate).format("DD/MM/YYYY");
          setDateRange(finalRange);
          setShouldShowDateRange(false);
        }}
      >
        <DateRangePicker
          onChange={(range) => {
            setDateRange(range);
          }}
        />
      </CrmModal>

      <CustomDialog
        open={openCreateForm}
        onClose={() => setOpenCreateForm(false)}
        title={
          selectedItems.length > 0 ? "Upadte Project" : "Create New Project"
        }
        content={
          <FormComponent
            formFields={formFields}
            onCancel={() => setOpenCreateForm(false)}
            onSubmit={createProject}
            selectedValues={selectedItems[selectedItems.length - 1]}
            // validationSchema={{}}
          />
        }
      />

      <CustomDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={"Delete Confirmation"}
        content={
          <>
            <Grid>
              <Typography fontSize={20}>
                {"Are you sure you want to delete this record?"}
              </Typography>
              <Button variant="contained" onClick={handleDelete}>
                {" "}
                Delete
              </Button>
            </Grid>
          </>
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
        }}
        SecondaryBtnText="Close"
        secondarySave={() => {
          setOpenShowFiles(false);
          setFileUrlReqNo("");
          setProjectId("");
        }}
      >
        <FileDetails fileUrlReqNo={fileUrlReqNo} />
      </CrmModal>
    </>
  );
};

export default Projects;
