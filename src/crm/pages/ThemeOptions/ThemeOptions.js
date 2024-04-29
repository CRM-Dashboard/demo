import React, { useRef, useState, useEffect } from "react";
import "./ThemeOptions.css";
import { Grid } from "@mui/material";
import ThemeAction from "./ThemeAction";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import GlobalFunctions from "../../utils/GlobalFunctions";

const mode_settings = [
  {
    id: "light",
    name: "Light",
    background: "light-background",
    class: "theme-mode-light",
  },
  {
    id: "dark",
    name: "Dark",
    background: "dark-background",
    class: "theme-mode-dark",
  },
];

const color_settings = [
  {
    id: "blue",
    name: "Blue",
    background: "blue-color",
    class: "theme-color-blue",
  },
  {
    id: "red",
    name: "Red",
    background: "red-color",
    class: "theme-color-red",
  },
  {
    id: "cyan",
    name: "Cyan",
    background: "cyan-color",
    class: "theme-color-cyan",
  },
  {
    id: "green",
    name: "Green",
    background: "green-color",
    class: "theme-color-green",
  },
  {
    id: "orange",
    name: "Orange",
    background: "orange-color",
    class: "theme-color-orange",
  },
];

const clickOutsideRef = (content_ref, toggle_ref) => {
  document.addEventListener("mousedown", (e) => {
    // user click toggle
    if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
      content_ref = content_ref.current?.classList?.toggle("active");
    } else {
      // user click outside toggle and content
      if (content_ref?.current && !content_ref?.current?.contains(e.target)) {
        content_ref = content_ref.current?.classList?.remove("active");
      }
    }
  });
};

const ThemeOptions = ({ setOpenSideBar }) => {
  const menu_ref = useRef(null);
  const menu_toggle_ref = useRef(null);

  const reducerData = useSelector((state) => state);
  const mode = GlobalFunctions.getThemeBasedMode(reducerData.ThemeReducer.mode);

  const color = GlobalFunctions.getThemeBasedColour(
    reducerData.ThemeReducer.mode
  );

  clickOutsideRef(menu_ref, menu_toggle_ref);

  const setActiveMenu = () => menu_ref.current.classList?.add("active");

  const closeMenu = () => menu_ref.current.classList?.remove("active");

  const [currMode, setcurrMode] = useState("light");

  const [currColor, setcurrColor] = useState("blue");

  const dispatch = useDispatch();

  const setMode = (mode) => {
    setcurrMode(mode.id);
    localStorage.setItem("themeMode", mode.class);
    dispatch(ThemeAction.setMode(mode.class));
  };

  const setColor = (color) => {
    setcurrColor(color.id);
    localStorage.setItem("colorMode", color.class);
    dispatch(ThemeAction.setColor(color.class));
  };

  useEffect(() => {
    const themeClass = mode_settings.find(
      (e) => e.class === localStorage.getItem("themeMode", "theme-mode-light")
    );

    const colorClass = color_settings.find(
      (e) => e.class === localStorage.getItem("colorMode", "theme-mode-light")
    );

    if (themeClass !== undefined) setcurrMode(themeClass.id);

    if (colorClass !== undefined) setcurrColor(colorClass.id);
  }, []);

  return (
    <div>
      {/* <button
        ref={menu_toggle_ref}
        onClick={() => setActiveMenu()}
        className="dropdown__toggle"
      >
        <i className="bx bx-palette"></i>
      </button> */}

      <Grid
        ref={menu_toggle_ref}
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <CancelIcon
          // className="dropdown__toggle"
          onClick={() => setActiveMenu()}
        />
      </Grid>

      <div
        ref={menu_ref}
        style={{ backgroundColor: mode, color: color }}
        className="theme-menu"
      >
        <h4>Theme settings</h4>
        <button
          className="theme-menu__close"
          onClick={() => {
            closeMenu();
            setOpenSideBar(false);
          }}
        >
          <CloseIcon />
        </button>
        {/* <button className="theme-menu__close" onClick={() => closeMenu()}>
            <i className="bx bx-x"></i>
          </button> */}
        <div className="theme-menu__select">
          <span>Choose mode</span>
          <ul className="mode-list">
            {mode_settings.map((item, index) => (
              <li key={index} onClick={() => setMode(item)}>
                <div className={`mode-list__color ${item.background} `}>
                  {item.id === currMode ? <CheckIcon fontSize="small" /> : ""}
                </div>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="theme-menu__select">
          <span>Choose color</span>
          <ul className="mode-list">
            {color_settings.map((item, index) => (
              <li key={index} onClick={() => setColor(item)}>
                <div className={`mode-list__color ${item.background} `}>
                  {item.id === currColor ? <CheckIcon fontSize="small" /> : ""}
                </div>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ThemeOptions;
