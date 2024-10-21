/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import dayjs from "dayjs";
import MUIDataTable from "mui-datatables";
import { useSelector } from "react-redux";
import CreateNewProject from "./CreateNewProject";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDetails from "../FileOperations/FileDetails";
import FileUploader from "../FileOperations/FileUploader";
import CrmModal from "../../crm/components/crmModal/CrmModal";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { DateRangePicker } from "@maxstudener/react-mui-daterange-picker";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";
import {
  MenuItem,
  Select,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CrmDatePicker from "../../crm/components/crmDatePicker/CrmDatePicker";
import CircularScreenLoader from "../../crm/components/circularScreenLoader/CircularScreenLoader";
import CircularProgressWithLabel from "../../crm/components/CircularProgressWithLabel/circularProgressWithLabel";

const Projects = () => {
  const [users, setUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [stages, setStages] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [projectId, setProjectId] = useState();
  const [loading, setLoading] = useState(false);
  const [fileIndex, setFileIndex] = useState(0);
  const [categories, setCategory] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [rowToUpdate, setRowToUpdate] = useState([]);
  const [dateRange, setDateRange] = useState("false");
  const [dataToDelete, setDataToDelete] = useState("");
  const [selectedRows, setSelectedRows] = useState("");
  const [fileUrlReqNo, setFileUrlReqNo] = useState("");
  const [openShowFiles, setOpenShowFiles] = useState(false);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openFileUpload, setOpenFileUpload] = useState(false);
  const [shouldShowDateRange, setShouldShowDateRange] = useState("");

  const reducerData = useSelector((state) => state);
  const ref = useRef(null);
  const taskRef = useRef(null);
  const ticketRef = useRef(null);
  const fileInputRef = useRef(null);
  const snackbar = UseCustomSnackbar();
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const loggedInUser = reducerData.LoginReducer.loggedInUser;

  const sendMail = () => {
    const entryData = {
      PROJECT: [
        {
          ...selectedRows,
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
    formData.append("reqNo", projectId);
    formData.append("orderId", projectId);
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

  const handleRowClick = (rowData, rowMeta) => {
    setProjectId(rowData?.[15]);
    setSelectedRows(projectData[rowMeta?.rowIndex]);
  };

  const getRowStyle = (rowData, rowMeta) => {
    const selected = selectedRows.includes(rowMeta?.dataIndex);

    return {
      backgroundColor: selected ? "#b0e0e6" : "inherit", // You can change the color as per your preference
    };
  };

  const handleDelete = () => {
    // eslint-disable-next-line no-use-before-define
    var data = dataToDelete;

    const entryData = {
      PROJECT: [data],
      TASK: [data?.tasks],
      TICKET: [data?.tickets],
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

  const options = {
    pagination: false,
    print: false,
    download: false,
    search: false,
    filter: false,
    viewColumns: false,
    selectableRows: "single",
    hideToolbar: true,
    columnOptions: {
      display: "false",
    },
    rowStyle: getRowStyle,
    selection: true,
    textLabels: {
      selectedRows: {
        text: "",
        delete: "Delete",
        deleteAria: "Delete Selected Rows",
      },
    },
    onRowsSelect: (currentRowsSelected, allRowsSelected) => {
      const lastRowIndex = allRowsSelected[allRowsSelected.length - 1]?.index;
      handleRowClick(tableData[lastRowIndex], { rowIndex: lastRowIndex });
    },
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <Button
        color="secondary"
        onClick={() => {
          const idsToDelete = selectedRows.data.map(
            (row) => displayData[row.index].dataIndex
          );
          setDataToDelete(projectData[idsToDelete]);
          setOpenModal(true);
          setSelectedRows([]);
        }}
      >
        <DeleteIcon />
      </Button>
    ),
  };

  const columns = [
    // { name: "Rank" },
    {
      name: "Category",
    },
    {
      name: "Name",
    },
    "Description",
    "Project Manager",
    {
      name: "Priority",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "6.5px 14px 5px 14px",
                font: "-webkit-control",
                color: "white",
                backgroundColor: getPriorityColor(tableData[dataIndex][4]),
                fontSize: "0.7rem",
                width: "6em",
              },
            }}
            id="priority"
            name="priority"
            value={tableData[dataIndex][4]}
            onChange={(e) => {
              const row = projectData[dataIndex];
              row.priority = e.target.value;
              delete row.task;
              delete row.ticket;
              setRowToUpdate(row);
              handleCellEdit(e, rowIndex, 4);
            }}
          >
            {priorities.map((data) => {
              return (
                <MenuItem
                  sx={{
                    "&.MuiButtonBase-root": {
                      backgroundColor: getPriorityColor(data.priority),
                      color: "white",
                      fontSize: "0.8rem",
                    },
                  }}
                  value={data.priority}
                >
                  {" "}
                  {data.priority}
                </MenuItem>
              );
            })}
          </Select>,
        ],
      },
    },
    {
      name: "Status",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "6.5px 14px 5px 14px",
                font: "-webkit-control",
                backgroundColor: getStatusColor(tableData[dataIndex][5]),
                color: "white",
                width: "7em",
                fontSize: "0.7rem",
              },
            }}
            id="status"
            name="status"
            value={tableData[dataIndex][5]}
            onChange={(e) => {
              const row = projectData[dataIndex];
              row.status = e.target.value;
              delete row.task;

              setRowToUpdate(row);
              handleCellEdit(e, rowIndex, 5);
            }}
          >
            {statuses.map((data) => {
              return (
                <MenuItem
                  value={data.status}
                  sx={{
                    "&.MuiButtonBase-root": {
                      backgroundColor: getStatusColor(data.status),
                      color: "white",
                      fontSize: "0.8rem",
                    },
                  }}
                >
                  {" "}
                  {data.statusTxt}
                </MenuItem>
              );
            })}
          </Select>,
        ],
      },
    },
    {
      name: "Stage",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                backgroundColor: getStageColor(tableData[dataIndex][6]),
                color: "white",
                padding: "6.5px 14px 5px 14px",
                font: "-webkit-control",
                fontSize: "0.7rem",
                width: "15.5em",
              },
            }}
            id="stage"
            name="stage"
            value={tableData[dataIndex][6]}
            onChange={(e) => {
              const row = projectData[dataIndex];
              row.stage = e.target.value;
              delete row.task;
              delete row.ticket;
              setRowToUpdate(row);

              handleCellEdit(e, rowIndex, 6);
            }}
          >
            {stages.map((data) => {
              return (
                <MenuItem
                  value={data.stage}
                  sx={{
                    "&.MuiButtonBase-root": {
                      backgroundColor: getStageColor(data.stage),
                      color: "white",
                      fontSize: "0.8rem",
                    },
                  }}
                >
                  {" "}
                  {data.stageTxt}
                </MenuItem>
              );
            })}
          </Select>,
        ],
      },
    },
    { name: "Progress" },
    {
      name: "Plan Start",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => (
          <CrmDatePicker
            height={28}
            width={125}
            iconHeight={"0.6em"}
            iconWidth={"0.6em"}
            fontSize={"0.7rem"}
            buttonBase={"1em"}
            id={`planStart-${dataIndex}`}
            name="planStart"
            value={
              tableData[dataIndex][8] === "0000-00-00"
                ? ""
                : dayjs(tableData[dataIndex][8])
            }
            onChange={(date) => {
              const row = projectData[dataIndex];
              row.fsavd = dayjs(date).format("YYYYMMDD");
              delete row.task;
              delete row.ticket;

              setRowToUpdate(row);
              handleDateChange(date, rowIndex, 8);
            }}
          />
        ),
      },
    },
    {
      name: "Planned End Date",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => (
          <CrmDatePicker
            height={28}
            width={125}
            iconHeight={"0.6em"}
            iconWidth={"0.6em"}
            fontSize={"0.7rem"}
            buttonBase={"1em"}
            id={`planEnd-${dataIndex}`}
            name="planEnd"
            value={
              tableData[dataIndex][9] === "0000-00-00"
                ? ""
                : dayjs(tableData[dataIndex][9])
            }
            onChange={(date) => {
              const row = projectData[dataIndex];
              row.fsedd = dayjs(date).format("YYYYMMDD");
              delete row.task;
              delete row.ticket;

              setRowToUpdate(row);
              handleDateChange(date, rowIndex, 9);
            }}
          />
        ),
      },
    },
    { name: "Plan Days" },
    {
      name: "Actual Start",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => (
          <CrmDatePicker
            height={28}
            width={125}
            iconHeight={"0.6em"}
            iconWidth={"0.6em"}
            fontSize={"0.7rem"}
            buttonBase={"1em"}
            id={`actualStart-${dataIndex}`}
            name="actualStart"
            value={
              tableData[dataIndex][11] === "0000-00-00"
                ? ""
                : dayjs(tableData[dataIndex][11])
            }
            onChange={(date) => {
              const row = projectData[dataIndex];
              row.startDt = dayjs(date).format("YYYYMMDD");
              delete row.task;
              delete row.ticket;

              setRowToUpdate(row);
              handleDateChange(date, rowIndex, 11);
            }}
          />
        ),
      },
    },
    {
      name: "Actual End",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => (
          <CrmDatePicker
            height={28}
            width={125}
            iconHeight={"0.6em"}
            iconWidth={"0.6em"}
            fontSize={"0.7rem"}
            buttonBase={"1em"}
            id={`actualEnd-${dataIndex}`}
            name="actualEnd"
            value={
              tableData[dataIndex][12] === "0000-00-00"
                ? ""
                : dayjs(tableData[dataIndex][12])
            }
            onChange={(date) => {
              const row = projectData[dataIndex];
              row.endDt = dayjs(date).format("YYYYMMDD");
              delete row.task;
              delete row.ticket;

              setRowToUpdate(row);
              handleDateChange(date, rowIndex, 12);
            }}
          />
        ),
      },
    },
    { name: "Actual Days" },
    { name: "Files" },
  ];

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

  useEffect(() => {
    if (Object.keys(rowToUpdate).length > 1) {
      updateProject(rowToUpdate);
    }
  }, [rowToUpdate]);

  const updateProject = (updatedData) => {
    const entryData = {
      PROJECT: [updatedData],
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
          snackbar.showSuccess("Project updated successfully!");
          setOpenCreateForm(false);
          setSelectedRows([]);
          setRowToUpdate("");
          getTableData();
        }
      })
      .catch((error) => {
        if (error) {
          snackbar.showError(
            "Error while updating activity. Please try again!"
          );
        }
      });
  };

  const createNewProject = () => {
    if (ref.current) {
      ref.current.createProject();
    }
  };

  const handleFileUpload = (project) => {};

  const handleFileChange = (e) => {
    // Uploaded file
    const file = e.target.files[0];
    // Changing file state
    setFile(file);
  };

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        // item.rank,
        item.categTxt,
        item.projectName,
        item.projectDesc,
        item.projectMgr,
        item.priority,
        item.status,
        item.stage,
        <CircularProgressWithLabel value={item?.progress} />,
        item.fsavd,
        item.fsedd,
        item.planDays,
        item.startDt,
        item.endDt,
        item.actDays,
        <IconButton
          style={{ color: "blue" }}
          onClick={() => {
            setOpenShowFiles(true);
            setFileUrlReqNo(item?.projectId);
          }}
        >
          <InsertDriveFileIcon />
        </IconButton>,
        item?.projectId,
      ];
    });

    return modifiedResponse;
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
          setProjectData(data[0].project);
          setCategory(data[0].category);
          setStages(data[0].projectStage);
          setStatuses(data[0].projectStatus);
          setTableData(modifyResponse(data[0].project));
          setPriorities(data[0].projectPriority);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    getTableData();
  }, []);

  const handleDateChange = (date, rowIndex, colIndex) => {
    const newData = [...tableData];
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    newData[rowIndex][colIndex] = formattedDate;
    setTableData(newData);
  };

  const handleCellEdit = (e, rowIndex, colIndex) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = e.target.value; // Update the Name field value

    setTableData(newData);
    // if (colIndex == 4) {
    // }
  };

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTableBodyCell: {
          styleOverrides: {
            root: {
              fontSize: "0.7rem",
            },
          },
        },
        MUIDataTableHeadCell: {
          styleOverrides: {
            data: {
              fontSize: "0.8rem",
              fontWeight: "bold",
            },
          },
        },
      },
    });

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
            onClick={() => {
              setOpenCreateForm(true);
            }}
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
            disabled={!projectId}
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
            disabled={!projectId}
            onClick={() => {
              sendMail();
            }}
          >
            Send Mail
          </Button>
        </div>
      </div>
      {!loading ? (
        <ThemeProvider theme={() => getMuiTheme()}>
          <div
            style={{
              height: "32rem",
              overflowY: "auto", // Enable vertical scrolling
            }}
          >
            <MUIDataTable
              title={"Project"}
              data={tableData}
              columns={columns}
              options={options}
            />
          </div>
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

      <CrmModal
        maxWidth="sm"
        show={openCreateForm}
        handleShow={() => {
          setOpenCreateForm(false);
        }}
        primaryBtnText="Save"
        primarySave={() => {
          createNewProject();
        }}
        SecondaryBtnText="Close"
        secondarySave={() => {
          setOpenCreateForm(false);
        }}
      >
        <CreateNewProject
          ref={ref}
          users={users}
          stages={stages}
          statuses={statuses}
          categories={categories}
          priorities={priorities}
          getTableData={getTableData}
          setOpenCreateForm={setOpenCreateForm}
        />
      </CrmModal>

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
