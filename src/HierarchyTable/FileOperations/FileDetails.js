/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, forwardRef } from "react";
import Table from "mui-datatables";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Box, Typography } from "@mui/material";
import CrmModal from "../../crm/components/crmModal/CrmModal";
import GlobalFunctions from "../../crm/utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";
import CircularScreenLoader from "../../crm/components/circularScreenLoader/CircularScreenLoader";
const FileDetails = forwardRef((props, ref) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [fileObjectToDelete, setFileObjectToDelete] = useState({});

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

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

  const columns = [
    {
      name: "Document",
      label: "Document",
    },
    {
      name: "View / Download ",
      label: "View / Download",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <IconButton color="primary" size="small">
            <img
              alt="pdf"
              className="logo"
              src={require("../../assets/pdfIcon.png")}
              style={{ height: "2em", width: "2em", margin: "0.2em" }}
              onClick={() => {
                console.log(
                  "##########[dataIndex][1]",
                  tableData[dataIndex][1]
                );
                setPdfUrl(tableData[dataIndex][1]);
                setOpenModal(true);
              }}
            />
          </IconButton>,
        ],
      },
    },
    {
      name: "Action",
      label: "Action",
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    print: false,
    download: false,
    search: false,
    viewColumns: false,
    filter: false,
    footer: false,
    pagination: false,
  };

  //   const saveLog = async () => {
  //     const now = new Date();
  //     const entryData = {
  //       OBJECTID: orderId,
  //       USERNAME: userName.toUpperCase(),
  //       UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
  //       UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
  //       OBJECT: " Uploaded files of Unit customisation from AWS S3 Bucket.",
  //       CHANGEIND: "",
  //       VALUE_OLD: {},
  //       VALUE_NEW: {},
  //     };

  //     await GlobalFunctions.saveLog(userName, passWord, entryData);
  //   };

  const removePrefix = (url) => {
    const prefix = "https://gera-crm.s3.amazonaws.com/";

    var URL = url.startsWith(prefix) ? url.slice(prefix.length) : url;

    const finalURL = URL.split("/")
      .map((segment) => decodeURIComponent(segment))
      .join("/");

    console.log("###########finalURL", finalURL);

    return finalURL;
  };

  const deleteFileFromS3 = () => {
    const URL = removePrefix(fileObjectToDelete.url);
    const formData = new FormData();
    formData.append("bucketName", "gera-crm");
    formData.append("filePath", URL);
    fetch(process.env.REACT_APP_SERVER_URL + "/api/activity/deleteFileFromS3", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setOpenDeleteModal(false);
          // handleDBDataDelete();
          snackbar.showSuccess("File Deleted Successfully from S3");
          console.log("#############data", data);
        }
      });
  };

  const handleDBDataDelete = () => {
    const formData = new FormData();
    formData.append("reqNo", fileObjectToDelete.doknr);
    formData.append("orderId", fileObjectToDelete.reference);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("loIndex", fileObjectToDelete.loIndex);
    formData.append("process", "TRACKER");
    fetch(process.env.REACT_APP_SERVER_URL + "/api/activity/deleteFileUrl", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          snackbar.showSuccess("File Deleted Successfully from Database");
          getData();
          console.log("%%%%%%%%%%%%%deleteddata", data);
        }
      });
  };

  const getData = () => {
    console.log("&&&&&&&&&&&&props.fileUrlReqNo", props.fileUrlReqNo);
    const formData = new FormData();
    const reqNo = props?.taskNo ? props.taskNo : props.fileUrlReqNo;
    formData.append("reqNo", reqNo);
    formData.append("orderId", props.fileUrlReqNo);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("process", "TRACKER");
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
          console.log("!!!!!!!!!!!!!!!fileurldata", data);
          const modifiedResponse = data?.data?.map((item) => {
            return [
              item.filename,
              item.url,
              <IconButton>
                <DeleteIcon
                  onClick={() => {
                    setOpenDeleteModal(true);
                    setFileObjectToDelete(item);
                  }}
                />
              </IconButton>,
            ];
          });

          setTableData(modifiedResponse);
        }
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-end",
        flexDirection: "row-reverse",
        paddingTop: "2em",
        paddingBottom: "2em",
      }}
    >
      <ThemeProvider theme={() => getMuiTheme()}>
        <Table data={tableData} columns={columns} options={options}></Table>
      </ThemeProvider>

      <CrmModal
        maxWidth="xxl"
        show={openModal}
        handleShow={() => {
          setPdfUrl("");
          setLoading(false);
          setOpenModal(false);
        }}
        SecondaryBtnText="Close"
        secondarySave={() => {
          setPdfUrl("");
          setLoading(false);
          setOpenModal(false);
        }}
      >
        {loading ? (
          <CircularScreenLoader isModal />
        ) : pdfUrl ? (
          <iframe title="PDF Viewer" src={pdfUrl} width="100%" height="700px" />
        ) : (
          ""
        )}
      </CrmModal>
      <CrmModal
        maxWidth="sm"
        show={openDeleteModal}
        handleShow={() => {
          setOpenDeleteModal(false);
        }}
        primaryBtnText="Yes"
        SecondaryBtnText="No"
        primarySave={() => {
          deleteFileFromS3();
          handleDBDataDelete();
        }}
        secondarySave={() => {
          setOpenDeleteModal(false);
        }}
      >
        <Box>
          {" "}
          <Typography fontSize={20}>
            {"Are you sure you want to delete this file?"}
          </Typography>
        </Box>
      </CrmModal>
    </div>
  );
});

export default FileDetails;
