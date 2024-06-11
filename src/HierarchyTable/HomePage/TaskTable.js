/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import MUIDataTable from "mui-datatables";
import TicketTable from "./TicketTable";
import DeleteIcon from "@mui/icons-material/Delete";
import CrmModal from "./../../crm/components/crmModal/CrmModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Select, MenuItem, Button, Typography, Box } from "@mui/material";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";

const TaskTable = ({
  data,
  secondIteration,
  statuses,
  getTableData,
  setSelectedRows,
}) => {
  const [rowToUpdate, setRowToUpdate] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
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
                secondIteration={"true"}
                statuses={statuses}
                getTableData={getTableData}
              />
            </div>
          </td>
        </tr>
      );
    }
  };

  const handleRowClick = (rowData, rowMeta) => {
    // rowData contains the data of the clicked row
    console.log(
      "Clicked row data########:",
      rowData,
      rowMeta.rowIndex,
      data[rowMeta.rowIndex]
    );
    setSelectedRows(data[rowMeta.rowIndex]);
    // You can perform any action with the row data here
  };

  const options = {
    expandableRows: true,
    print: false,
    download: false,
    search: false,
    filter: false,
    viewColumns: false,
    selectableRows: "single",
    renderExpandableRow,
    hideToolbar: true,
    columnOptions: {
      display: "false",
    },
    onRowClick: handleRowClick,
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <Button
        color="secondary"
        onClick={() => {
          const idsToDelete = selectedRows.data.map(
            (row) => displayData[row.index].dataIndex
          );
          console.log("Ids to delete***********:", idsToDelete);
          console.log("data to delete***********:", data[idsToDelete], data);
          setDataToDelete(data[idsToDelete]);
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
            onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 0)}
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
              const row = data[dataIndex];
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

    if (Object.keys(updatedData).length > 0) {
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
    if (Object.keys(rowToUpdate).length > 1) {
      updateTask(rowToUpdate);
    }
  }, [rowToUpdate]);

  useEffect(() => {
    const DataForTable = data?.map((item) => {
      return [
        item.taskDesc,
        item.startDate,
        item.assignedTo,
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

  return (
    <>
      {tableData.length > 0 && (
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
    </>
  );
};

export default TaskTable;
