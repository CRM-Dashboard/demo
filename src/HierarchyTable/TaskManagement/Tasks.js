/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import MUIDataTable from "mui-datatables";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDetails from "../FileOperations/FileDetails";
import FileUploader from "../FileOperations/FileUploader";
import CrmModal from "../../crm/components/crmModal/CrmModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import "../OverView/Style.css";
import { Grid } from "@mui/material";
import CreateNewTask from "./CreateNewTask";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";

const Tasks = () => {
  const [treeData, setTreeData] = useState([]);
  const [users, setUsers] = useState([]);
  const [taskId, setTaskId] = useState([]);
  const [projects, setProjects] = useState([]);
  const [response, setResponse] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [projectId, setProjectId] = useState();
  const [loading, setLoading] = useState(false);
  const [fileIndex, setFileIndex] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [rowToUpdate, setRowToUpdate] = useState([]);
  const [selectedRows, setSelectedRows] = useState();
  const [dataToDelete, setDataToDelete] = useState("");
  const [fileUrlReqNo, setFileUrlReqNo] = useState("");
  const [openShowFiles, setOpenShowFiles] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openFileUpload, setOpenFileUpload] = useState(false);

  const taskRef = useRef(null);
  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const loggedInUser = reducerData.LoginReducer.loggedInUser;

  const modifyResponse = (taskData) => {
    console.log("taskData############", taskData);
    const DataForTable = taskData?.map((item) => {
      return [
        item.taskDesc,
        item.startDate,
        item.assignedTo,
        item.remark,
        item.status,
        <IconButton
          style={{ color: "blue" }}
          onClick={() => {
            console.log("############item", item);
            setOpenShowFiles(true);
            setTaskId(item?.taskId);
            setProjectId(item?.projectId);
            setFileUrlReqNo(item?.projectId);
          }}
        >
          <InsertDriveFileIcon />
        </IconButton>,
        item.projectId,
        item.taskId,
        // <Battery percentage={item.percentage} />,
        // <Typography
        //   onClick={() => {
        //     setShouldShowDateRange(true);
        //   }}
        // >
        //   {dateRange ? dateRange : "Add Issue"}
        // </Typography>,
      ];
    });
    return DataForTable;
  };

  const getTableData = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    setLoading(true);
    // process.env.REACT_APP_SERVER_URL +
    fetch(
      `https://gera-crm-server.azurewebsites.net//api/activity/getProjectTracker`,
      // `http://localhost:5000/api/activity/getProjectTracker`,
      { method: "POST", body: formData }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data?.length > 0) {
          console.log("#########Hierarchy table data", data);
          setResponse(data[0]);
          setUsers(data[0].user);
          setProjectData(data[0].tree);
          setProjects(data[0].project);
          setStatuses(data[0].projectStatus);
          setTableData(modifyResponse(data[0].task));
          setLoading(false);
        }
      });
  };

  const handleRowClick = (rowData, rowMeta) => {
    // rowData contains the data of the clicked row
    console.log(
      "Clicked row data########:",
      rowData,
      rowMeta?.rowIndex,
      tableData?.[rowMeta?.rowIndex]
    );
    console.log(
      "###########tableData[rowMeta?.rowIndex]",
      tableData?.[rowMeta?.rowIndex]
    );
    setSelectedRows(projectData?.[rowMeta?.rowIndex]);
    setTaskId(tableData?.[rowMeta?.rowIndex]?.[7]);
    setProjectId(tableData?.[rowMeta?.rowIndex]?.[6]);

    const Id = tableData[rowMeta?.rowIndex]?.[6];

    const selectedTasks = response?.tree?.filter((data) => {
      if (data.projectId === projectId) {
        return data;
      }
    });
    console.log("#########selected Tasks", selectedTasks, response?.tree, Id);
    setTreeData(selectedTasks?.tasks);
    // You can perform any action with the row data here
  };

  const getRowStyle = (rowData, rowMeta) => {
    // console.log("selectedRows!!!!!!!!", selectedRows, rowMeta);
    const selected = selectedRows.includes(rowMeta.dataIndex);

    return {
      backgroundColor: selected ? "#b0e0e6" : "inherit", // You can change the color as per your preference
    };
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
    // onRowClick: handleRowClick,
    onRowsSelect: (currentRowsSelected, allRowsSelected) => {
      const lastRowIndex = allRowsSelected[allRowsSelected?.length - 1]?.index;
      handleRowClick(tableData[lastRowIndex], { rowIndex: lastRowIndex });
    },
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <Button
        color="secondary"
        onClick={() => {
          console.log("############current task id", taskId);

          const idsToDelete = response.task.filter((row) => {
            if (row.taskId === taskId) {
              return row;
            }
          });

          console.log("#######idsToDelete", idsToDelete);

          setDataToDelete(idsToDelete);
          setOpenModal(true);
          setSelectedRows([]);
        }}
      >
        <DeleteIcon />
      </Button>
    ),
  };

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

  const columns = [
    {
      name: "Task Description",
      options: {
        customBodyRender: (value, tableMeta) => (
          <input
            type="text"
            value={value}
            onChange={(e) => handleCellEdit(e, tableMeta?.rowIndex, 0)}
          />
        ),
      },
    },
    { name: "Start Date" },
    { name: "Assigned To" },
    { name: "Remark" },
    {
      name: "Status",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
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
              delete row.tickets;
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
    { name: "Files" },
  ];

  const updateTask = (updatedData) => {
    console.log("updatedData!!!!!!!!!!!", updatedData);
    const entryData = {
      PROJECT: [],
      TASK: [updatedData],
      TICKET: [],
    };
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(entryData));

    if (Object.keys(updatedData)?.length > 0) {
      fetch(process.env.REACT_APP_SERVER_URL + `/api/activity/createProject`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            snackbar.showSuccess("Task updated successfully!");
            setSelectedRows([]);
            setRowToUpdate("");
            getTableData();
          }
        })
        .catch((error) => {
          console.log("########error", error);
          if (error) {
            snackbar.showError("Error while updating task. Please try again!");
          }
        });
    } else {
      snackbar.showError("Something went wrong!");
    }
  };

  useEffect(() => {
    if (Object.keys(rowToUpdate)?.length > 1) {
      updateTask(rowToUpdate);
    }
  }, [rowToUpdate]);

  useEffect(() => {
    getTableData();
  }, []);

  const handleCellEdit = (e, rowIndex, colIndex) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = e.target.value; // Update the Name field value
    setTableData(newData);
  };

  const handleDelete = () => {
    // eslint-disable-next-line no-use-before-define

    var data = dataToDelete;

    const entryData = {
      PROJECT: [],
      TASK: data,
      TICKET: data?.tickets ? [data?.tickets] : [],
    };

    console.log("tasks to delete@@@@@@@@", entryData);
    console.log("ticket to delete@@@@@@@@", entryData);
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
          snackbar.showSuccess("Task deleted successfully!");
          setOpenModal(false);
          getTableData();
        }
      })
      .catch((error) => {
        if (error) {
          snackbar.showError("Error while deleting Task. Please try again!");
          setOpenModal(false);
        }
      });
  };

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTableHeadCell: {
          styleOverrides: {
            root: {
              backgroundColor: "#00CCCC",
              color: "white",
            },
          },
        },
        MUIDataTableSelectCell: {
          styleOverrides: {
            headerCell: {
              backgroundColor: "#00CCCC",
              color: "white",
            },
          },
        },
        MuiCheckbox: {
          styleOverrides: {
            root: {
              // color: "blue",
              padding: "2px",
              //  GlobalFunctions.getThemeBasedDatailsColour(
              //   reducerData.ThemeReducer.mode
              // ),
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              // color: "blue",
              padding: "4px",
              //  GlobalFunctions.getThemeBasedDatailsColour(
              //   reducerData.ThemeReducer.mode
              // ),
            },
          },
        },
      },
    });

  const createNewTask = () => {
    console.log("######createNewProject");
    if (taskRef.current) {
      taskRef.current.createTask();
    }
  };

  const getFilesCount = () => {
    const formData = new FormData();
    formData.append("reqNo", taskId);
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

  const saveUrls = (fileUrls) => {
    const entryData = [];
    console.log("################fileIndex", fileIndex);
    var Index = fileIndex;
    // eslint-disable-next-line array-callback-return
    fileUrls?.map((obj) => {
      entryData.push({
        DOKNR: taskId, //projectId /taskId/Ticketid
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
              setOpenCreateTask(true);
            }}
            sx={{
              margin: "0.2em",
              "&.MuiButton-root": {
                textTransform: "none",
                backgroundColor: "#228B22",
              },
            }}
          >
            New Task
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
      <Grid>
        {tableData?.length > 0 && (
          <ThemeProvider theme={() => getMuiTheme()}>
            <MUIDataTable
              data={tableData}
              style={{ width: "100%" }}
              columns={columns}
              options={options}
            />
          </ThemeProvider>
        )}

        <CrmModal
          maxWidth="sm"
          show={openCreateTask}
          handleShow={() => {
            setOpenCreateTask(false);
          }}
          primaryBtnText="Save"
          primarySave={() => {
            createNewTask();
          }}
          SecondaryBtnText="Close"
          secondarySave={() => {
            setOpenCreateTask(false);
          }}
        >
          <CreateNewTask
            // stages={stages}
            statuses={statuses}
            projects={projects}
            // priorities={priorities}
            ref={taskRef}
            users={users}
            selectedRows={selectedRows}
            getTableData={getTableData}
            setOpenCreateTask={setOpenCreateTask}
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
            setTaskId("");
          }}
          SecondaryBtnText="Close"
          secondarySave={() => {
            setOpenShowFiles(false);
            setFileUrlReqNo("");
            setProjectId("");
            setTaskId("");
          }}
        >
          <FileDetails fileUrlReqNo={fileUrlReqNo} taskNo={taskId} />
        </CrmModal>
      </Grid>
    </>
  );
};

export default Tasks;
