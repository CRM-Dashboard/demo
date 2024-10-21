/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import TicketTable from "./TicketTable";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button } from "@mui/material";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";
import { Grid } from "@mui/material";
import "./Style.css";

const TaskTable = ({
  data,
  secondIteration,
  statuses,
  getTableData,
  setSelectedRows,
  setProjectNo,
  setTaskNo,
  selectedRows,
}) => {
  const [tableData, setTableData] = useState([]);
  const [rowToUpdate, setRowToUpdate] = useState([]);
  const [dataToDelete, setDataToDelete] = useState("");

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const renderExpandableRow = (rowData, rowMeta) => {
    const item = data[rowMeta.dataIndex];

    if (item.tickets && item.tickets.length > 0) {
      return (
        <tr key={`expandable-row-${item.ID}`}>
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
      );
    }
  };

  const getRowStyle = (rowData, rowMeta) => {
    const selected = selectedRows.includes(rowMeta.dataIndex);

    return {
      backgroundColor: selected ? "#b0e0e6" : "inherit", // You can change the color as per your preference
    };
  };

  const options = {
    expandableRows: true,
    pagination: false,
    print: false,
    download: false,
    search: false,
    filter: false,
    viewColumns: false,
    selectableRows: "none",
    renderExpandableRow,
    hideToolbar: true,
    columnOptions: {
      display: "false",
    },
    rowStyle: getRowStyle,
    selection: true,
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <Button
        color="secondary"
        onClick={() => {
          const idsToDelete = selectedRows.data.map(
            (row) => displayData[row.index].dataIndex
          );
          setDataToDelete(data[idsToDelete]);
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
    },
    {
      name: "Type",
    },
    {
      name: "Planned End Date",
    },
    {
      name: "Assigned To",
    },
    { name: "Remarks" },
  ];

  const updateTask = (updatedData) => {
    const entryData = {
      PROJECT: [],
      TASK: [updatedData],
      TICKET: [],
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
            snackbar.showSuccess("Task updated successfully!");
            setSelectedRows([]);
            setRowToUpdate("");
            getTableData();
          }
        })
        .catch((error) => {
          if (error) {
            snackbar.showError("Error while updating task. Please try again!");
          }
        });
    } else {
      snackbar.showError("Something went wrong!");
    }
  };

  useEffect(() => {
    if (Object.keys(rowToUpdate).length > 1) {
      updateTask(rowToUpdate);
    }
  }, [rowToUpdate]);

  useEffect(() => {
    const DataForTable = data?.map((item) => {
      return [
        item.taskDesc,
        item.typeTxt,
        item.fsedd,
        item.assigned,
        item.remark,
      ];
    });
    setTableData(DataForTable);

    // getTableData();
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
      TASK: [data],
      TICKET: [data?.tickets],
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
          snackbar.showSuccess("Task deleted successfully!");
          getTableData();
        }
      })
      .catch((error) => {
        if (error) {
          snackbar.showError("Error while deleting Task. Please try again!");
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
              backgroundColor: "#00CCCC",
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
              backgroundColor: "#00CCCC",
              color: "white",
            },
          },
        },
        MUIDataTableBodyRow: {
          styleOverrides: {
            root: {
              height: "4em",
            },
          },
        },
      },
    });

  return (
    <Grid>
      {tableData.length > 0 && (
        <Grid sx={{ padding: "0.8em" }}>
          <ThemeProvider theme={() => getMuiTheme()}>
            <MUIDataTable
              data={tableData}
              style={{ width: "100%" }}
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
        </Grid>
      )}
    </Grid>
  );
};

export default TaskTable;
