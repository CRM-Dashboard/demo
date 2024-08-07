import React, { useState, useRef } from "react";
import TreeTable from "./TreeTable";
// import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
// import FileUploader from "../FileOperations/FileUploader";
// import CrmModal from "../../crm/components/crmModal/CrmModal";
// import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";

//TO-DO: CUSTOMISATION->IT_TRACKER

export default function HomePage() {
  // const [data, setTableData] = useState("");
  // const [taskNo, setTaskNo] = useState();
  // const [changeNo, setChangeNo] = useState();
  // const [projectNo, setProjectNo] = useState();
  // const [fileIndex, setFileIndex] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  // const [openFileUpload, setOpenFileUpload] = useState(false);
  // const [openCreateForm, setOpenCreateForm] = useState(false);
  // const [openCreateTask, setOpenCreateTask] = useState(false);
  // const [openCreateTicket, setOpenCreateTicket] = useState(false);
  // const [openCreateChange, setOpenCreateChange] = useState(false);

  // const snackbar = UseCustomSnackbar();
  // const reducerData = useSelector((state) => state);
  // const passWord = reducerData.LoginReducer.passWord;
  // const userName = reducerData.LoginReducer.userName;
  // const loggedInUser = reducerData.LoginReducer.loggedInUser;

  const ref = useRef(null);

  // const saveUrls = (fileUrls) => {
  //   const entryData = [];
  //   var Index = fileIndex;
  //   // eslint-disable-next-line array-callback-return
  //   fileUrls?.map((obj) => {
  //     entryData.push({
  //       DOKNR: projectNo, //projectId /taskId/Ticketid
  //       REFERENCE: projectNo, //projectId
  //       LO_INDEX: Index + 1,
  //       PROCESS: "CUSTOMISATION",
  //       FILENAME: obj?.key?.split("/")?.pop(),
  //       URL: obj.url,
  //       AEDAT: new Date()?.toISOString()?.split("T")[0],
  //       AENAM: loggedInUser.name,
  //       AEZET: new Date()?.toLocaleTimeString("en-GB", { hour12: false }),
  //     });
  //     Index = Index + 1;
  //   });

  //   const formData = new FormData();
  //   formData.append("entryData", JSON.stringify(entryData));
  //   formData.append("userName", userName);
  //   formData.append("passWord", passWord);
  //   fetch(
  //     process.env.REACT_APP_SERVER_URL + "/api/activity/saveUploadedFiles",
  //     {
  //       method: "POST",
  //       body: formData,
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data) {
  //         snackbar.showSuccess("File URLs data saved successfully");
  //         setProjectNo("");
  //       }
  //     });

  //   console.log("data*************", entryData);
  // };

  // const getFilesCount = () => {
  //   const formData = new FormData();
  //   // formData.append("reqNo", requestNo);
  //   // formData.append("orderId", orderId);
  //   formData.append("userName", userName);
  //   formData.append("passWord", passWord);
  //   formData.append("process", "CUSTOMISATION");
  //   fetch(
  //     process.env.REACT_APP_SERVER_URL + "/api/activity/getFileUrlsByReqNo",
  //     {
  //       method: "POST",
  //       body: formData,
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data) {
  //         setFileIndex(data.data.length);
  //       }
  //     });
  // };

  return (
    <Grid sx={{ marginTop: "1.5em", position: "relative", padding: "1em" }}>
      {/* Fixed button div */}
      {/* <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "#fff",
          padding: "0.5em 0",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            disableElevation
            disableFocusRipple
            size="sm"
            onClick={() => {
              setOpenCreateForm(true);
            }}
            sx={{
              margin: "0.2em",
              "&.MuiButton-root": {
                textTransform: "none",
                backgroundColor: "#228B22",
              },
            }}
          >
            New Project
          </Button>
          <Button
            variant="contained"
            disableElevation
            disableFocusRipple
            size="sm"
            onClick={() => {
              setOpenCreateTask(true);
            }}
            sx={{
              margin: "0.2em",
              "&.MuiButton-root": {
                textTransform: "none",
                backgroundColor: "#228B22",
              },
            }}
            disabled={!selectedRows?.projectId || selectedRows?.taskId}
          >
            New Task
          </Button>
          <Button
            variant="contained"
            disableElevation
            disableFocusRipple
            size="sm"
            onClick={() => {
              setOpenCreateTicket(true);
            }}
            sx={{
              margin: "0.2em",
              "&.MuiButton-root": {
                textTransform: "none",
                backgroundColor: "#228B22",
              },
            }}
            disabled={!selectedRows?.taskId}
          >
            New Issue
          </Button>
          <Button
            variant="contained"
            disableElevation
            disableFocusRipple
            size="sm"
            onClick={() => {
              setOpenCreateChange(true);
            }}
            sx={{
              margin: "0.2em",
              "&.MuiButton-root": {
                textTransform: "none",
                backgroundColor: "#228B22",
              },
            }}
            disabled={!selectedRows?.projectId}
          >
            New Change
          </Button>
          <Button
            variant="contained"
            disableElevation
            disableFocusRipple
            size="small"
            sx={{
              margin: "0.2em",
              "&.MuiButton-root": {
                textTransform: "none",
                backgroundColor: "#228B22",
              },
            }}
            disabled={!projectNo}
            onClick={() => {
              setOpenFileUpload(true);
              getFilesCount();
            }}
          >
            Choose Files to Upload
          </Button>
        </div>
      </div> */}

      <div>
        <TreeTable
          ref={ref}
          secondIteration="false"
          // openCreateForm={openCreateForm}
          // setOpenCreateForm={setOpenCreateForm}
          // openCreateTask={openCreateTask}
          // setOpenCreateTask={setOpenCreateTask}
          // openCreateTicket={openCreateTicket}
          // setOpenCreateTicket={setOpenCreateTicket}
          // openCreateChange={openCreateChange}
          // setOpenCreateChange={setOpenCreateChange}
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
          // taskNo={taskNo}
          // setTaskNo={setTaskNo}
          // projectNo={projectNo}
          // setProjectNo={setProjectNo}
          // changeNo={changeNo}
          // setChangeNo={setChangeNo}
        />
      </div>

      {/* <CrmModal
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
          requestNo={projectNo}
          setOpenFileUpload={setOpenFileUpload}
          callBack={saveUrls}
        />
      </CrmModal> */}
    </Grid>
  );
}
