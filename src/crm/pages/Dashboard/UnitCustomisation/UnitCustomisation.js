/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-sparse-arrays */
import React, { useState, useEffect } from "react";
import FileDetails from "./FileDetails";
import MUIDataTable from "mui-datatables";
import UnitItemData from "./UnitItemData";
import { Button, IconButton } from "@mui/material";
import CreateUnitCustomReq from "./CreateUnitCustomReq";
import CrmModal from "../../../components/crmModal/CrmModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import FileUploader from "../../Activity/FileUploader/FileUploader";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";
import LabelWithCheckbox from "../../../components/labelWithCheckBox/LabelWithCheckBox";

const UnitCustomisation = () => {
  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const loggedInUser = reducerData.LoginReducer.loggedInUser;

  const snackbar = UseCustomSnackbar();

  const [data, setData] = useState([]);
  const [response, setResponse] = useState([]);
  const [requestNo, setRequestNo] = useState();
  const [fileUrlReqNo, setFileUrlReqNo] = useState("");
  const [canCreateReq, setCanCreateReq] = useState(false);
  const [openShowFiles, setOpenShowFiles] = useState(false);
  const [fileIndex, setFileIndex] = useState(0);
  const [openFileUpload, setOpenFileUpload] = useState(false);
  const [uniqueIdOfItemData, setUniqueIdOfItemData] = useState("");

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        "",
        item.reqNo,
        item?.project,
        item?.unit,
        item.customer,
        item.kunnr,
        item.rejRsn,
        <IconButton
          style={{ color: "blue" }}
          onClick={() => {
            setOpenShowFiles(true);
            setFileUrlReqNo(item.reqNo);
          }}
        >
          <InsertDriveFileIcon />
        </IconButton>,
      ];
    });
    return modifiedResponse;
  };

  const getTableData = () => {
    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(
      process.env.REACT_APP_SERVER_URL + "/api/dashboard/unitCustomDetails",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setResponse(data[0].header);
          setData(modifyResponse(data[0].header));
        }
      });
  };

  const getFilesCount = () => {
    const formData = new FormData();
    formData.append("reqNo", requestNo);
    formData.append("orderId", orderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
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
  }, [orderId]);

  const columns = [
    {
      options: {
        customBodyRenderLite: (rowIndex) =>
          data.length > 0 && [
            <IconButton
              color="primary"
              size="small"
              id={rowIndex[0]}
              onClick={() => {
                setRequestNo(response[rowIndex].reqNo);
              }}
            >
              <LabelWithCheckbox
                value={
                  requestNo ? response[rowIndex].reqNo === requestNo : false
                }
              />
            </IconButton>,
          ],
      },
    },
    {
      name: "Request Number",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => {
                setUniqueIdOfItemData(tableMeta.rowData);
              }}
            >
              {value}
            </span>
          );
        },
      },
    },
    {
      name: "Project",
    },
    {
      name: "Unit",
    },
    {
      name: "Customer",
    },
    {
      name: "kunnr",
    },
    { name: "Rejection Reason" },
    { name: "Files" },
  ];

  const saveUrls = (fileUrls) => {
    const entryData = [];
    var Index = fileIndex;
    // eslint-disable-next-line array-callback-return
    fileUrls?.map((obj) => {
      entryData.push({
        DOKNR: requestNo,
        REFERENCE: orderId,
        LO_INDEX: Index + 1,
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

    console.log("data*************", entryData);
  };

  const options = {
    selectableRows: "none",
    customToolbar: () => [
      <Button
        sx={{ marginRight: "0.5em" }}
        variant="contained"
        disableElevation
        disableFocusRipple
        size="small"
        onClick={() => {
          setCanCreateReq(true);
        }}
      >
        Create New Request
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
  };

  return (
    <>
      <div style={{ marginTop: "1em" }}>
        {canCreateReq ? (
          <>
            <div>
              <Button
                onClick={() => {
                  setCanCreateReq(false);
                }}
              >
                <ArrowBackIosIcon />
                Back
              </Button>
            </div>
            <CreateUnitCustomReq
              setCanCreateReq={setCanCreateReq}
              getTableData={getTableData}
            />
          </>
        ) : !uniqueIdOfItemData ? (
          <MUIDataTable
            title={"Unit Customisation Requests"}
            data={data}
            columns={columns}
            options={options}
          />
        ) : (
          <>
            <div>
              <Button
                onClick={() => {
                  setUniqueIdOfItemData("");
                }}
              >
                <ArrowBackIosIcon />
                Back
              </Button>
            </div>
            <UnitItemData
              uniqueIdOfItemData={uniqueIdOfItemData}
              setUniqueIdOfItemData={setUniqueIdOfItemData}
            />
          </>
        )}
      </div>
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
    </>
  );
};

export default UnitCustomisation;
