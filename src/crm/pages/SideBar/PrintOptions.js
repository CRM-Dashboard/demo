/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Menu, MenuItem, Typography } from "@mui/material";
import CrmModal from "../../components/crmModal/CrmModal";
import GlobalFunctions from "./../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import DropdownConstants from "./../../utils/DropdownConstants";
import PdfIcon from "@mui/icons-material/PictureAsPdf";
import useCustomSnackbar from "./../../components/snackbar/UseCustomSnackBar";
import CircularScreenLoader from "./../../../crm/components/circularScreenLoader/CircularScreenLoader";

export default function PrintOptions({ docAnchor, openDoc, setDocAnchor }) {
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfData, setPdfData] = useState("");
  const [loading, setLoading] = useState(false);
  const reducerData = useSelector((state) => state);
  const [openModal, setOpenModal] = useState(false);
  const [printOptionId, setPrintOptionId] = useState("");

  const snackbar = useCustomSnackbar();
  const orderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  useEffect(() => {
    if (orderId && printOptionId) {
      setLoading(true);

      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("printOptionId", printOptionId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      fetch(process.env.REACT_APP_SERVER_URL + "/api/topBar/print", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.PrintData === "") {
            snackbar.showError("Document is not available to print!");
            setLoading(false);
            setOpenModal(false);
          }
          await setPdfData(data.PrintData);
        })
        .catch((error) => {
          setLoading(false);
          setOpenModal(false);
          snackbar.showError("Error while opening PDF. Please try again!");
        });
    }
  }, [printOptionId]);

  useEffect(() => {
    // Convert the base64 string to a Uint8Array
    const pdfBytes = atob([pdfData]);
    const pdfArray = new Uint8Array(pdfBytes.length);
    for (let i = 0; i < pdfBytes.length; i++) {
      pdfArray[i] = pdfBytes.charCodeAt(i);
    }

    // Create a Blob from the Uint8Array
    const pdfBlob = new Blob([pdfArray], { type: "application/pdf" });

    // Create a URL for the Blob
    const url = URL.createObjectURL(pdfBlob);

    setPdfUrl(url);
    // setLoading(false);

    // Clean up the URL when the component unmounts
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [pdfData]);

  return (
    <div
      style={{
        backgroundColor: "#000000",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        flexDirection: "row-reverse",
      }}
      className="toolbarBgColor"
    >
      <Menu
        anchorEl={docAnchor && docAnchor}
        id="account-menu"
        open={openDoc}
        keepMounted
        onClose={() => {
          setDocAnchor(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          top: "3.2em",
          left: "79em",

          "& .MuiAvatar-root": {
            width: 22,
            height: 22,
            ml: -0.5,
            mr: 0,
          },
          "& .MuiList-root": {
            backgroundColor: GlobalFunctions.getThemeBasedMode(
              reducerData.ThemeReducer.mode
            ),
            color: GlobalFunctions.getThemeBasedDatailsColour(
              reducerData.ThemeReducer.mode
            ),
          },
          "& .MuiSvgIcon-root": {
            color: GlobalFunctions.getThemeBasedDatailsColour(
              reducerData.ThemeReducer.mode
            ),
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        {DropdownConstants?.PrintDocument?.map((option) => {
          return (
            <MenuItem
              id={option?.id}
              onClick={() => {
                if (orderId) {
                  if (pdfData || pdfUrl) {
                    setPdfData("");
                    setPdfUrl("");
                  }
                  setPrintOptionId(option?.id);
                  setOpenModal(true);
                  setLoading(true);
                }
              }}
            >
              <PdfIcon /> {"  "}
              <Typography sx={{ marginLeft: "0.5em" }}>
                {" "}
                {option?.name}{" "}
              </Typography>
            </MenuItem>
          );
        })}
        <CrmModal
          maxWidth="xxl"
          show={openModal}
          handleShow={() => {
            setOpenModal(false);
            setPdfData("");
            setPdfUrl("");
            setLoading(false);
          }}
          SecondaryBtnText="Close"
          secondarySave={() => {
            setOpenModal(false);
            setPdfData("");
            setPdfUrl("");
            setLoading(false);
          }}
        >
          {!loading ? (
            <CircularScreenLoader isModal />
          ) : pdfUrl && pdfData ? (
            <iframe
              title="PDF Viewer"
              src={pdfUrl}
              width="100%"
              height="700px"
            />
          ) : (
            ""
          )}
        </CrmModal>
      </Menu>
    </div>
  );
}
