/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import MUIDataTable from "mui-datatables";
import { useSelector } from "react-redux";
import CreateNewProject from "./CreateNewProject";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDetails from "../FileOperations/FileDetails";
import FileUploader from "../FileOperations/FileUploader";
import CrmModal from "../../crm/components/crmModal/CrmModal";
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
import CircularScreenLoader from "../../crm/components/circularScreenLoader/CircularScreenLoader";

const Projects = () => {
  const [users, setUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [stages, setStages] = useState([]);

  const [statuses, setStatuses] = useState([]);
  const [projectId, setProjectId] = useState();
  const [loading, setLoading] = useState(false);
  const [fileIndex, setFileIndex] = useState(0);
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

  const saveUrls = (fileUrls) => {
    const entryData = [];
    console.log("################fileIndex", fileIndex);
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

    console.log("data*************", entryData);
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
          console.log("##############data.data.length", data.data.length, data);
          const maxLoIndex = data?.data?.reduce((max, current) => {
            return current.loIndex > max ? current.loIndex : max;
          }, -Infinity);
          setFileIndex(maxLoIndex);
        }
      });
  };

  const handleRowClick = (rowData, rowMeta) => {
    setProjectId(rowData?.[7]);
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

    fetch("/api/activity/deleteProjectDetails", {
      method: "POST",
      body: formData,
    })
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
    // expandableRows: true,
    pagination: false,
    print: false,
    download: false,
    search: false,
    filter: false,
    viewColumns: false,
    selectableRows: "single",
    // renderExpandableRow,
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
    {
      name: "Name",
      options: {
        customBodyRender: (value, tableMeta) => (
          <input
            type="text"
            value={value}
            onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 0)}
          />
        ),
      },
    },
    "Description",
    "Start Date",
    "Project Manager",
    {
      name: "Status",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "6.5px 14px 5px 14px",
                font: "-webkit-control",
                backgroundColor: getStatusColor(tableData[dataIndex][4]),
                color: "white",
                width: "8em",
              },
            }}
            id="status"
            name="status"
            value={tableData[dataIndex][4]}
            onChange={(e) => {
              const row = projectData[dataIndex];
              row.status = e.target.value;
              delete row.tasks;
              // console.log("rowToUpdate$$$$$$$$$$", row);
              setRowToUpdate(row);

              handleCellEdit(e, rowIndex, 4);
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
    "Progress",
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

  useEffect(() => {
    // console.log(
    //   "$$$$$$$$$$Object.keys(rowToUpdate).length > 0",
    //   Object.keys(rowToUpdate)
    // );
    if (Object.keys(rowToUpdate).length > 1) {
      updateProject(rowToUpdate);
    }
  }, [rowToUpdate]);

  const updateProject = (updatedData) => {
    // console.log("updatedData!!!!!!!!!!!", updatedData);
    const entryData = {
      PROJECT: [updatedData],
      TASK: [],
      TICKET: [],
    };
    // if (Object.keys(data).length > 0) {
    const formData = new FormData();

    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(entryData));

    fetch("/api/activity/createProject", { method: "POST", body: formData })
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
        // console.log("########error", error);
        if (error) {
          snackbar.showError(
            "Error while updating activity. Please try again!"
          );
        }
      });
    // } else {
    //   snackbar.showError("Something went wrong!");
    // }
  };

  const createNewProject = () => {
    console.log("######createNewProject");
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
        item.projectName,
        item.projectDesc,
        item.startDt,
        item.projectMgr,
        item.status,
        <div class="battery-container">
          <div class="battery-body">
            <div class="battery-fill"></div>
          </div>
          <div class="battery-indicator"></div>
          <div class="battery-percentage">0%</div>
        </div>,
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
    fetch(`/api/activity/getProjectTracker`, { method: "POST", body: formData })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setUsers(data[0].user);
          setProjectData(data[0].tree);
          setStages(data[0].projectStage);
          setStatuses(data[0].projectStatus);
          setTableData(modifyResponse(data[0].tree));
          setPriorities(data[0].projectPriority);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    getTableData();
  }, []);

  const handleCellEdit = (e, rowIndex, colIndex) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = e.target.value; // Update the Name field value

    setTableData(newData);
    // if (colIndex == 4) {
    // }
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
            onClick={() => {
              setOpenCreateForm(true);
            }}
            sx={{
              margin: "0.2em",
              "&.MuiButton-root": {
                textTransform: "none",
                backgroundColor: "#228B22",
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
        </div>
      </div>
      {!loading ? (
        <MUIDataTable data={tableData} columns={columns} options={options} />
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
          stages={stages}
          statuses={statuses}
          priorities={priorities}
          ref={ref}
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
