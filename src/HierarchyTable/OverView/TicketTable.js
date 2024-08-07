/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import DeleteIcon from "@mui/icons-material/Delete";
// import CrmModal from "../../crm/components/crmModal/CrmModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Grid } from "@mui/material";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";

const TicketTable = ({ data, secondIteration, statuses, getTableData }) => {
  const [tableData, setTableData] = useState([]);
  const [rowToUpdate, setRowToUpdate] = useState([]);
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
      // options: {
      //   customBodyRender: (value, tableMeta) => (
      //     <input
      //       type="text"
      //       value={value}
      //       onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 0)}
      //     />
      //   ),
      // },
    },
    { name: "Start Date" },
    { name: "Assigned To" },
    { name: "Priority" },
    { name: "Remark" },
    {
      name: "Status",
      // options: {
      //   customBodyRenderLite: (dataIndex, rowIndex) => [
      //     <Select
      //       sx={{
      //         "& .MuiOutlinedInput-input": {
      //           padding: "4.5px 14px",
      //           font: "-webkit-control",
      //           backgroundColor: getStatusColor(tableData[dataIndex][5]),
      //           color: "white",
      //           width: "8em",
      //         },
      //       }}
      //       id="status"
      //       name="status"
      //       value={tableData[dataIndex][5]}
      //       onChange={(e) => {
      //         console.log(
      //           "%%%%%%%%%tableData[dataIndex]",
      //           tableData[dataIndex]
      //         );
      //         const row = data[dataIndex];
      //         row.status = e.target.value;
      //         delete row.tickets;
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
    </>
  );
};

export default TicketTable;
