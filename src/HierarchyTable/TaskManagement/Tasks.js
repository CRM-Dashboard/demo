/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useMemo, memo } from "react";
import dayjs from "dayjs";
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
  Chip,
} from "@mui/material";
import "../OverView/Style.css";
import { Grid } from "@mui/material";
import CreateNewTask from "./CreateNewTask";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CrmDatePicker from "../../crm/components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";
import withTable from "../../crm/components/TableFilter/withTable";
import TableFilter from "../../crm/components/TableFilter/TableFilter";
import CustomDialog from "../components/CustomDialog";
import FormComponent from "../components/FormComponent";
import axios from "axios";
import CircularScreenLoader from "../../crm/components/circularScreenLoader/CircularScreenLoader";
const HOCTable = withTable(memo(TableFilter));

const Tasks = () => {
  const [treeData, setTreeData] = useState([]);
  const [users, setUsers] = useState([]);
  const [taskId, setTaskId] = useState([]);
  const [modules, setModules] = useState([]);
  const [projects, setProjects] = useState([]);
  const [response, setResponse] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [projectId, setProjectId] = useState();
  const [loading, setLoading] = useState(false);
  const [fileIndex, setFileIndex] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [changeTypes, setChangeType] = useState([]);
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

  const sendMail = () => {
    const entryData = {
      PROJECT: [],
      TASK: [
        {
          ...selectedRows,
          mailInd: "X",
        },
      ],
      TICKET: [],
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

  const modifyResponse = (taskData) => {
    const DataForTable = taskData?.map((item) => {
      return [
        item.taskDesc,
        item.type,
        item.assigned,
        item.module_sys,
        item.priority,
        item.status,
        item?.fsavd,
        item?.fsedd,
        item?.planDays,
        item?.startDt,
        item?.endDt,
        item?.actDays,
        item?.tester,
        item?.objects,
        item?.remark,
        item?.trkorr,
        <IconButton
          style={{ color: "blue" }}
          onClick={() => {
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
      // `https://gera-crm-server.azurewebsites.net//api/activity/getProjectTracker`,
      `${process.env.REACT_APP_SERVER_URL}/api/activity/getProjectTracker`,
      { method: "POST", body: formData }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data?.length > 0) {
          setResponse(data[0]);
          setUsers(data[0].user);
          setModules(data[0].module);
          setProjectData(data[0].task);
          setProjects(data[0].project);
          setChangeType(data[0].changeTyp);
          setStatuses(data[0].taskChangeStatus);
          setPriorities(data[0].projectPriority);

          const addedId = data[0].task?.map((proj) => {
            const obj = { ...proj };
            obj.id = proj.taskId;
            return obj;
          });
          setTableData(addedId);
          setLoading(false);
        }
      });
  };

  console.log("***users***", users);

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
    setTaskId(tableData?.[rowMeta?.rowIndex]?.[18]);
    setProjectId(tableData?.[rowMeta?.rowIndex]?.[17]);

    const Id = tableData[rowMeta?.rowIndex]?.[16];

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
        return "#FF380D";
      case "4":
        return "#006400";
      case "5":
        return "#FF0000";
      default:
        return "inherit";
    }
  };

  // const columns = [
  //   {
  //     name: "Task Description",
  //     // options: {
  //     //   customBodyRender: (value, tableMeta) => (
  //     //     <input
  //     //       type="text"
  //     //       style={{ fontSize: "0.7rem" }}
  //     //       value={value}
  //     //       onChange={(e) => handleCellEdit(e, tableMeta?.rowIndex, 0)}
  //     //     />
  //     //   ),
  //     // },
  //   },
  //   {
  //     name: "Type",
  //     options: {
  //       customBodyRenderLite: (dataIndex, rowIndex) => [
  //         <Select
  //           sx={{
  //             "& .MuiOutlinedInput-input": {
  //               padding: "4.5px 14px",
  //               fontSize: "0.7rem",
  //               // backgroundColor: getStatusColor(tableData[dataIndex][4]),
  //               // color: "white",
  //               width: "8em",
  //             },
  //           }}
  //           id="types"
  //           name="types"
  //           value={tableData[dataIndex][1]}
  //           onChange={(e) => {
  //             const row = projectData[dataIndex];
  //             row.type = e.target.value;
  //             console.log("##################rowon userupdate", row);
  //             delete row.tickets;
  //             setRowToUpdate(row);
  //             handleCellEdit(e, rowIndex, 1);
  //           }}
  //         >
  //           {changeTypes.map((data) => {
  //             return (
  //               <MenuItem
  //                 value={data.change}
  //                 sx={{
  //                   fontSize: "0.7rem",
  //                 }}
  //               >
  //                 {" "}
  //                 {data.changeTxt}
  //               </MenuItem>
  //             );
  //           })}
  //         </Select>,
  //       ],
  //     },
  //   },
  //   {
  //     name: "Assigned To",
  //     options: {
  //       customBodyRenderLite: (dataIndex, rowIndex) => [
  //         <Select
  //           sx={{
  //             "& .MuiOutlinedInput-input": {
  //               padding: "4.5px 14px",
  //               fontSize: "0.7rem",
  //               // backgroundColor: getStatusColor(tableData[dataIndex][4]),
  //               // color: "white",
  //               width: "8em",
  //             },
  //           }}
  //           id="assigned"
  //           name="assigned"
  //           value={tableData[dataIndex][2]}
  //           onChange={(e) => {
  //             const row = projectData[dataIndex];
  //             row.assigned = e.target.value;
  //             console.log("##################rowon userupdate", row);
  //             delete row.tickets;
  //             setRowToUpdate(row);
  //             handleCellEdit(e, rowIndex, 2);
  //           }}
  //         >
  //           {users.map((data) => {
  //             return (
  //               <MenuItem
  //                 value={data.bname}
  //                 sx={{
  //                   fontSize: "0.7rem",
  //                 }}
  //               >
  //                 {" "}
  //                 {data.name}
  //               </MenuItem>
  //             );
  //           })}
  //         </Select>,
  //       ],
  //     },
  //   },
  //   {
  //     name: "Module",
  //     options: {
  //       customBodyRenderLite: (dataIndex, rowIndex) => [
  //         <Select
  //           sx={{
  //             "& .MuiOutlinedInput-input": {
  //               padding: "4.5px 14px",
  //               fontSize: "0.7rem",
  //               width: "17em",
  //             },
  //           }}
  //           id="module"
  //           name="module"
  //           value={tableData[dataIndex][3]}
  //           onChange={(e) => {
  //             const row = projectData[dataIndex];
  //             row.module_sys = e.target.value;
  //             delete row.tickets;
  //             setRowToUpdate(row);
  //             handleCellEdit(e, rowIndex, 3);
  //           }}
  //         >
  //           {modules.map((data) => {
  //             return (
  //               <MenuItem
  //                 value={data.module}
  //                 sx={{
  //                   fontSize: "0.7rem",
  //                 }}
  //               >
  //                 {" "}
  //                 {data.moduleTxt}
  //               </MenuItem>
  //             );
  //           })}
  //         </Select>,
  //       ],
  //     },
  //   },
  //   {
  //     name: "Priority",
  //     options: {
  //       customBodyRenderLite: (dataIndex, rowIndex) => [
  //         <Select
  //           sx={{
  //             "& .MuiOutlinedInput-input": {
  //               padding: "6.5px 14px 5px 14px",
  //               font: "-webkit-control",
  //               color: "white",
  //               backgroundColor: getPriorityColor(tableData[dataIndex][4]),
  //               fontSize: "0.7rem",
  //               width: "6em",
  //             },
  //           }}
  //           id="priority"
  //           name="priority"
  //           value={tableData[dataIndex][4]}
  //           onChange={(e) => {
  //             const row = projectData[dataIndex];
  //             row.priority = e.target.value;
  //             delete row.ticket;
  //             console.log("rowToUpdate$$$$$$$$$$", row, rowIndex);
  //             setRowToUpdate(row);

  //             handleCellEdit(e, rowIndex, 4);
  //           }}
  //         >
  //           {priorities.map((data) => {
  //             return (
  //               <MenuItem
  //                 sx={{
  //                   "&.MuiButtonBase-root": {
  //                     backgroundColor: getPriorityColor(data.priority),
  //                     color: "white",
  //                     fontSize: "0.8rem",
  //                   },
  //                 }}
  //                 value={data.priority}
  //               >
  //                 {" "}
  //                 {data.priority}
  //               </MenuItem>
  //             );
  //           })}
  //         </Select>,
  //       ],
  //     },
  //   },
  //   {
  //     name: "Status",
  //     options: {
  //       customBodyRenderLite: (dataIndex, rowIndex) => [
  //         <Select
  //           sx={{
  //             "& .MuiOutlinedInput-input": {
  //               padding: "4.5px 14px",
  //               backgroundColor: getStatusColor(tableData[dataIndex][5]),
  //               color: "white",
  //               width: "8em",
  //               fontSize: "0.7rem",
  //             },
  //           }}
  //           id="status"
  //           name="status"
  //           value={tableData[dataIndex][5]}
  //           onChange={(e) => {
  //             const row = projectData[dataIndex];
  //             row.status = e.target.value;
  //             delete row.tickets;
  //             setRowToUpdate(row);

  //             handleCellEdit(e, rowIndex, 5);
  //           }}
  //         >
  //           {statuses.map((data) => {
  //             return (
  //               <MenuItem
  //                 value={data.status}
  //                 sx={{
  //                   "&.MuiButtonBase-root": {
  //                     backgroundColor: getStatusColor(data.status),
  //                     color: "white",
  //                     fontSize: "0.7rem",
  //                   },
  //                 }}
  //               >
  //                 {" "}
  //                 {data.statusTxt}
  //               </MenuItem>
  //             );
  //           })}
  //         </Select>,
  //       ],
  //     },
  //   },
  //   {
  //     name: "Plan Start",
  //     options: {
  //       customBodyRenderLite: (dataIndex, rowIndex) => (
  //         <CrmDatePicker
  //           height={28}
  //           width={125}
  //           iconHeight={"0.6em"}
  //           iconWidth={"0.6em"}
  //           fontSize={"0.7rem"}
  //           buttonBase={"1em"}
  //           id={`planStart-${dataIndex}`}
  //           name="planStart"
  //           value={
  //             tableData[dataIndex][6] === "0000-00-00"
  //               ? ""
  //               : dayjs(tableData[dataIndex][6])
  //           }
  //           onChange={(date) => {
  //             const row = projectData[dataIndex];
  //             row.fsavd = dayjs(date).format("YYYYMMDD");
  //             delete row.task;
  //             delete row.ticket;
  //             setRowToUpdate(row);
  //             handleDateChange(date, rowIndex, 6);
  //           }}
  //         />
  //       ),
  //     },
  //   },
  //   {
  //     name: "Planned End Date",
  //     options: {
  //       customBodyRenderLite: (dataIndex, rowIndex) => (
  //         <CrmDatePicker
  //           height={28}
  //           width={125}
  //           iconHeight={"0.6em"}
  //           iconWidth={"0.6em"}
  //           fontSize={"0.7rem"}
  //           buttonBase={"1em"}
  //           id={`planEnd-${dataIndex}`}
  //           name="planEnd"
  //           value={
  //             tableData[dataIndex][7] === "0000-00-00"
  //               ? ""
  //               : dayjs(tableData[dataIndex][7])
  //           }
  //           onChange={(date) => {
  //             const row = projectData[dataIndex];
  //             row.fsedd = dayjs(date).format("YYYYMMDD");
  //             delete row.task;
  //             delete row.ticket;
  //             setRowToUpdate(row);
  //             handleDateChange(date, rowIndex, 7);
  //           }}
  //         />
  //       ),
  //     },
  //   },
  //   { name: "Plan Days" },
  //   {
  //     name: "Actual Start",
  //     options: {
  //       customBodyRenderLite: (dataIndex, rowIndex) => (
  //         <CrmDatePicker
  //           height={28}
  //           width={125}
  //           iconHeight={"0.6em"}
  //           iconWidth={"0.6em"}
  //           fontSize={"0.7rem"}
  //           buttonBase={"1em"}
  //           id={`actualStart-${dataIndex}`}
  //           name="actualStart"
  //           value={
  //             tableData[dataIndex][9] === "0000-00-00"
  //               ? ""
  //               : dayjs(tableData[dataIndex][9])
  //           }
  //           onChange={(date) => {
  //             const row = projectData[dataIndex];
  //             row.startDt = dayjs(date).format("YYYYMMDD");
  //             delete row.task;
  //             delete row.ticket;
  //             console.log("rowToUpdate$$$$$$$$$$", row, rowIndex);
  //             setRowToUpdate(row);

  //             handleDateChange(date, rowIndex, 9);
  //           }}
  //         />
  //       ),
  //     },
  //   },
  //   {
  //     name: "Actual End",
  //     options: {
  //       customBodyRenderLite: (dataIndex, rowIndex) => (
  //         <CrmDatePicker
  //           height={28}
  //           width={125}
  //           iconHeight={"0.6em"}
  //           iconWidth={"0.6em"}
  //           fontSize={"0.7rem"}
  //           buttonBase={"1em"}
  //           id={`actualEnd-${dataIndex}`}
  //           name="actualEnd"
  //           value={
  //             tableData[dataIndex][10] === "0000-00-00"
  //               ? ""
  //               : dayjs(tableData[dataIndex][10])
  //           }
  //           onChange={(date) => {
  //             const row = projectData[dataIndex];
  //             row.endDt = dayjs(date).format("YYYYMMDD");
  //             delete row.task;
  //             delete row.ticket;
  //             console.log("rowToUpdate$$$$$$$$$$", row, rowIndex);
  //             setRowToUpdate(row);
  //             handleDateChange(date, rowIndex, 10);
  //           }}
  //         />
  //       ),
  //     },
  //   },
  //   { name: "Actual Days" },
  //   {
  //     name: "Tester",
  //     options: {
  //       customBodyRenderLite: (dataIndex, rowIndex) => [
  //         <Select
  //           sx={{
  //             "& .MuiOutlinedInput-input": {
  //               padding: "4.5px 14px",
  //               fontSize: "0.7rem",
  //               width: "8em",
  //             },
  //           }}
  //           id="tester"
  //           name="tester"
  //           value={tableData[dataIndex][12]}
  //           onChange={(e) => {
  //             const row = projectData[dataIndex];
  //             row.tester = e.target.value;
  //             console.log("##################rowon userupdate", row);
  //             delete row.ticket;
  //             setRowToUpdate(row);
  //             handleCellEdit(e, rowIndex, 12);
  //           }}
  //         >
  //           {users.map((data) => {
  //             return (
  //               <MenuItem
  //                 value={data.bname}
  //                 sx={{
  //                   fontSize: "0.7rem",
  //                 }}
  //               >
  //                 {" "}
  //                 {data.name}
  //               </MenuItem>
  //             );
  //           })}
  //         </Select>,
  //       ],
  //     },
  //   },
  //   { name: "Technical Objects" },
  //   { name: "Remarks" },
  //   { name: "Transport Request Number" },
  //   { name: "Files" },
  // ];

  const columns = useMemo(
    () => [
      {
        Header: "Task Description",
        accessor: "taskDesc",
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
        Header: "Remark",
        accessor: "remark",
      },
      {
        Header: "Transport Request Number",
        accessor: "trkorr",
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

  const memoizedData = useMemo(() => tableData, [tableData]);

  console.log("***memoizedData***", memoizedData);

  const updateTask = (updatedData) => {
    console.log("updatedData!!!!!!!!!!!", updatedData);
    const entryData = {
      TASK: [updatedData],
    };
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(entryData));

    if (Object.keys(updatedData)?.length > 0) {
      // process.env.REACT_APP_SERVER_URL
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

  const handleDateChange = (date, rowIndex, colIndex) => {
    const newData = [...tableData];
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    newData[rowIndex][colIndex] = formattedDate;
    console.log("formattedDate$$$$$$$$$$", formattedDate);
    console.log("newData$$$$$$$$$", newData);
    setTableData(newData);
  };

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
          setFileIndex(data.data.length === 0 ? data.data.length : maxLoIndex);
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {" "}
          <Typography variant="h4">Tasks</Typography>
        </div>
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
                height: "2em",
                fontSize: "0.8rem",
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
      <Grid>
        {tableData.length > 0 ? (
          <ThemeProvider theme={() => getMuiTheme()}>
            <HOCTable
              columns={columns}
              data={memoizedData}
              pageSize={100}
              pagination={false}
              // select={true}
              showFilter={false}
              // setSelectedItems={setSelectedItems}
              maxHeight={"80vh"}
            />
          </ThemeProvider>
        ) : (
          <CircularScreenLoader />
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
