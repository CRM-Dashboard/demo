/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
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

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTableHeadCell: {
          styleOverrides: {
            root: {
              backgroundColor: "#3366CC",
              color: "white",
            },
          },
        },
        MUIDataTableSelectCell: {
          styleOverrides: {
            headerCell: {
              backgroundColor: "#3366CC",
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

  const modifyResponse = (data) => {
    const DataForTable = data?.map((item) => {
      return [
        item.ticketDesc,
        item.startDt,
        item.assignedTo,
        item.priority,
        item.remark,
        item.status,
        // <Battery percentage={item.percentage} />,
        // <Typography
        //   onClick={() => {
        //     setShouldShowDateRange(true);
        //   }}
        // >
        //   {dateRange ? dateRange : "Add Issue"}
        // </Typography>,
        <IconButton
          style={{ color: "blue" }}
          onClick={() => {
            console.log("############item", item);
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
          //   setModules(data[0].module);
          //   setChangeType(data[0].changeTyp);
          setProjects(data[0].project);
          //   setStages(data[0].projectStage);
          setStatuses(data[0].projectStatus);
          setProjectData(data[0].tree);
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
          console.log("##############data.data.length", data.data.length, data);
          const maxLoIndex = data?.data?.reduce((max, current) => {
            return current.loIndex > max ? current.loIndex : max;
          }, -Infinity);
          setFileIndex(maxLoIndex);
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
    setTicketId(tableData?.[rowMeta?.rowIndex]?.[8]);
    setProjectId(tableData?.[rowMeta?.rowIndex]?.[7]);

    const Id = tableData[rowMeta?.rowIndex]?.[6];

    const selectedTicket = response?.tree?.filter((data) => {
      if (data.projectId === projectId) {
        return data;
      }
    });
    console.log("#########selected Tasks", selectedTicket, response?.tree, Id);
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
          console.log(
            "############current ticket id",
            ticketId,
            ticketId,
            response
          );

          const idsToDelete = response.ticket.filter((row) => {
            if (row.ticketId === ticketId) {
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

  const handleCellEdit = (e, rowIndex, colIndex) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = e.target.value; // Update the Name field value
    setTableData(newData);
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
      name: "Ticket Description",
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
    { name: "Start Date" },
    { name: "Assigned To" },
    { name: "Priority" },
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
                backgroundColor: getStatusColor(tableData[dataIndex][5]),
                color: "white",
                width: "8em",
              },
            }}
            id="status"
            name="status"
            value={tableData[dataIndex][5]}
            onChange={(e) => {
              console.log("%%%%%%%%%tableData[dataIndex]", response[dataIndex]);
              const row = projectData[dataIndex];
              console.log("%%%%%%%row", row);
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

  const updateTicket = (updatedData) => {
    console.log("updatedData!!!!!!!!!!!", updatedData);
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
          console.log("########error", error);
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

  const handleDelete = () => {
    // eslint-disable-next-line no-use-before-define

    var data = dataToDelete;
    console.log("&&&&&&&&&&&data", data);

    const entryData = {
      PROJECT: [],
      TASK: [],
      TICKET: data,
    };

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

      {tableData.length > 0 && (
        <Grid sx={{ padding: "0.8em" }}>
          <ThemeProvider theme={() => getMuiTheme()}>
            <MUIDataTable
              data={tableData}
              style={{ width: "100%" }}
              columns={columns}
              options={options}
            />
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
          statuses={statuses}
          priorities={priorities}
          selectedRows={selectedRows}
          getTableData={getTableData}
          setOpenCreateTicket={setOpenCreateTicket}
        />
      </CrmModal>
    </>
  );
};

export default Tickets;
