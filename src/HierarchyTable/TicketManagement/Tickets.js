/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import MUIDataTable from "mui-datatables";
import CreateNewTicket from "./CreateNewTicket";
import DeleteIcon from "@mui/icons-material/Delete";
import CrmModal from "../../crm/components/crmModal/CrmModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  MenuItem,
  Select,
  IconButton,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import FileDetails from "../FileOperations/FileDetails";
import FileUploader from "../FileOperations/FileUploader";
import CrmDatePicker from "../../crm/components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";

const Tickets = ({ data }) => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [ticketId, setTicketId] = useState();
  const [loading, setLoading] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [projectId, setProjectId] = useState();
  const [response, setResponse] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [fileIndex, setFileIndex] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [rowToUpdate, setRowToUpdate] = useState([]);
  const [selectedRows, setSelectedRows] = useState();
  const [dataToDelete, setDataToDelete] = useState("");
  const [fileUrlReqNo, setFileUrlReqNo] = useState("");
  const [openShowFiles, setOpenShowFiles] = useState(false);
  const [openFileUpload, setOpenFileUpload] = useState(false);
  const [openCreateTicket, setOpenCreateTicket] = useState(false);

  const ticketRef = useRef();
  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const loggedInUser = reducerData.LoginReducer.loggedInUser;

  const sendMail = () => {
    const entryData = {
      PROJECT: [],
      TASK: [],
      TICKET: [
        {
          ...selectedRows,
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

  const modifyResponse = (data) => {
    const DataForTable = data?.map((item) => {
      return [
        item.category,
        item.ticketDesc,
        item.status,
        item.priority,
        item.assigned,
        item.fsavd,
        item.fsedd,
        item.planDays,
        item.startDt,
        item.endDt,
        item.actDays,
        item.remark,
        <IconButton
          style={{ color: "blue" }}
          onClick={() => {
            setOpenShowFiles(true);
            setTicketId(item?.ticketId);
            setProjectId(item?.projectId);
            setFileUrlReqNo(item?.projectId);
          }}
        >
          <InsertDriveFileIcon />
        </IconButton>,
        item.projectId,
        item.ticketId,
      ];
    });
    return DataForTable;
  };

  const createNewTicket = () => {
    if (ticketRef.current) {
      ticketRef.current.createTicket();
    }
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
          setProjects(data[0].project);
          setProjectData(data[0].ticket);
          setCategories(data[0].category);
          setStatuses(data[0].ticketStatus);
          setTableData(modifyResponse(data[0].ticket));
          setPriorities(data[0].projectPriority);
          setLoading(false);
        }
      });
  };

  const getFilesCount = () => {
    const formData = new FormData();
    formData.append("reqNo", ticketId);
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
    setSelectedRows(projectData?.[rowMeta?.rowIndex]);
    setTicketId(tableData?.[rowMeta?.rowIndex]?.[14]);
    setProjectId(tableData?.[rowMeta?.rowIndex]?.[13]);

    const Id = tableData[rowMeta?.rowIndex]?.[6];

    const selectedTicket = response?.tree?.filter((data) => {
      if (data.projectId === projectId) {
        return data;
      }
    });
    setTreeData(selectedTicket?.ticket);
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
    // onRowClick: handleRowClick,
    onRowsSelect: (currentRowsSelected, allRowsSelected) => {
      const lastRowIndex = allRowsSelected[allRowsSelected?.length - 1]?.index;
      handleRowClick(tableData[lastRowIndex], { rowIndex: lastRowIndex });
    },
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <Button
        color="secondary"
        onClick={() => {
          const idsToDelete = response.ticket.filter((row) => {
            if (row.ticketId === ticketId) {
              return row;
            }
          });

          setDataToDelete(idsToDelete);
          setOpenModal(true);
          setSelectedRows([]);
        }}
      >
        <DeleteIcon />
      </Button>
    ),
  };

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

  const columns = [
    {
      name: "Category",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
                fontSize: "0.8rem",
                // backgroundColor: getStatusColor(tableData[dataIndex][0]),
                // color: "white",
                width: "8em",
              },
            }}
            id="category"
            name="category"
            value={tableData[dataIndex][0]}
            onChange={(e) => {
              const row = projectData[dataIndex];
              row.category = e.target.value;

              setRowToUpdate(row);
              handleCellEdit(e, rowIndex, 0);
            }}
          >
            {categories.map((data) => {
              return (
                <MenuItem
                  value={data.categ}
                  // sx={{
                  //   "&.MuiButtonBase-root": {
                  //     backgroundColor: getStatusColor(data.categTxt),
                  //     color: "white",
                  //   },
                  // }}
                >
                  {" "}
                  {data.categTxt}
                </MenuItem>
              );
            })}
          </Select>,
        ],
      },
    },
    {
      name: "Ticket Description",
      options: {
        customBodyRender: (value, tableMeta) => (
          <input
            type="text"
            value={value}
            onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 1)}
          />
        ),
      },
    },
    {
      name: "Status",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
                backgroundColor: getStatusColor(tableData[dataIndex][2]),
                color: "white",
                width: "8em",
                fontSize: "0.7rem",
              },
            }}
            id="status"
            name="status"
            value={tableData[dataIndex][2]}
            onChange={(e) => {
              const row = projectData[dataIndex];
              row.status = e.target.value;

              setRowToUpdate(row);
              handleCellEdit(e, rowIndex, 2);
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
                      fontSize: "0.7rem",
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
      name: "Priority",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "6.5px 14px 5px 14px",
                font: "-webkit-control",
                color: "white",
                backgroundColor: getPriorityColor(tableData[dataIndex][3]),
                fontSize: "0.7rem",
                width: "6em",
              },
            }}
            id="priority"
            name="priority"
            value={tableData[dataIndex][3]}
            onChange={(e) => {
              const row = projectData[dataIndex];
              row.priority = e.target.value;

              setRowToUpdate(row);
              handleCellEdit(e, rowIndex, 3);
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
      name: "Assigned To",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
                fontSize: "0.7rem",
                // backgroundColor: getStatusColor(tableData[dataIndex][4]),
                // color: "white",
                width: "8em",
              },
            }}
            id="assigned"
            name="assigned"
            value={tableData[dataIndex][4]}
            onChange={(e) => {
              const row = projectData[dataIndex];
              row.assigned = e.target.value;

              setRowToUpdate(row);
              handleCellEdit(e, rowIndex, 4);
            }}
          >
            {users.map((data) => {
              return (
                <MenuItem
                  value={data.bname}
                  sx={{
                    fontSize: "0.7rem",
                  }}
                >
                  {" "}
                  {data.name}
                </MenuItem>
              );
            })}
          </Select>,
        ],
      },
    },
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
              tableData[dataIndex][5] === "0000-00-00"
                ? ""
                : dayjs(tableData[dataIndex][5])
            }
            onChange={(date) => {
              const row = projectData[dataIndex];
              row.fsavd = dayjs(date).format("YYYYMMDD");

              setRowToUpdate(row);
              handleDateChange(date, rowIndex, 5);
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
              tableData[dataIndex][6] === "0000-00-00"
                ? ""
                : dayjs(tableData[dataIndex][6])
            }
            onChange={(date) => {
              const row = projectData[dataIndex];
              row.fsedd = dayjs(date).format("YYYYMMDD");

              setRowToUpdate(row);
              handleDateChange(date, rowIndex, 6);
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
              tableData[dataIndex][8] === "0000-00-00"
                ? ""
                : dayjs(tableData[dataIndex][8])
            }
            onChange={(date) => {
              const row = projectData[dataIndex];
              row.startDt = dayjs(date).format("YYYYMMDD");

              setRowToUpdate(row);
              handleDateChange(date, rowIndex, 8);
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
              tableData[dataIndex][9] === "0000-00-00"
                ? ""
                : dayjs(tableData[dataIndex][9])
            }
            onChange={(date) => {
              const row = projectData[dataIndex];
              row.endDt = dayjs(date).format("YYYYMMDD");
              setRowToUpdate(row);
              handleDateChange(date, rowIndex, 9);
            }}
          />
        ),
      },
    },
    { name: "Actual Days" },
    { name: "Remark" },
    { name: "Files" },
  ];

  const updateTicket = (updatedData) => {
    const entryData = {
      PROJECT: [],
      TASK: [],
      TICKET: [updatedData],
    };

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(entryData));

    if (Object.keys(updatedData).length > 0) {
      // process.env.REACT_APP_SERVER_URL
      fetch(process.env.REACT_APP_SERVER_URL + `/api/activity/createProject`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            snackbar.showSuccess("Ticket updated successfully!");
            setRowToUpdate("");
            getTableData();
          }
        })
        .catch((error) => {
          if (error) {
            snackbar.showError(
              "Error while updating ticket. Please try again!"
            );
          }
        });
    } else {
      snackbar.showError("Something went wrong!");
    }
  };

  useEffect(() => {
    if (Object.keys(rowToUpdate).length > 1) {
      updateTicket(rowToUpdate);
    }
  }, [rowToUpdate]);

  useEffect(() => {
    getTableData();
  }, []);

  const saveUrls = (fileUrls) => {
    const entryData = [];

    var Index = fileIndex;
    // eslint-disable-next-line array-callback-return
    fileUrls?.map((obj) => {
      entryData.push({
        DOKNR: ticketId, //projectId /taskId/Ticketid
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
    // eslint-disable-next-line no-use-before-define

    var data = dataToDelete;

    const entryData = {
      PROJECT: [],
      TASK: [],
      TICKET: data,
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
          snackbar.showSuccess("Ticket deleted successfully!");
          setOpenModal(false);
          getTableData();
        }
      })
      .catch((error) => {
        if (error) {
          snackbar.showError("Error while deleting Ticket. Please try again!");
          setOpenModal(false);
        }
      });
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
            setOpenCreateTicket(true);
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
          New Ticket
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

      {tableData.length > 0 && (
        <Grid sx={{ padding: "0.8em" }}>
          <ThemeProvider theme={() => getMuiTheme()}>
            {/* <div
              style={{
                height: "32rem",
                overflowY: "auto", // Enable vertical scrolling
              }}
            > */}
            <MUIDataTable
              title={"Tickets"}
              data={tableData}
              style={{ width: "100%" }}
              columns={columns}
              options={options}
            />
            {/* </div> */}
          </ThemeProvider>
        </Grid>
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
      <CrmModal
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
          projects={projects}
          users={users}
          ref={ticketRef}
          // statuses={statuses}
          // priorities={priorities}
          categories={categories}
          selectedRows={selectedRows}
          getTableData={getTableData}
          setOpenCreateTicket={setOpenCreateTicket}
        />
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
          setTicketId("");
        }}
        SecondaryBtnText="Close"
        secondarySave={() => {
          setOpenShowFiles(false);
          setFileUrlReqNo("");
          setProjectId("");
          setTicketId("");
        }}
      >
        <FileDetails fileUrlReqNo={fileUrlReqNo} taskNo={ticketId} />
      </CrmModal>
    </>
  );
};

export default Tickets;
