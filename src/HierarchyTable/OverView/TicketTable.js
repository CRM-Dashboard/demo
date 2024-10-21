/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Grid } from "@mui/material";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";

const TicketTable = ({ data, secondIteration, statuses, getTableData }) => {
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
              backgroundColor: "#3366CC",
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
              backgroundColor: "#3366CC",
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

  const options = {
    pagination: false,
    expandableRows: true,
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

  const columns = [
    {
      name: "Ticket Description",
    },
    {
      name: "Category",
    },
    {
      name: "Priority",
    },
    {
      name: "Assigned To",
    },
    {
      name: "Planned End Date",
    },
    { name: "Remarks" },
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
    const DataForTable = data?.map((item) => {
      return [
        item.ticketDesc,
        item.categTxt,
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
        item.assigned,
        item.fsedd,
        item.remark,
      ];
    });
    setTableData(DataForTable);

    // getTableData();
  }, []);

  const handleDelete = () => {
    // eslint-disable-next-line no-use-before-define
    var data = dataToDelete;

    const entryData = {
      PROJECT: [],
      TASK: [],
      TICKET: [data],
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

          getTableData();
        }
      })
      .catch((error) => {
        if (error) {
          snackbar.showError("Error while deleting Ticket. Please try again!");
        }
      });
  };

  return (
    <>
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
    </>
  );
};

export default TicketTable;
