/* eslint-disable no-useless-concat */
// import AWS from "aws-sdk";
import { useState } from "react";
import {
  List,
  Grid,
  Paper,
  Button,
  ListItem,
  IconButton,
  ListItemText,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import CloudUploadIcon from "@mui/icons-material/CloudUploadOutlined";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";
import FileUploadAction from "../../crm/pages/Activity/FileUploader/FileReducer/FileUploadAction";

function FileUploader({ requestNo, setOpenFileUpload, callBack }) {
  const dispatch = useDispatch();
  const snackbar = UseCustomSnackbar();

  const [files, setFiles] = useState([]);

  const uploadFile = async () => {
    if (files) {
      const apiUrl =
        process.env.REACT_APP_SERVER_URL + "/api/activity/uploadFileToS3";

      var finalFiles = [];
      files.forEach((file) => {
        if (new Blob([file.buffer])) {
          finalFiles.push({
            originalname: file.originalname,
            buffer: new Blob([file.buffer], { type: file.mimetype }),
            mimetype: file.mimetype,
          });
        }
      });

      const formData = new FormData();
      finalFiles.forEach((file) => {
        const blob = new Blob([file.buffer], { type: file.mimetype });
        formData.append("files", blob, file.originalname);
      });
      const folder = `IT_Tracker/${requestNo}`;
      formData.append("bucketName", "gera-crm");
      formData.append("folderName", folder);

      if (requestNo) {
        fetch(apiUrl, {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            if (data) {
              console.log("file urls############", data.urls);
              // saveUrls(data.urls);
              dispatch(FileUploadAction.setUploadFileUrls(data));
              setOpenFileUpload(false);
              callBack(data.urls);
              snackbar.showSuccess("Files Uploaded Successfully!");
            } else {
              alert("Error");
            }
          });
      }
    }
  };

  const handleFileChange = (e) => {
    console.log("e.target.files########", e.target.files);
    const fileList = [...Array.from(e.target.files)];
    const readFiles = [];

    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        readFiles.push({
          originalname: file.name,
          buffer: event.target.result,
          mimetype: file.type,
          size: file.size,
        });
        if (readFiles.length === fileList.length) {
          setFiles(readFiles);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };
  //   const handleFileChange = (event) => {
  //     const fileList = [...files, ...Array.from(event.target.files)];
  //     const readFiles = [];

  //     fileList.forEach((file) => {
  //       const reader = new FileReader();
  //       reader.onload = (event) => {
  //         readFiles.push({
  //           originalname: file.name,
  //           buffer: event.target.result,
  //           mimetype: file.type,
  //           size: file.size,
  //         });
  //         if (readFiles.length === fileList.length) {
  //           console.log();
  //           setFiles(readFiles);
  //         }
  //       };
  //       reader.readAsArrayBuffer(file);
  //     });
  //   };

  const handleDeleteFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="App">
      <Paper elevation={3} style={{ padding: "16px", margin: "16px 0" }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={6}
            sm={6}
            md={6}
            lg={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid>
              <input
                accept="*"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="raised-button-file">
                <CloudUploadIcon
                  sx={{
                    height: "2em",
                    width: "2em",
                    color: "gray",
                    cursor: "pointer",
                  }}
                />
              </label>
            </Grid>
            <Grid sx={{ display: "flex" }}>
              {" "}
              <Button
                variant="contained"
                color="primary"
                component="span"
                disabled={files.length === 0}
                onClick={() => {
                  uploadFile();
                }}
              >
                Upload Files
              </Button>
            </Grid>
          </Grid>
          {files?.length > 0 ? (
            <Grid item xs={6} sm={6} md={6} lg={6}>
              {files?.length > 0 && (
                <List>
                  {files.map((file, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteFile(index)}
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={file.originalname}
                        secondary={`${(file.size / 1024).toFixed(2)} KB`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          ) : (
            ""
          )}
        </Grid>
      </Paper>
      {/* <iframe
        title="PDF Viewer"
        src="https://gera-crm.s3.amazonaws.com/Unit_Customisation/2100002355/3000000064/Certificate%20%283%29.pdf"
        width="100%"
        height="700px"
      /> */}
    </div>
  );
}

export default FileUploader;
