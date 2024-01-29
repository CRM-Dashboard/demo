/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Table from "mui-datatables";
import {
  IconButton,
  MenuItem,
  Select,
  Badge,
  Grid,
  Avatar,
  Popover,
  Typography,
  Button,
} from "@mui/material";
import GlobalFunctions from "../../utils/GlobalFunctions";
import CrmModal from "../../components/crmModal/CrmModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Updates from "./Updates";
import PersonIcon from "@mui/icons-material/Person";
import MapsUgcRoundedIcon from "@mui/icons-material/MapsUgcRounded";
import PersonOutlineSharpIcon from "@mui/icons-material/PersonOutlineSharp";
import CreateNewActivity from "./CreateNewActivity";

export default function ActivityDetails() {
  const [tableData, setTableData] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [openUpdates, setOpenUpdates] = useState(false);
  const [activityType, setActivityType] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openCreateForm, setOpenCreateForm] = useState(false);

  const reducerData = useSelector((state) => state);
  const OrderId = reducerData.searchBar.orderId;
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const DropDownCell = ({ value, onChange }) => {
    const handleChange = (event) => {
      const selectedValue = event.target.value;
      onChange(selectedValue);

      setSelectedValues({
        ...selectedValues,
        [tableData.rowIndex]: selectedValue,
      });
    };

    return (
      <div>
        <Select
          value={selectedValues[tableData.rowIndex] || value}
          onChange={handleChange}
          style={{
            backgroundColor:
              selectedValues[tableData.rowIndex] === "Done"
                ? "#009000" //green
                : selectedValues[tableData.rowIndex] === "Pending"
                ? "#ff0001" //red
                : "#79affd", //blue
            color: "white",
          }}
          sx={{
            "&.MuiInputBase-root": {
              height: "2em",
              marginTop: "0.2em",
              marginBottom: "0.2em",
            },
          }}
        >
          <MenuItem
            sx={{
              backgroundColor: "#009000", // green
              color: "white",
              margin: "0.4em",
              height: "2em",
              borderRadius: "0.1em",
            }}
            value="Done"
          >
            Done
          </MenuItem>
          <MenuItem
            style={{
              backgroundColor: "#ff0001", //red
              color: "white",
              margin: "0.4em",
              height: "2em",
              borderRadius: "0.1em",
            }}
            value="Pending"
          >
            Pending
          </MenuItem>
          <MenuItem
            style={{
              backgroundColor: "#79affd", //blue
              color: "white",
              margin: "0.4em",
              height: "2em",
              borderRadius: "0.1em",
            }}
            value="In Process"
          >
            In Process
          </MenuItem>
        </Select>
      </div>
    );
  };

  const ActivityTypeOptions = ({ value, onChange }) => {
    const handleChange = (event) => {
      const selectedValue = event.target.value;
      onChange(selectedValue);

      setActivityType({
        ...selectedValues,
        [tableData.rowIndex]: selectedValue,
      });
    };

    return (
      <Grid sx={{ "&.MuiSelect-select": { color: "white" } }}>
        <Select
          value={activityType[tableData.rowIndex] || value}
          onChange={handleChange}
          style={{
            backgroundColor:
              activityType[tableData.rowIndex] === "meet"
                ? "#0047AB" //#00008B
                : activityType[tableData.rowIndex] === "phone"
                ? "#5D3FD3"
                : "#FFA500",
          }}
          sx={{
            "&.MuiInputBase-root": {
              height: "2em",
              marginTop: "0.2em",
              marginBottom: "0.2em",
            },
          }}
        >
          <MenuItem
            sx={{
              backgroundColor: "#0047AB",
              color: "white",
              margin: "0.4em",
              height: "2em",
              borderRadius: "0.1em",
            }}
            value="meet"
          >
            Meeting
          </MenuItem>
          <MenuItem
            style={{
              backgroundColor: "#5D3FD3",
              color: "white",
              margin: "0.4em",
              height: "2em",
              borderRadius: "0.1em",
            }}
            value="phone"
          >
            Phone Call
          </MenuItem>
          <MenuItem
            style={{
              backgroundColor: "#FFA500",
              color: "white",
              margin: "0.4em",
              height: "2em",
              borderRadius: "0.1em",
            }}
            value="onLine"
          >
            Online Meeting
          </MenuItem>
        </Select>
      </Grid>
    );
  };

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiIconButton: {
          styleOverrides: {
            root: {
              color: "Blue",
            },
          },
        },
        MUIDataTableToolbar: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiTablePagination: {
          styleOverrides: {
            selectLabel: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
            selectIcon: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
            displayedRows: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
            select: {
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            footer: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MUIDataTableHeadRow: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MUIDataTableHeadCell: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MUIDataTableBodyCell: {
          styleOverrides: {
            root: {
              backgroundColor: GlobalFunctions.getThemeBasedMode(
                reducerData.ThemeReducer.mode
              ),
              color: GlobalFunctions.getThemeBasedDatailsColour(
                reducerData.ThemeReducer.mode
              ),
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              paddingTop: 0,
              paddingBottom: 0,
              lineHeight: "2em",
              borderLeft: "1px solid rgba(224, 224, 224, 1)",
            },
            head: {
              borderLeft: "1px solid rgba(224, 224, 224, 1)",
            },
          },
        },
        MuiCheckbox: {
          styleOverrides: {
            root: {
              padding: 0,
            },
          },
        },
      },
    });

  const options = {
    selectableRows: "none",
    elevation: 0,
    print: false,
    download: false,
    search: false,
    viewColumns: false,
    filter: false,
    customToolbar: () => [
      <Button
        variant="contained"
        disableElevation
        disableFocusRipple
        size="md"
        onClick={() => {
          setOpenCreateForm(true);
        }}
        sx={{
          "&.MuiButton-root": {
            textTransform: "none",
            backgroundColor: "#228B22",
          },
        }}
        disabled={!OrderId}
      >
        New Activity
      </Button>,
    ],
  };

  const columns = [
    {
      name: "Date",
      label: "Date",
    },
    {
      name: "Billing Percent",
      label: "Billing Percent",
    },
    {
      name: "MileStone Description",
      label: "MileStone Description",
    },
    {
      name: "",
      label: "",
    },
    {
      name: "Amount",
      label: "Amount",
    },
    {
      name: "Status",
      label: "Status",
      //   options: {
      //     customBodyRender: (value) => {
      //       const cellStyle = {
      //         fontWeight: "bold",
      //         color:
      //           value === "Invoiced"
      //             ? "#0E9E07" //green
      //             : value === "Mlstn Not Completed"
      //             ? "#FFD800" //yellow
      //             : "red", //red
      //       };

      //       return <div style={cellStyle}>{value}</div>;
      //     },
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <DropDownCell
            value={value}
            onChange={(selectedValue) => updateValue(selectedValue)}
          />
        ),
      },
    },
    {
      name: "Activity Type",
      label: "Activity Type",
      options: {
        customBodyRender: (value) => (
          <ActivityTypeOptions
            value={value}
            onChange={(selectedValue) => setActivityType(selectedValue)}
          />
        ),
      },
    },
  ];

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.Date,
        item?.BillingPercent,
        item?.MilestoneDescription,
        item?.Amount > 526000 ? (
          <Badge
            color="secondary"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={0}
            showZero
          >
            <MapsUgcRoundedIcon
              style={{ cursor: "pointer" }}
              onClick={() => {
                setOpenUpdates(true);
              }}
            />
          </Badge>
        ) : (
          <MapsUgcRoundedIcon
            style={{ cursor: "pointer" }}
            onClick={() => {
              setOpenUpdates(true);
            }}
          />
        ),
        <IconButton
          aria-describedby={id}
          onClick={handleClick}
          sx={{ "&.MuiIconButton-root": { padding: "3px" } }}
        >
          <Avatar
            style={{ cursor: "pointer", height: "1.5em", width: "1.5em" }}
          >
            <PersonOutlineSharpIcon />
          </Avatar>
        </IconButton>,

        item.Amount,
        item.Status,
        activityType,
      ];
    });
    return modifiedResponse;
  };

  useEffect(() => {
    fetch(`/sap/bc/react/crm/plan?sap-client=250&vbeln=${OrderId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setTableData(modifyResponse(data));
        }
      });
  }, [OrderId]);

  return (
    <div>
      <ThemeProvider theme={() => getMuiTheme()}>
        <Table data={tableData} columns={columns} options={options}></Table>
      </ThemeProvider>
      <CrmModal
        maxWidth="xxl"
        show={openUpdates}
        handleShow={() => {
          setOpenUpdates(false);
        }}
        SecondaryBtnText="Close"
        secondarySave={() => {
          setOpenUpdates(false);
        }}
      >
        <Updates />
      </CrmModal>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Grid>
          <div style={{ padding: "1em" }}>
            <Typography>Suggested People</Typography>
          </div>

          <div
            style={{
              height: "10em",
              width: "20em",
              display: "flex",
              paddingTop: "0.5em",
              paddingBottom: "0.5em",
              paddingLeft: "2em",
            }}
          >
            <Avatar
              sx={{ backgroundColor: "black", height: "1.2em", width: "1.2em" }}
            >
              <PersonIcon sx={{ backgroundColor: "black" }} />
            </Avatar>
            <Typography sx={{ paddingLeft: "1em" }}>
              {" "}
              Aishwarya Bingewar{" "}
            </Typography>
          </div>
        </Grid>
      </Popover>
      <CrmModal
        maxWidth="sm"
        show={openCreateForm}
        handleShow={() => {
          setOpenCreateForm(false);
        }}
        SecondaryBtnText="Close"
        primaryBtnText="Create Activity"
        secondarySave={() => {
          setOpenCreateForm(false);
        }}
      >
        <CreateNewActivity />
      </CrmModal>
      ,
    </div>
  );
}
