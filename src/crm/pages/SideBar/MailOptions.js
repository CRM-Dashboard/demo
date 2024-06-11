import React, { useState } from "react";
import CrmModal from "./../../components/crmModal/CrmModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import DropdownConstants from "./../../utils/DropdownConstants";
import { Box, Typography } from "@mui/material";
import SendMailComponent from "./SendMailComponent";
import CustomTabLayout from "../../components/tabs/CustomTabLayout";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";

export default function MailOptions({ mailAnchor, openMail, setMailAnchor }) {
  const [openModal, setOpenModal] = useState(false);
  const [mailId, setMailId] = useState("");

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const orderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const tabs = [
    {
      label: "Pre-Registration Mail",
      component: (
        <SendMailComponent data={DropdownConstants.preRegistrationMail} />
      ),
    },
    {
      label: "Pre-Possession Mail",
      component: (
        <SendMailComponent data={DropdownConstants.prePossessionMail} />
      ),
    },
  ];

  const sendMail = () => {
    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("mailId", mailId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);

    fetch(process.env.REACT_APP_SERVER_URL + "/api/topBar/mail", {
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
    <div>
      <CustomTabLayout tabPanels={tabs} />
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
