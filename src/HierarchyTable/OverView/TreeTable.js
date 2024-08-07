/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
// import moment from "moment";
import TaskTable from "./TaskTable";
import MUIDataTable from "mui-datatables";
// import CreateNewTask from "../TaskManagement/CreateNewTask";
// import CreateNewTicket from "../TicketManagement/CreateNewTicket";
// import CreateNewProject from "../ProjectManagement/CreateNewProject";
import DeleteIcon from "@mui/icons-material/Delete";
// import CrmModal from "../../crm/components/crmModal/CrmModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  // MenuItem,
  // Select,
  // Box,
  // Typography,
  Button,
  IconButton,
} from "@mui/material";
// import { DateRangePicker } from "@maxstudener/react-mui-daterange-picker";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";
import CircularScreenLoader from "../../crm/components/circularScreenLoader/CircularScreenLoader";
import "./Style.css";
import ChangeManagementTable from "./ChangeManagementTable";
// import CreateNewChange from "./CreateNewChange";
// import FileDetails from "../FileOperations/FileDetails";
const TreeTable = ({
  // data,
  secondIteration,
  openCreateForm,
  setOpenCreateForm,
  openCreateTask,
  setOpenCreateTask,
  openCreateTicket,
  setOpenCreateTicket,
  setOpenCreateChange,
  openCreateChange,
  setSelectedRows,
  selectedRows,
  taskNo,
  setTaskNo,
  projectNo,
  setProjectNo,
  changeNo,
  setChangeNo,
}) => {
  const [users, setUsers] = useState([]);
  // const [stages, setStages] = useState([]);
  const [modules, setModules] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [tableData, setTableData] = useState([]);
  // const [changeType, setChangeType] = useState([]);
  // const [dateRange, setDateRange] = useState("false");
  const [loading, setLoading] = useState(false);
  // const [priorities, setPriorities] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [rowToUpdate, setRowToUpdate] = useState([]);
  // const [openModal, setOpenModal] = useState(false);
  // const [dataToDelete, setDataToDelete] = useState("");
  // const [fileUrlReqNo, setFileUrlReqNo] = useState("");
  // const [openShowFiles, setOpenShowFiles] = useState(false);

  // const [shouldShowDateRange, setShouldShowDateRange] = useState("");

  const reducerData = useSelector((state) => state);
  // const ref = useRef(null);
  // const taskRef = useRef(null);
  // const ticketRef = useRef(null);
  // const changeRef = useRef(null);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const snackbar = UseCustomSnackbar();

  const renderExpandableRow = (rowData, rowMeta) => {
    const item = projectData[rowMeta.dataIndex];
    console.log("item***************", item);

    return (
      <>
        {item.tasks && Array.isArray(item.tasks) && item.tasks.length !== 0 ? (
          <tr key={`expandable-row-${item?.tasks?.[0]?.taskId}`}>
            <td colSpan="15" style={{ padding: "0", border: "none" }}>
              <div style={{ paddingLeft: "20px" }}>
                <TaskTable
                  data={item.tasks}
                  secondIteration="true"
                  statuses={statuses}
                  getTableData={getTableData}
                  setSelectedRows={setSelectedRows}
                  projectNo={projectNo}
                  setProjectNo={setProjectNo}
                  taskNo={taskNo}
                  setTaskNo={setTaskNo}
                  selectedRows={selectedRows}
                  setChangeNo={setChangeNo}
                />
              </div>
            </td>
          </tr>
        ) : (
          <></>
        )}
        {item.changes &&
        Array.isArray(item.changes) &&
        item.changes.length !== 0 ? (
          <tr key={`expandable-row-${item?.changes[0]?.changeNo}`}>
            <td colSpan="15" style={{ padding: "0", border: "none" }}>
              <div style={{ paddingLeft: "20px" }}>
                <ChangeManagementTable
                  data={item.changes}
                  users={users}
                  modules={modules}
                  secondIteration="true"
                  statuses={statuses}
                  getTableData={getTableData}
                  setSelectedRows={setSelectedRows}
                  projectNo={projectNo}
                  setProjectNo={setProjectNo}
                  changeNo={changeNo}
                  setChangeNo={setChangeNo}
                  selectedRows={selectedRows}
                  setTaskNo={setTaskNo}
                />
              </div>
            </td>
          </tr>
        ) : (
          <></>
        )}
      </>
    );
  };

  // const handleRowClick = (rowData, rowMeta) => {
  //   // rowData contains the data of the clicked row
  //   console.log(
  //     "Clicked row data########:",
  //     rowData,
  //     rowMeta.rowIndex,
  //     projectData[rowMeta.rowIndex]
  //   );
  //   setSelectedRows(projectData[rowMeta.rowIndex]);
  //   setProjectNo(tableData[rowMeta.rowIndex][7]);
  //   // You can perform any action with the row data here
  // };

  // const handleRowClick = (rowData, rowMeta) => {
  //   // rowData contains the data of the clicked row
  //   console.log(
  //     "Clicked row data########:",
  //     rowData,
  //     rowMeta.rowIndex,
  //     projectData[rowMeta.rowIndex]
  //   );
  //   setSelectedRows(projectData[rowMeta.rowIndex]);
  //   setProjectNo(tableData[rowMeta.rowIndex]?.[7]);
  //   // You can perform any action with the row data here
  // };

  const getRowStyle = (rowData, rowMeta) => {
    console.log("selectedRows!!!!!!!!", selectedRows, rowMeta);
    const selected = selectedRows.includes(rowMeta.dataIndex);

    return {
      backgroundColor: selected ? "#b0e0e6" : "inherit", // You can change the color as per your preference
    };
  };

  // const handleDelete = () => {
  //   // eslint-disable-next-line no-use-before-define
  //   var data = dataToDelete;

  //   const entryData = {
  //     PROJECT: [data],
  //     TASK: [data?.tasks],
  //     TICKET: [data?.tickets],
  //   };

  //   const formdata = new FormData();
  //   formdata.append("userName", userName);
  //   formdata.append("passWord", passWord);
  //   formdata.append("entryData", JSON.stringify(entryData));

  //   fetch(
  //     process.env.REACT_APP_SERVER_URL + `/api/activity/deleteProjectDetails`,
  //     {
  //       method: "POST",
  //       body: formdata,
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data) {
  //         snackbar.showSuccess("Project deleted successfully!");
  //         // setOpenModal(false);
  //         getTableData();
  //       }
  //     })
  //     .catch((error) => {
  //       if (error) {
  //         snackbar.showError("Error while deleting project. Please try again!");
  //         // setOpenModal(false);
  //       }
  //     });
  // };

  const options = {
    expandableRows: true,
    print: false,
    download: false,
    search: false,
    filter: false,
    viewColumns: false,
    selectableRows: "none",
    renderExpandableRow,
    hideToolbar: true,
    pagination: false,
    columnOptions: {
      display: "false",
    },
    setRowProps: () => {
      return {
        style: {
          height: "10px", // Adjust the height as per your requirement
        },
      };
    },
    rowStyle: getRowStyle,
    selection: true,
    // onRowClick: handleRowClick, // Retain this for row clicks
    // onRowsSelect: (currentRowsSelected, allRowsSelected) => {
    //   const lastRowIndex = allRowsSelected[allRowsSelected.length - 1]?.index;
    //   handleRowClick(tableData[lastRowIndex], { rowIndex: lastRowIndex });
    // },
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <Button
        color="secondary"
        onClick={() => {
          const idsToDelete = selectedRows.data.map(
            (row) => displayData[row.index].dataIndex
          );
          console.log("Ids to delete***********:", idsToDelete);
          console.log(
            "data to delete***********:",
            projectData[idsToDelete],
            projectData
          );
          // setDataToDelete(projectData[idsToDelete]);
          // setOpenModal(true);
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
      // options: {
      //   customBodyRenderLite: (dataIndex, rowIndex) => [
      //     <input
      //       type="text"
      //       value={tableData[dataIndex][0]}
      //       onChange={(e) => {
      //         const row = projectData[dataIndex];
      //         row.projectName = e.target.value;
      //         delete row.tasks;
      //         console.log("rowToUpdate$$$$$$$$$$", row);
      //         setRowToUpdate(row);

      //         handleCellEdit(e, rowIndex, 0);
      //       }}
      //     />,
      //   ],
      // },
    },
    "Description",
    "Start Date",
    "Project Manager",
    {
      name: "Status",
      // options: {
      //   customBodyRenderLite: (dataIndex, rowIndex) => [
      //     <Select
      //       sx={{
      //         "& .MuiOutlinedInput-input": {
      //           padding: "3px 7px 2px 7px",
      //           font: "-webkit-control",
      //           backgroundColor: getStatusColor(tableData[dataIndex][4]),
      //           color: "white",
      //           width: "8em",
      //         },
      //       }}
      //       id="status"
      //       name="status"
      //       value={tableData[dataIndex][4]}
      //       onChange={(e) => {
      //         const row = projectData[dataIndex];
      //         row.status = e.target.value;
      //         delete row.tasks;
      //         console.log("rowToUpdate$$$$$$$$$$", row);
      //         setRowToUpdate(row);

      //         handleCellEdit(e, rowIndex, 4);
      //       }}
      //     >
      //       {statuses.map((data) => {
      //         return (
      //           <MenuItem
      //             value={data.status}
      //             sx={{
      //               "&.MuiButtonBase-root": {
      //                 backgroundColor: getStatusColor(data.status),
      //                 color: "white",
      //               },
      //             }}
      //           >
      //             {" "}
      //             {data.statusTxt}
      //           </MenuItem>
      //         );
      //       })}
      //     </Select>,
      //   ],
      // },
    },
    "Progress",
    // { name: "Files" },
  ];

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "1":
  //       return "#CC33FF";
  //     case "2":
  //       return "#CCCC00";
  //     case "3":
  //       return "#FF3300";
  //     case "4":
  //       return "#009900";
  //     case "5":
  //       return "#B80000";
  //     default:
  //       return "inherit";
  //   }
  // };

  useEffect(() => {
    console.log(
      "$$$$$$$$$$Object.keys(rowToUpdate).length > 0",
      Object.keys(rowToUpdate)
    );
    if (Object.keys(rowToUpdate).length > 1) {
      updateProject(rowToUpdate);
    }
  }, [rowToUpdate]);

  const updateProject = (updatedData) => {
    console.log("updatedData!!!!!!!!!!!", updatedData);
    const entryData = {
      PROJECT: [updatedData],
      TASK: [],
      TICKET: [],
    };

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(entryData));

    // if (Object?.keys(data).length > 0) {
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
        console.log("########error", error);
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

  // const createNewProject = () => {
  //   console.log("######createNewProject");
  //   if (ref.current) {
  //     ref.current.createProject();
  //   }
  // };

  // const createNewTask = () => {
  //   console.log("######createNewProject");
  //   if (taskRef.current) {
  //     taskRef.current.createTask();
  //   }
  // };

  // const createNewTicket = () => {
  //   if (ticketRef.current) {
  //     ticketRef.current.createTicket();
  //   }
  // };

  // const createNewChange = () => {
  //   console.log("##############changeRef.current", changeRef.current);
  //   if (changeRef.current) {
  //     changeRef.current.createChange();
  //   }
  // };

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
            // setOpenShowFiles(true);
            // setFileUrlReqNo(item?.projectId);
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
    // process.env.REACT_APP_SERVER_URL +
    fetch(
      `https://gera-crm-server.azurewebsites.net//api/activity/getProjectTracker`,
      // `http://localhost:5000/api/activity/getProjectTracker`,
      { method: "POST", body: formData }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          console.log("#########Hierarchy table data", data);
          setUsers(data[0].user);
          setModules(data[0].module);
          // setChangeType(data[0].changeTyp);
          // setStages(data[0].projectStage);
          setStatuses(data[0].projectStatus);
          setProjectData(data[0].tree);
          setTableData(modifyResponse(data[0].tree));
          // setPriorities(data[0].projectPriority);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    getTableData();
  }, []);

  // const handleNameChange = (e, rowIndex) => {
  //   const newData = [...tableData];
  //   newData[rowIndex][0] = e.target.value; // Update the Name field value
  //   setTableData(newData);
  // };

  // const handleCellEdit = (e, rowIndex, colIndex) => {
  //   const newData = [...tableData];
  //   newData[rowIndex][colIndex] = e.target.value; // Update the Name field value
  //   console.log("########newData", newData);
  //   setTableData(newData);
  //   // if (colIndex == 4) {
  //   // }
  // };

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTableHeadCell: {
          styleOverrides: {
            root: {
              backgroundColor: "#0033CC",
              color: "white",
            },
          },
        },
        MUIDataTableSelectCell: {
          styleOverrides: {
            headerCell: {
              backgroundColor: "#0033CC",
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

  return (
    <>
      {!loading ? (
        <ThemeProvider theme={() => getMuiTheme()}>
          <MUIDataTable
            data={tableData}
            columns={
              secondIteration === "true"
                ? columns.map((column) => ({
                    ...column,
                    options: { ...(column.options || {}), hideHeader: true }, // Hides the header of each column
                  }))
                : columns
            }
            options={options}
          />
        </ThemeProvider>
      ) : (
        <CircularScreenLoader />
      )}

      {/* <CrmModal
        maxWidth="md"
        show={shouldShowDateRange}
        handleShow={() => {
          setShouldShowDateRange(false);
        }}
        primaryBtnText="Save"
        primarySave={() => {
          console.log(
            "range.startDate########",
            moment(dateRange.startDate).format("DD/MM/YYYY") +
              "-" +
              moment(dateRange.endDate).format("DD/MM/YYYY")
          );
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
            console.log("######range", range);
            setDateRange(range);
          }}
        />
      </CrmModal> */}

      {/* <CrmModal
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
      </CrmModal> */}

      {/* <CrmModal
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
          // priorities={priorities}
          ref={taskRef}
          users={users}
          selectedRows={selectedRows}
          getTableData={getTableData}
          setOpenCreateTask={setOpenCreateTask}
        />
      </CrmModal> */}

      {/* <CrmModal
        maxWidth="sm"
        show={openCreateTicket}
        handleShow={() => {
          setOpenCreateTicket(false);
        }}
        primaryBtnText="Save"
        primarySave={() => {
          createNewTicket();
        }}
        SecondaryBtnText="Close"
        secondarySave={() => {
          setOpenCreateTicket(false);
        }}
      >
        <CreateNewTicket
          statuses={statuses}
          priorities={priorities}
          ref={ticketRef}
          users={users}
          selectedRows={selectedRows}
          getTableData={getTableData}
          setOpenCreateTicket={setOpenCreateTicket}
        />
      </CrmModal> */}
      {/* <CrmModal
        maxWidth="sm"
        show={openCreateChange}
        handleShow={() => {
          setOpenCreateChange(false);
        }}
        primaryBtnText="Save"
        primarySave={() => {
          createNewChange();
        }}
        SecondaryBtnText="Close"
        secondarySave={() => {
          setOpenCreateChange(false);
        }}
      >
        <CreateNewChange
          statuses={statuses}
          priorities={priorities}
          ref={changeRef}
          users={users}
          selectedRows={selectedRows}
          getTableData={getTableData}
          setOpenCreateChange={setOpenCreateChange}
          changeType={changeType}
          modules={modules}
        />
      </CrmModal> */}
      {/* <CrmModal
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
      </CrmModal> */}
      {/* <CrmModal
        maxWidth="sm"
        show={openShowFiles}
        handleShow={() => {
          setOpenShowFiles(false);
          setFileUrlReqNo("");
          setProjectNo("");
          setTaskNo("");
          setChangeNo("");
        }}
        SecondaryBtnText="Close"
        secondarySave={() => {
          setOpenShowFiles(false);
          setFileUrlReqNo("");
          setProjectNo("");
          setTaskNo("");
          setChangeNo("");
        }}
      >
        <FileDetails fileUrlReqNo={fileUrlReqNo} />
      </CrmModal> */}
    </>
  );
};

export default TreeTable;
