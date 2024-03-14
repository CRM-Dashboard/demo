import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import GlobalFunctions from "./../../utils/GlobalFunctions";
import CrmModal from "./../../components/crmModal/CrmModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import DropdownConstants from "./../../utils/DropdownConstants";
import { Menu, MenuItem, Box, Typography } from "@mui/material";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";

export default function MailOptions({ mailAnchor, openMail, setMailAnchor }) {
  const [openModal, setOpenModal] = useState(false);
  const [mailId, setMailId] = useState("");

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const orderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const sendMail = () => {
    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("mailId", mailId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);

    fetch("/api/topBar/mail", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response;
      })
      .then((data) => {
        if (data) {
          snackbar.showSuccess(
            <Typography> Sent Mail(s) Successfully!</Typography>
          );
          setMailId("");
          setOpenModal(false);
        }
      })
      .catch((error) => {
        if (error) {
          setOpenModal(false);
          snackbar.showError("Error while sending mail. Please try again!");
        }
      });
  };

  return (
    <div style={{ backgroundColor: "#000000" }} className="toolbarBgColor">
      <Menu
        anchorEl={mailAnchor}
        id="account-menu"
        open={openMail}
        keepMounted
        onClose={() => {
          setMailAnchor(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          top: "3.2em",
          left: "76em",
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
        {/* <MenuItem
          onClick={() => {
            setOpenModal(true);
          }}
        >
          <SendIcon /> {"  "}
          <Typography style={{ marginLeft: "0.5em" }}></Typography> Acceptance
          Letter
        </MenuItem> */}
        {DropdownConstants.SendMailOptions.map((mail) => {
          return (
            <MenuItem
              onClick={() => {
                setOpenModal(true);
                setMailId(mail.id);
              }}
            >
              <SendIcon /> {"  "}
              <Typography style={{ marginLeft: "0.5em" }}>
                {" "}
                {mail.name}
              </Typography>
            </MenuItem>
          );
        })}
        {}
      </Menu>
      <CrmModal
        maxWidth="sm"
        show={openModal}
        handleShow={() => {
          setOpenModal(false);
        }}
        primaryBtnText="Yes"
        SecondaryBtnText="No"
        primarySave={() => {
          sendMail();
        }}
        secondarySave={() => {
          setOpenModal(false);
          setMailId("");
        }}
      >
        <Box>
          {" "}
          <Typography fontSize={20}>
            {"Are you sure you want to send mail?"}
          </Typography>
        </Box>
      </CrmModal>
    </div>
  );
}
