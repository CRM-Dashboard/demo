/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import TaskTable from "./TaskTable";
import MUIDataTable from "mui-datatables";
import TicketTable from "./TicketTable";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button } from "@mui/material";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";
import CircularScreenLoader from "../../crm/components/circularScreenLoader/CircularScreenLoader";
import CircularProgressWithLabel from "../../crm/components/CircularProgressWithLabel/circularProgressWithLabel";
import "./Style.css";
import ChangeManagementTable from "./ChangeManagementTable";

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
  const [statuses, setStatuses] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [rowToUpdate, setRowToUpdate] = useState([]);

  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const snackbar = UseCustomSnackbar();

  const renderExpandableRow = (rowData, rowMeta) => {
    const item = projectData[rowMeta.dataIndex];
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
                  setProjectNo={setProjectNo}
                  setTaskNo={setTaskNo}
                  selectedRows={selectedRows}
                />
              </div>
            </td>
          </tr>
        ) : (
          <></>
        )}
        {item.tickets &&
        Array.isArray(item.tickets) &&
        item.tickets.length !== 0 ? (
          <tr key={`expandable-row-${item?.tickets[0]?.ticketId}`}>
            <td colSpan="15" style={{ padding: "0", border: "none" }}>
              <div style={{ paddingLeft: "20px" }}>
                <TicketTable
                  data={item.tickets}
                  secondIteration="true"
                  statuses={statuses}
                  getTableData={getTableData}
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
                  secondIteration="true"
                  getTableData={getTableData}
                  setSelectedRows={setSelectedRows}
                  selectedRows={selectedRows}
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

  const getRowStyle = (rowData, rowMeta) => {
    console.log("selectedRows!!!!!!!!", selectedRows, rowMeta);
    const selected = selectedRows.includes(rowMeta.dataIndex);

    return {
      backgroundColor: selected ? "#b0e0e6" : "inherit", // You can change the color as per your preference
    };
  };

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
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <Button
        color="secondary"
        onClick={() => {
          setSelectedRows([]);
        }}
      >
        <DeleteIcon />
      </Button>
    ),
  };

  const columns = [
    {
      name: "Category",
    },
    {
      name: "Name",
    },
    {
      name: "Priority",
    },
    {
      name: "Stage",
    },
    { name: "Progress" },
    {
      name: "Planned End Date",
    },
    { name: "Remarks" },
  ];

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
        console.log("########error", error);
        if (error) {
          snackbar.showError(
            "Error while updating activity. Please try again!"
          );
        }
      });
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

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item.categTxt,
        item.projectName,
        <input
          value={item.priority}
          style={{
            height: "2em",
            width: "8em",
            borderRadius: "0.3em",
            fontSize: "0.7rem",
            textAlign: "center",
            backgroundColor: getPriorityColor(item.priority),
            color: "white",
          }}
        />,
        <input
          value={item.stageTxt}
          style={{
            height: "2em",
            width: "20em",
            borderRadius: "0.3em",
            fontSize: "0.7rem",
            textAlign: "center",
            backgroundColor: getStageColor(item.stage),
            color: "white",
          }}
        />,
        <CircularProgressWithLabel value={item?.progress} />,
        item.fsedd,
        item.remark,
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
      // `https://gera-crm-server.azurewebsites.net//api/activity/getProjectTracker`,
      `${process.env.REACT_APP_SERVER_URL}/api/activity/getProjectTracker`,
      { method: "POST", body: formData }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          console.log("#########Hierarchy table data", data);
          setStatuses(data[0].projectStatus);
          setProjectData(data[0].tree);
          setTableData(modifyResponse(data[0].tree));
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
              backgroundColor: "#0033CC",
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
              backgroundColor: "#0033CC",
              color: "white",
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
            title={"Overview"}
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
    </>
  );
};

export default TreeTable;
