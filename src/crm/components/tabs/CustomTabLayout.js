import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import { Box, Typography, Button, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import { MenuOpen } from "@mui/icons-material";
import { useSelector } from "react-redux";
import GlobalFunctions from "../../utils/GlobalFunctions";

const CrmTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))(({ theme }) => ({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    width: "90%",
    backgroundColor: "#7252D3",
  },
}));

const ErpTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    padding: "12px",
    fontSize: "12",
    fontWeight: "500",
    marginRight: "1em",
    color: "#555B6B",
    // "&.Mui-focusVisible": {
    //   backgroundColor: "rgba(100, 95, 228, 0.32)",
    // },
  })
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function CustomTabLayout({
  tabPanels,
  hideTopBorder = false,
  activeTab = 0,
  onTabChange = () => undefined,
}) {
  const reducerData = useSelector((state) => state);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [value, setValue] = React.useState(activeTab);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setValue(index);
    setSelectedIndex(index);
    setAnchorEl(null);
    onTabChange(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function a11yProps(index) {
    return {
      id: `erp-tab-${index}`,
      "aria-controls": `erp-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (selectedIndex !== undefined) {
      setSelectedIndex(undefined);
    }
    onTabChange(newValue);
  };

  return (
    <>
      <Box
        component="div"
        sx={{
          width: "auto",
          bgcolor: "#F3F5F7",
          display: "flex",
          alignItems: "center",
          // border: "1px solid white",
          borderRadius: "18px",
          background: GlobalFunctions.getThemeBasedMode(
            reducerData.ThemeReducer.mode
          ),
          color: GlobalFunctions.getThemeBasedColour(
            reducerData.ThemeReducer.mode
          ),
        }}
      >
        <CrmTabs sx={{ padding: 0 }} value={value} onChange={handleChange}>
          {tabPanels.length > 8
            ? tabPanels
                .slice(0, 8)
                .map((item, index) => (
                  <ErpTab
                    key={index}
                    label={
                      <Typography sx={{ fontSize: "14px" }}>
                        {item.label}
                      </Typography>
                    }
                    {...a11yProps(index)}
                  />
                ))
            : tabPanels.map((item, index) => (
                <ErpTab
                  key={index}
                  disabled={item?.disabled}
                  label={
                    <Typography sx={{ fontSize: "14px" }}>
                      {item.label}
                    </Typography>
                  }
                  {...a11yProps(index)}
                />
              ))}
        </CrmTabs>
        {tabPanels.length > 8 && (
          <>
            <Button
              disableRipple
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              startIcon={<MenuOpen />}
            />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {tabPanels.map((item, index) => (
                <MenuItem
                  key={index}
                  selected={index === selectedIndex}
                  onClick={(event) => handleMenuItemClick(event, index)}
                  disabled={item?.disabled}
                >
                  <Typography sx={{ fontSize: "14px" }}>
                    {item.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Box>
      {tabPanels?.length > 0 && (
        <div style={{ marginBottom: "1em" }}>
          <Box>
            {tabPanels.map((item, index) => (
              <TabPanel key={index} value={value} index={index}>
                {item.component}
              </TabPanel>
            ))}
          </Box>
        </div>
      )}
    </>
  );
}
CustomTabLayout.propTypes = {
  activeTab: PropTypes.number,
  tabPanels: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      component: PropTypes.node.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  hideTopBorder: PropTypes.bool,
  onTabChange: PropTypes.func,
};

export default CustomTabLayout;
