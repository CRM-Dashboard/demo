import React from "react";
import { useDispatch } from "react-redux";
import { MenuItem, Menu, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logout from "@mui/icons-material/Logout";
import { ListItemIcon, Avatar } from "@mui/material";
import GlobalFunctions from "./../../utils/GlobalFunctions";
import Settings from "@mui/icons-material/SettingsRounded";
import { useSelector } from "react-redux/es/hooks/useSelector";
import loginAction from "../../pages/Login/LoginReducer/LoginAction";
import resetReducerAction from "../../../reducer/resetReducerAction";
import "./Style.css";

export default function DashboardOptions({
  anchor,
  open,
  setOpenSideBar,
  setAnchor,
}) {
  const reducerData = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div
      style={{
        backgroundColor: "#000000",
        position: "absolute",
      }}
      className="toolbarBgColor"
    >
      <Menu
        anchorEl={anchor}
        id="account-menu"
        open={open}
        keepMounted
        onClose={() => {
          setAnchor(null);
        }}
        MenuListProps={{
          "aria-labelledby": "settings-button",
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          position: "fixed",

          top: "7%",
          transform: "translatex(90%)",
          ".dashboardOptionMenu": {
            top: "3.2em",
            left: "86em",
          },
          "@media screen and (man-width: 1396px)": {
            ".dashboardOptionMenu": {
              left: "80em",
            },
          },
          "& .MuiAvatar-root": {
            width: 22,
            height: 22,
            ml: -0.4,
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
      >
        <MenuItem>
          <ListItemIcon>
            <Avatar fontSize="small" />
          </ListItemIcon>
          <Typography> Profile</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenSideBar(true);
            setAnchor(null);
          }}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <Typography> Settings </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(loginAction.setPassword(""));
            dispatch(loginAction.setUserName(""));
            dispatch(resetReducerAction.resetAllData());
            navigate("/");
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <Typography> Logout </Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}
