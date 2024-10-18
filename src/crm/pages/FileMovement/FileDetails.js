/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./Style.css";
import Table from "mui-datatables";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Box, Typography, Button } from "@mui/material";
import CrmModal from "../../components/crmModal/CrmModal";
import GlobalFunctions from "./../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";
import CircularScreenLoader from "../../components/circularScreenLoader/CircularScreenLoader";
import axios from "axios";

const FileDetails = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [fileObjectToDelete, setFileObjectToDelete] = useState({});
  const [files, setFiles] = useState([]); // To store the files array

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  // const orderId = reducerData?.searchBar?.orderId;
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
              fontSize: "small",
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
            stackedCommon: {
              fontSize: "13px",
            },
            root: {
              fontSize: "small",
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
              src={require("./../../../assets/pdfIcon.png")}
              style={{ height: "1.5em", width: "1.5em", margin: "0.1em" }}
              onClick={() => {
                window.open(tableData[dataIndex][1], "_blank");
              }}
            />
          </IconButton>,
        ],
      },
    },
    props.activeStep == 0 && {
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
    responsive: "standard",
    // tableBodyHeight: "250px", // Set the height of the table body
    // tableBodyMaxHeight: "", // Optionally, set a max height
    fixedHeader: true, // Make the header sticky
    fixedSelectColumn: true,
  };

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
    formData.append("process", "FILE_MOVEMENT");
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

  useImperativeHandle(ref, () => ({
    getData,
  }));

  const getData = () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("reqNo", props.fileUrlReqNo);
    formData.append("orderId", props.fileUrlReqNo);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("process", "FILE_MOVEMENT");
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
          const modifiedResponse = data?.data?.map((item) => {
            return [
              item.filename,
              item.url,
              props.activeStep == 0 && (
                <IconButton>
                  <DeleteIcon
                    sx={{ height: "1em", width: "1em" }}
                    onClick={() => {
                      setOpenDeleteModal(true);
                      setFileObjectToDelete(item);
                    }}
                  />
                </IconButton>
              ),
            ];
          });
          setTableData(modifiedResponse);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    getData();
  }, [props.fileUrlReqNo, props.activeStep]);

  const uploadFilesToBackend = async (fileList, folderName) => {
    const formData = new FormData();

    fileList.forEach((file) => {
      formData.append('files', file.fileBlob, file.name);
    });

    formData.append('folderName', folderName);

    const url = process.env.REACT_APP_SERVER_URL + `/api/exotel/upload-to-s3/file-movement`

    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Files uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };


  const getFilesFromBackend = async () => {
    try {
      const url = `${process.env.REACT_APP_SERVER_URL + "/api/fileMovement/getDmsFile"}`;
      const formData = new FormData();
      formData.append("doknr", "WORLD_612A_2100002355");
      formData.append("dokar", "FLE");
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      // Fetching the data as an ArrayBuffer
      const response = await axios.post(url, formData, {
        responseType: 'arraybuffer', // Get binary data
      });
      console.log("response", response)

      // Convert ArrayBuffer to a string
      const decoder = new TextDecoder('utf-8');
      const responseText = decoder.decode(response.data); // Decoding arraybuffer to string

      console.log("responseText", responseText)

      // Try parsing the string as JSON (if the server responds with JSON)
      const jsonResponse = JSON.parse(responseText);
      console.log("jsonResponse", jsonResponse)

      // Assuming the parsed JSON contains DMS_S3 files
      const fileList = jsonResponse?.DMS_S3?.map((file) => {
        const blob = new Blob([file.file], { type: file.type }); // Create Blob from binary data

        return {
          name: file.name,
          type: file.type,
          s3Bucket: file.s3Bucket,
          fileBlob: blob, // Blob object for each file
        };
      });

      await uploadFilesToBackend(fileList, "fileMovement")

      console.log('Converted fileList:', fileList);

      setFiles(fileList); // Store the file list
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };



  useEffect(() => {
    console.log("hhhdfdfd", files)
  }, [files])

  const handleViewFileFromSap = async () => {

    const url = `${process.env.REACT_APP_SERVER_URL + "/api/fileMovement/getDmsFile"}`

    const formData = new FormData();
    formData.append("doknr", "WORLD_612A_2100002355")
    formData.append("dokar", "FLE")
    formData.append("userName", userName);
    formData.append("passWord", passWord);

    try {
      // const res = (await axios.post(url, formData)).data;
      const res = await getFilesFromBackend();
      console.log("***res***", files)
    } catch (error) {
      console.log(error)
    }

  }

  // Fetch multiple files from your backend


  return (
    <div
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-end",
        flexDirection: "row-reverse",

      }}
    >
      {!loading ? (
        <ThemeProvider theme={() => getMuiTheme()}>
          {props.isConfirmedClicked && <Button variant="contained" onClick={handleViewFileFromSap}>View file from SAP</Button>}
          <Table data={tableData} columns={columns} options={options}></Table>
        </ThemeProvider>
      ) : (
        <CircularScreenLoader />
      )}

      <CrmModal
        maxWidth="sm"
        show={openDeleteModal}
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
