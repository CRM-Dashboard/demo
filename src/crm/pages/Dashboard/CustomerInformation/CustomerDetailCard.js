import {
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  IconButton,
  Box,
} from "@mui/material";
import CakeIcon from "@mui/icons-material/Cake";
import MailIcon from "@mui/icons-material/Mail";
import WorkIcon from "@mui/icons-material/Work";
import CallIcon from "@mui/icons-material/Call";
import PersonIcon from "@mui/icons-material/Person";
import CelebrationIcon from "@mui/icons-material/Celebration";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import moment from "moment";
import React from "react";

const CustomerDetailCard = ({ customerData }) => {
  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: "18px",
          boxShadow: 3,
          position: "sticky",
          top: "0em",
          // minHeight: "400px",
          height: "500px",
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" mt={1}>
            {customerData?.customerName}
          </Typography>
          {/* <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "12px",
            }}
          >
            <Avatar sx={{}}>
              <WorkIcon sx={{ color: "black" }} />
            </Avatar>
            {customerData?.Occupation}{" "}
            {customerData?.industry && `(${customerData.industry})`}
          </Typography>
          <Typography
            sx={{ fontSize: "12px" }}
            variant="body2"
            color="textSecondary"
          >
            {customerData?.Designation}
          </Typography>
          <Typography
            sx={{ fontSize: "12px" }}
            variant="body2"
            color="textSecondary"
          >
            {customerData?.Company}, {customerData?.WorkPlace}
          </Typography> */}
        </CardContent>

        <CardContent sx={{ width: "100%", paddingLeft: "1em" }}>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: "#62B4FF" }}>
                  {" "}
                  <WorkIcon sx={{ color: "white" }} />
                </Avatar>
              </ListItemAvatar>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <Typography variant="h6" fontSize={14} fontWeight={"bold"}>
                  {customerData?.Designation}
                </Typography>
                <Typography variant="caption" color="InactiveCaptionText">
                  {customerData?.Company || customerData?.WorkPlace
                    ? `At ${customerData.Company}, ${
                        customerData.WorkPlace ? customerData.WorkPlace : ""
                      }`
                    : ""}
                </Typography>
              </Box>
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: "#62B4FF" }}>
                  {" "}
                  <CakeIcon sx={{ color: "white" }} />
                </Avatar>
              </ListItemAvatar>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <Typography variant="h6" fontSize={14} fontWeight={"bold"}>
                  {moment(customerData?.DOB).format("DD MMM YYYY")}
                </Typography>
                <Typography variant="caption" color="InactiveCaptionText">
                  {"Birthday"}
                </Typography>
              </Box>
            </ListItem>
            <Divider />

            {customerData?.anniversary && (
              <>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: "#62B4FF" }}>
                      <CelebrationIcon sx={{ color: "white" }} />
                    </Avatar>
                  </ListItemAvatar>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0 }}
                  >
                    <Typography variant="h6" fontSize={14} fontWeight={"bold"}>
                      {moment(customerData.anniversary).format("DD MMM YYYY")}
                    </Typography>
                    <Typography variant="caption" color="InactiveCaptionText">
                      {"Anniversary"}
                    </Typography>
                  </Box>
                </ListItem>
                <Divider />
              </>
            )}

            <ListItem
              secondaryAction={
                <IconButton
                  sx={{ backgroundColor: "green" }}
                  edge="end"
                  aria-label="comments"
                >
                  <CallIcon sx={{ color: "white" }} />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: "#62B4FF" }}>
                  {" "}
                  <PhoneAndroidIcon sx={{ color: "white" }} />
                </Avatar>
              </ListItemAvatar>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <Typography variant="h6" fontSize={14} fontWeight={"bold"}>
                  {customerData?.Mobile}
                </Typography>
                <Typography variant="caption" color="InactiveCaptionText">
                  {"Phone"}
                </Typography>
              </Box>
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: "#62B4FF" }}>
                  <MailIcon sx={{ color: "white" }} />
                </Avatar>
              </ListItemAvatar>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <Typography variant="h6" fontSize={14} fontWeight={"bold"}>
                  {customerData?.Email}
                </Typography>
                <Typography variant="caption" color="InactiveCaptionText">
                  {"Email"}
                </Typography>
              </Box>
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: "#62B4FF" }}>
                  {" "}
                  <PersonIcon sx={{ color: "white" }} />
                </Avatar>
              </ListItemAvatar>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <Typography variant="h6" fontSize={14} fontWeight={"bold"}>
                  {customerData?.Age} Years, {customerData?.Gender}
                </Typography>
                <Typography variant="caption" color="InactiveCaptionText">
                  {"Age & Gender"}
                </Typography>
              </Box>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </>
  );
};

export default CustomerDetailCard;
