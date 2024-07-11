/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import Table from "mui-datatables";
import { Button } from "@mui/material";
import CreateInterestWaveOff from "./CreateInterestWaveOff";
import CrmModal from "../../../components/crmModal/CrmModal";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { TableRow, TableCell, TableFooter } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function InterestWaveOff() {
  const [page, setPage] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreateForm, setopenCreateForm] = useState(false);

  const ref = useRef(null);
  const reducerData = useSelector((state) => state);
  const OrderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const txtColour = GlobalFunctions.getThemeBasedDatailsColour(
    reducerData.ThemeReducer.mode
  );

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiIconButton: {
          styleOverrides: {
            root: {
              variant: "contained",
            },
          },
        },
        MuiSvgIcon: {
          styleOverrides: {
            root: {
              color: "Blue",
            },
          },
        },
        MUIDataTableToolbar: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiTablePagination: {
          styleOverrides: {
            selectLabel: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
            selectIcon: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
            displayedRows: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
            select: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            footer: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MUIDataTableHeadRow: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MUIDataTableHeadCell: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MUIDataTableBodyCell: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              paddingTop: 0,
              paddingBottom: 0,
              lineHeight: "2.2em",
            },
          },
        },
        MuiCheckbox: {
          styleOverrides: {
            root: {
              padding: 0,
            },
          },
        },
      },
    });

  const options = {
    selectableRows: "none",
    elevation: 0,
    print: true,
    download: true,
    search: true,
    viewColumns: true,
    filter: true,
    customToolbar: () => [
      <Button
        variant="contained"
        disableElevation
        disableFocusRipple
        size="small"
        onClick={() => {
          setopenCreateForm(true);
        }}
      >
        Create
      </Button>,
    ],
    rowsPerPageOptions: [5, 10, 25, 50],
    onChangeRowsPerPage(numberOfRows) {
      setRowsPerPage(numberOfRows);
    },
    onChangePage(page) {
      setPage(page);
    },
    customTableBodyFooterRender: (opts) => {
      const startIndex = page * rowsPerPage;
      const endIndex = (page + 3) * rowsPerPage;

      let sumAmount = opts.data
        .slice(startIndex, endIndex)
        .reduce((accu, item) => {
          return accu + item.data[3];
        }, 0);

      return (
        <>
          {tableData.length > 0 && (
            <TableFooter>
              <TableRow>
                {opts.columns.map((col, index) => {
                  if (col.display === "true") {
                    if (col.name === "Request Number") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          Total
                        </TableCell>
                      );
                    } else if (col.name === "Created On") {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "Created By") {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "Amount") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {sumAmount}
                        </TableCell>
                      );
                    }
                  }
                })}
              </TableRow>
            </TableFooter>
          )}
        </>
      );
    },
  };

  const columns = [
    {
      name: "Request Number",
      label: "Request Number",
    },
    {
      name: "Created On",
      label: "Created On",
    },
    {
      name: "Created By",
      label: "Created By",
    },
    {
      name: "Amount",
      label: "Amount",
    },
    {
      name: "Reason",
      label: "Reason",
    },
  ];

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.vbeln,
        item?.erdat,
        item?.ernam,
        item?.amount,
        item?.reason,
      ];
    });
    return modifiedResponse;
  };

  const getTableData = () => {
    const formData = new FormData();
    formData.append("orderId", OrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);

    fetch(
      process.env.REACT_APP_SERVER_URL +
        "/api/dashboard/interestWaiveOff/waiveint",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log("#data", data);
          setTableData(modifyResponse(data[0].waivedoff));
        }
      });
  };

  useEffect(() => {
    getTableData();
  }, [OrderId]);

  const saveReceiptDetails = () => {
    if (ref.current) {
      ref.current.saveReceipt();
    }
  };

  return (
    <div style={{ marginTop: "1em" }}>
      <ThemeProvider theme={() => getMuiTheme()}>
        <Table data={tableData} columns={columns} options={options}></Table>
      </ThemeProvider>
      <CrmModal
        maxWidth="sm"
        show={openCreateForm}
        handleShow={() => {
          setopenCreateForm(false);
        }}
        primaryBtnText="Create"
        SecondaryBtnText="Close"
        secondarySave={() => {
          setopenCreateForm(false);
        }}
        primarySave={() => {
          saveReceiptDetails();
        }}
        title="Create Interest Waveoff Request"
      >
        <CreateInterestWaveOff
          ref={ref}
          getTableData={getTableData}
          setopenCreateForm={setopenCreateForm}
        />
      </CrmModal>
    </div>
  );
}
