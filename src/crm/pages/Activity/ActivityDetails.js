/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import Table from "mui-datatables";
import {
  MenuItem,
  Select,
  Grid,
  Avatar,
  Popover,
  Typography,
  Button,
} from "@mui/material";
import moment from "moment";
import Updates from "./Updates";
import PersonIcon from "@mui/icons-material/Person";
import CreateNewActivity from "./CreateNewActivity";
import GlobalFunctions from "../../utils/GlobalFunctions";
import CrmModal from "../../components/crmModal/CrmModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";
import CircularScreenLoader from "../../components/circularScreenLoader/CircularScreenLoader";

export default function ActivityDetails() {
  const [dpData, setDpdata] = useState([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [actTypeData, setActTypeData] = useState([]);
  const [actModeData, setActModeData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openUpdates, setOpenUpdates] = useState(false);
  const [selectedValues, setSelectedValues] = useState({});
  const [subActTypeData, setSubActTypeData] = useState([]);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [disabledCreateBtn, setDisabledCreateBtn] = useState(false);

  const reducerData = useSelector((state) => state);
  const crmId = reducerData.dashboard.crmId;
  const OrderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData?.dashboard?.project?.projectId;

  const snackbar = UseCustomSnackbar();
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const ref = useRef(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const saveLog = async (data) => {
    const now = new Date();
    const entryData = {
      OBJECTID: OrderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Update Activity",
      CHANGEIND: "U",
      VALUE_OLD: {},
      VALUE_NEW: data,
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const DropDownCell = ({ value, tableMeta, onChange }) => {
    const handleChange = (event) => {
      const selectedValue = event.target.value;
      onChange(selectedValue);
      const data = tableMeta.rowData;
      const searchedString = `${data[0]}${OrderId}${data[6]}${data[4]}`;

      const updatedData = response?.filter((obj) => {
        const concatenatedString = `${obj.erdat}${OrderId}${obj.pltac}${obj.action}`; //${obj.pltac}
        return concatenatedString === searchedString;
      });

      const updatedObject = {
        ...updatedData[0], // Copy existing properties
        comp_ind: selectedValue == "X" ? "X" : "", // Append new key-value pair
      };

      const finalData = { ...updatedObject };
      delete finalData["compInd"];
      const entryData = {
        ...finalData,
        act_typ: finalData.actTyp,
        werks: projectId,
        // Omit the 'actTyp' key from the new object
        ...(delete finalData.actTyp && { actTyp: finalData.actTyp }),
      };

      setSelectedValues({
        ...selectedValues,
        [tableMeta.rowIndex]: selectedValue,
      });

      const formData = new FormData();
      formData.append("orderId", OrderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("entryData", JSON.stringify(entryData));

      fetch(
        // "https://gera-crm-server.azurewebsites.net//api/activity/createActivity",
        `${process.env.REACT_APP_SERVER_URL}/api/activity/createActivity`,
        { method: "POST", body: formData }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            saveLog(entryData);
            snackbar.showSuccess("Activity updated successfully!");
            getTableData();
          }
        })
        .catch((error) => {
          if (error) {
            snackbar.showError(
              "Error while updating activity. Please try again!"
            );
          }
        });
    };

    return (
      <div>
        <Select
          value={selectedValues[tableMeta.rowIndex] || value}
          onChange={handleChange}
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
              margin: "0.4em",
              height: "2em",
              borderRadius: "0.1em",
            }}
            value="Open"
          >
            <Typography>Open</Typography>
          </MenuItem>
          <MenuItem
            sx={{
              margin: "0.4em",
              height: "2em",
              borderRadius: "0.1em",
            }}
            value="X"
          >
            <Typography>Completed</Typography>
          </MenuItem>
        </Select>
      </div>
    );
  };

  const createNewActivity = () => {
    if (ref.current) {
      ref.current.createActivity();
    }
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
      name: "Customer",
      label: "Customer",
    },
    {
      name: "Building",
      label: "Building",
    },
    {
      name: "Date",
      label: "Date",
    },
    {
      name: "Activity Type",
      label: "Activity Type",
    },
    {
      name: "Mode",
      label: "Mode",
    },
    {
      name: "Amount",
      label: "Amount",
    },
    {
      name: "Action",
      label: "Action",
    },
    {
      name: "Remarks",
      label: "Remarks",
    },
    {
      name: "Time",
      label: "Time",
    },
    {
      name: "Status",
      label: "Status",
      options: {
        customBodyRender: (value, tableMeta) => (
          <DropDownCell
            value={value}
            tableMeta={tableMeta}
            onChange={(selectedValue) => setSelectedValues(selectedValue)}
          />
        ),
      },
    },
  ];

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item.customer,
        item.maktx,
        moment(item?.erdat).format("DD-MM-YYYY"),
        item.actTypTxt,
        item.actModeTxt,
        item.dmbtr,
        item.action,
        item.remark,
        item.pltac,
        item.compInd == "X" ? "X" : "Open",
      ];
    });
    return modifiedResponse;
  };

  const getTableData = () => {
    const formData = new FormData();
    !OrderId && formData.append("crmId", crmId);
    formData.append("orderId", OrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("projectId", projectId);
    setLoading(true);
    fetch(
      // `https://gera-crm-server.azurewebsites.net//api/activity/getActivity`,
      `${process.env.REACT_APP_SERVER_URL}/api/activity/getActivity`,
      { method: "POST", body: formData }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data[0]?.actdata) {
          setResponse(data[0]?.actdata);
          data[0]?.modedata && setActModeData(data[0]?.modedata);
          data[0]?.typdata && setActTypeData(data[0]?.typdata);
          data[0]?.subtypdata && setSubActTypeData(data[0]?.subtypdata);
          data[0]?.dpdata && setDpdata(data[0]?.dpdata);
          setTableData(modifyResponse(data[0]?.actdata));
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    getTableData();
  }, [OrderId, crmId]);

  return (
    <>
      {!loading ? (
        <div style={{ marginTop: "1em" }}>
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
                  sx={{
                    backgroundColor: "black",
                    height: "1.2em",
                    width: "1.2em",
                  }}
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
            primarySave={() => {
              createNewActivity();
            }}
            disabled={disabledCreateBtn}
            secondarySave={() => {
              setOpenCreateForm(false);
            }}
          >
            <CreateNewActivity
              setopenCreateForm={setOpenCreateForm}
              ref={ref}
              dpData={dpData}
              actTypeData={actTypeData}
              actModeData={actModeData}
              getTableData={getTableData}
              subActTypeData={subActTypeData}
              setDisabledCreateBtn={setDisabledCreateBtn}
            />
          </CrmModal>
        </div>
      ) : (
        <CircularScreenLoader />
      )}
    </>
  );
}
