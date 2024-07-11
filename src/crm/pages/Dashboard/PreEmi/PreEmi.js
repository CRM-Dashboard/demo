/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import Table from "mui-datatables";
import FileDetails from "./FileDetails";
import { Button, IconButton } from "@mui/material";
import CreatePreEmiReceipt from "./CreatePreEmiReceipt";
import FileUploader from "./FileUploader";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import CrmModal from "./../../../components/crmModal/CrmModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { TableRow, TableCell, TableFooter } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";
import LabelWithCheckbox from "../../../components/labelWithCheckBox/LabelWithCheckBox";

export default function PreEmi() {
  const [tableData, setTableData] = useState([]);

  const [page, setPage] = useState(0);
  const [response, setResponse] = useState([]);
  const [requestNo, setRequestNo] = useState();
  const [fileIndex, setFileIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fileUrlReqNo, setFileUrlReqNo] = useState("");
  const [openFileUpload, setOpenFileUpload] = useState(false);
  const [openShowFiles, setOpenShowFiles] = useState(false);
  const [openCreateForm, setopenCreateForm] = useState(false);

  const ref = useRef(null);
  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const OrderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const loggedInUser = reducerData.LoginReducer.loggedInUser;
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

  const handleCreateBtnClick = () => {
    if (OrderId) {
      const formData = new FormData();
      formData.append("orderId", OrderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/so", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data[0]?.so[0]?.vbeln) {
            if (
              data[0]?.so[0]?.schemeStart === "0000-00-00" ||
              data[0]?.so[0]?.schemeEnd === "0000-00-00" ||
              !data[0]?.so[0]?.schemeEnd ||
              !data[0]?.so[0]?.schemeStart
            ) {
              snackbar.showError(
                "Please set Scheme start and Scheme end date!"
              );
            } else {
              setopenCreateForm(true);
            }
          }
        });
    }
  };

  const options = {
    selectableRows: "none",
    rowsPerPage: 50,
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
        sx={{ marginRight: "0.5em" }}
        onClick={() => {
          handleCreateBtnClick();
        }}
      >
        Create
      </Button>,
      <Button
        variant="contained"
        disableElevation
        disableFocusRipple
        size="small"
        disabled={!requestNo}
        onClick={() => {
          setOpenFileUpload(true);
          getFilesCount();
        }}
      >
        Choose Files to Upload
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
                    if (!col.name) {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "Request Number") {
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
                    } else if (col.name === "Month") {
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
      options: {
        customBodyRenderLite: (rowIndex) =>
          tableData.length > 0 && [
            <IconButton
              color="primary"
              size="small"
              id={rowIndex[0]}
              onClick={() => {
                setRequestNo(response[rowIndex].repayRequestNo);
              }}
            >
              <LabelWithCheckbox
                value={
                  requestNo
                    ? response[rowIndex].repayRequestNo === requestNo
                    : false
                }
              />
            </IconButton>,
          ],
      },
    },
    {
      name: "Request Number",
      label: "Request Number",
    },
    {
      name: "Month",
      label: "Month",
    },
    {
      name: "Amount",
      label: "Amount",
    },
    {
      name: "Remark",
      label: "Remark",
    },
    {
      name: "Status",
      label: "Status",
      //   options: {
      //     customBodyRender: (value) => {
      //       const cellStyle = {
      //         fontWeight: "bold",
      //         color:
      //           value === "Invoiced"
      //             ? "#0E9E07" //green
      //             : value === "Mlstn Not Completed"
      //             ? "#FFD800" //yellow
      //             : "red", //red
      //       };

      //       return <div style={cellStyle}>{value}</div>;
      //     },
      //   },
    },
    {
      name: "Created On",
      label: "Created On",
    },
    {
      name: "Created By",
      label: "Created By",
    },
    { name: "Files", label: "Files" },
  ];

  const saveReceiptDetails = () => {
    if (ref.current) {
      ref.current.saveReceipt();
    }
  };

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        "",
        item?.repayRequestNo,
        item?.monthTxt,
        item?.amount,
        item?.remark,
        item?.status,
        item?.createdOn,
        item?.createdBy,
        <IconButton
          style={{ color: "blue" }}
          onClick={() => {
            setOpenShowFiles(true);
            setFileUrlReqNo(item.repayRequestNo);
          }}
        >
          <InsertDriveFileIcon />
        </IconButton>,
      ];
    });
    return modifiedResponse;
  };

  const getTableData = () => {
    if (OrderId) {
      const formData = new FormData();
      formData.append("orderId", OrderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      fetch(process.env.REACT_APP_SERVER_URL + `/api/dashboard/preEmi/repay`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setResponse(data);
            setTableData(modifyResponse(data));
          }
        });
    }
  };

  const getFilesCount = () => {
    const formData = new FormData();
    formData.append("reqNo", requestNo);
    formData.append("orderId", OrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("process", "REPAYMENT");
    fetch(
      process.env.REACT_APP_SERVER_URL + "/api/activity/getFileUrlsByReqNo",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setFileIndex(data.data.length);
        }
      });
  };

  useEffect(() => {
    getFilesCount();
  }, [requestNo]);

  useEffect(() => {
    getTableData();
    getFilesCount();
  }, []);

  useEffect(() => {
    getTableData();
  }, [OrderId]);

  const saveUrls = (fileUrls) => {
    const entryData = [];
    var Index = fileIndex;
    // eslint-disable-next-line array-callback-return
    fileUrls?.map((obj) => {
      entryData.push({
        DOKNR: requestNo,
        REFERENCE: OrderId,
        LO_INDEX: Index + 1,
        PROCESS: "REPAYMENT",
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
        }
      });
  };

  return (
    <div style={{ marginTop: "1em" }}>
      <ThemeProvider theme={() => getMuiTheme()}>
        <Table data={tableData} columns={columns} options={options}></Table>
      </ThemeProvider>
      <CrmModal
        maxWidth="md"
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
        title="Create Pre Emi / Rental Assurance"
      >
        <CreatePreEmiReceipt
          setopenCreateForm={setopenCreateForm}
          ref={ref}
          getTableData={getTableData}
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
          requestNo={requestNo}
          setOpenFileUpload={setOpenFileUpload}
          callBack={saveUrls}
        />
      </CrmModal>
      <CrmModal
        maxWidth="sm"
        show={openShowFiles}
        handleShow={() => {
          setOpenShowFiles(false);
        }}
        SecondaryBtnText="Close"
        secondarySave={() => {
          setOpenShowFiles(false);
        }}
      >
        <FileDetails fileUrlReqNo={fileUrlReqNo} />
      </CrmModal>
    </div>
  );
}
