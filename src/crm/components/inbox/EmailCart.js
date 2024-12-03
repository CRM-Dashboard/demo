import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../services/api";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Input,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import ForwardIcon from "@mui/icons-material/Forward";

const EmailCart = ({ content, email, to }) => {
  console.log("to ", to);
  const {
    hasAttachments,
    id,
    sender: {
      emailAddress: { address },
    },
  } = email;
  const [attachments, setAttachments] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(""); // To distinguish between Reply, Reply All, and Forward
  const [emailDetails, setEmailDetails] = useState({
    to: to,
    cc: "",
    bcc: "",
    body: "",
    attachments: [],
  });

  console.log("email", email);

  const getAccessToken = async () => {
    const url = `/api/ticket/get-token`;
    try {
      const tokenData = (await api.get(url)).data;
      return tokenData;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (email && email.hasAttachments) {
      fetchAttachments(id);
    }
  }, [email]);

  const fetchAttachments = async (messageId) => {
    try {
      const url = `https://graph.microsoft.com/v1.0/users/c8fec0e4-c259-49c3-b4ff-64d31353a571/messages/${messageId}/attachments`;
      const token = await getAccessToken();
      const res = (
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).data?.value;
      setAttachments(res);
    } catch (error) {
      console.log("Error fetching attachments", error);
    }
  };

  const downloadAttachment = async (attachmentId, name) => {
    try {
      const urlFE = `https://graph.microsoft.com/v1.0/users/c8fec0e4-c259-49c3-b4ff-64d31353a571/messages/${id}/attachments/${attachmentId}/$value`;
      const token = await getAccessToken();
      const res = await axios.get(urlFE, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name || "attachment");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Error downloading attachment", error);
    }
  };

  const handleReply = () => {
    setModalType("reply");
    // setModalType("forward");
    setOpenModal(true);
  };

  const handleReplyAll = () => {
    setModalType("replyAll");
    setOpenModal(true);
  };

  const handleForward = () => {
    setModalType("forward");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle file changes

  // Helper function to convert files to Base64
  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Handle email submission
  const handleSubmit = async () => {
    try {
      const token = await getAccessToken();

      // Determine the endpoint based on modalType
      let url = `https://graph.microsoft.com/v1.0/users/c8fec0e4-c259-49c3-b4ff-64d31353a571/messages/${id}`;
      if (modalType === "reply") {
        url += "/reply";
      } else if (modalType === "replyAll") {
        url += "/replyAll";
      }
      //else if (modalType === "forward") {
      //   url += "/forward";
      // }

      // Prepare the payload
      const payload = {
        message: {
          subject: email.subject, // Original subject
          body: {
            contentType: "HTML",
            content: emailDetails.body,
          },
          toRecipients: emailDetails.to.split(",").map((address) => ({
            emailAddress: { address },
          })),
          ccRecipients: emailDetails.cc
            ? emailDetails.cc.split(",").map((address) => ({
                emailAddress: { address },
              }))
            : [],
          bccRecipients: emailDetails.bcc
            ? emailDetails.bcc.split(",").map((address) => ({
                emailAddress: { address },
              }))
            : [],
        },
      };

      // Add attachments if any
      if (emailDetails.attachments.length) {
        payload.message.attachments = await Promise.all(
          emailDetails.attachments.map(async (file) => {
            const base64Content = await convertFileToBase64(file);
            return {
              "@odata.type": "#microsoft.graph.fileAttachment",
              name: file.name,
              contentBytes: base64Content.split(",")[1], // Remove "data:" prefix
            };
          })
        );
      }

      // Make the API request
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Success message
      alert("Email sent successfully!");
      setOpenModal(false);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    }
  };

  const handleFileChange = (event) => {
    setEmailDetails({ ...emailDetails, attachments: [...event.target.files] });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f4f7fc",
        // minHeight: "100vh",
        fontFamily: "'Roboto', sans-serif",
        padding: "2rem",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        <Card
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            overflow: "hidden",
            padding: "1.5rem",
            transform: hoveredCard === id ? "scale(1.05)" : "none",
            boxShadow:
              hoveredCard === id
                ? "0 12px 24px rgba(0, 0, 0, 0.2)"
                : "0 8px 16px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
            },
          }}
          onMouseEnter={() => setHoveredCard(id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <Typography variant="body2" sx={{ color: "#1976d2" }}>
            From: {address}
          </Typography>
          {hasAttachments && attachments.length > 0 && (
            <Box
              sx={{
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {attachments.map((attachment) => (
                <Typography
                  key={attachment.id}
                  sx={{
                    display: "block",
                    color: "#007BFF",
                    textDecoration: "none",
                    margin: "0.5rem 0",
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "#0056b3",
                    },
                  }}
                  onClick={() =>
                    downloadAttachment(attachment.id, attachment.name)
                  }
                >
                  📎 {attachment.name}
                </Typography>
              ))}
            </Box>
          )}

          <CardContent
            sx={{ color: "#555", fontSize: "1rem", lineHeight: "1.8" }}
          >
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </CardContent>

          {/* Reply, Reply All, Forward Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <Tooltip title="Reply">
              <IconButton
                color="primary"
                sx={{ padding: "10px", fontSize: "1.5rem" }}
                onClick={handleReply}
              >
                <ReplyIcon />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Reply">
              <IconButton
                color="primary"
                sx={{ padding: "10px", fontSize: "1.5rem" }}
                onClick={handleReplyAll}
              >
                <ReplyAllIcon />
              </IconButton>
            </Tooltip> */}
            {/* <Tooltip title="Reply">
              <IconButton
                color="primary"
                sx={{ padding: "10px", fontSize: "1.5rem" }}
                onClick={handleForward}
              >
                <ForwardIcon />
              </IconButton>
            </Tooltip> */}
          </Box>
        </Card>
      </Box>

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        {/* <DialogTitle
          sx={{ backgroundColor: "#1976d2", color: "#fff", marginBottom: 1 }}
        >
          {modalType === "forward"
            ? "Forward"
            : `${modalType.charAt(0).toUpperCase()} Email`}
        </DialogTitle> */}
        <DialogContent>
          <Grid container spacing={2} padding={2}>
            <Grid item xs={12}>
              <TextField
                label="To"
                variant="outlined"
                fullWidth
                value={emailDetails.to}
                onChange={(e) =>
                  setEmailDetails({ ...emailDetails, to: e.target.value })
                }
                required
              />
            </Grid>
            {(modalType === "reply" || modalType === "replyAll") && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Cc"
                    variant="outlined"
                    fullWidth
                    value={emailDetails.cc}
                    onChange={(e) =>
                      setEmailDetails({ ...emailDetails, cc: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Bcc"
                    variant="outlined"
                    fullWidth
                    value={emailDetails.bcc}
                    onChange={(e) =>
                      setEmailDetails({ ...emailDetails, bcc: e.target.value })
                    }
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                label="Body"
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                value={emailDetails.body}
                onChange={(e) =>
                  setEmailDetails({ ...emailDetails, body: e.target.value })
                }
              />
            </Grid>
            {(modalType === "reply" || modalType === "replyAll") && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel shrink>Attachments</InputLabel>
                  <Input type="file" multiple onChange={handleFileChange} />
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailCart;
