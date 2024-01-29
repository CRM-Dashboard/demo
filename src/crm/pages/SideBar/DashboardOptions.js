import React from "react";
import { useDispatch } from "react-redux";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logout from "@mui/icons-material/Logout";
import { ListItemIcon, Avatar } from "@mui/material";
import GlobalFunctions from "./../../utils/GlobalFunctions";
import Settings from "@mui/icons-material/SettingsRounded";
import { useSelector } from "react-redux/es/hooks/useSelector";
import loginAction from "../../pages/Login/LoginReducer/LoginAction";
import resetReducerAction from "../../../reducer/resetReducerAction";

export default function DashboardOptions({
  anchor,
  open,
  handleClose,
  setOpenSideBar,
  setAnchor,
}) {
  const reducerData = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div style={{ backgroundColor: "#000000" }} className="toolbarBgColor">
      <Menu
        anchorEl={anchor}
        id="account-menu"
        open={open}
        keepMounted
        onClose={() => {
          setAnchor(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          top: "3.2em",
          left: "86em",
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
        <MenuItem>
          <ListItemIcon>
            <Avatar fontSize="small" />
          </ListItemIcon>
          Profile
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
          Settings
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
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
