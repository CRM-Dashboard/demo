/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import Table from "mui-datatables";

import moment from "moment";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import GlobalFunctions from "../../utils/GlobalFunctions";
import axios from "axios";
import CrmModal from "../crmModal/CrmModal";
import CreateCustomNotification from "./CreateCustomNotification";
import { Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
const CustomNotification = () => {
  const [tableData, setTableData] = useState([]);
  const [openCreateNotification, setOpenCreateNotification] = useState(false);
  const customNoticeRef = useRef();
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const reducerData = useSelector((state) => state);
  const OrderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiIconButton: {
          styleOverrides: {
            root: {
              variant: "contained",
            },
          },
        },
        MuiSvgIcon: {
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
              lineHeight: "2.2em",
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
    rowsPerPage: 100,
    elevation: 0,
    print: false,
    download: false,
    search: false,
    viewColumns: false,
    filter: false,
    filterType: "dropdown",
    responsive: "standard",
    customToolbar: () => [
      <Button
        variant="contained"
        disableElevation
        disableFocusRipple
        size="small"
        // disabled={!arrForInvoice.length > 0}
        onClick={() => {
          setOpenCreateNotification(true);
        }}
      >
        Create Notification
      </Button>,
    ],
  };

  const columns = [
    {
      name: "Date",
      label: "Date",
    },
    {
      name: "CreatedBy",
      label: "CreatedBy",
    },
    {
      name: "Time",
      label: "Time",
    },
    {
      name: "Message",
      label: "Message",
    },
    {
      name: "AssignTo",
      label: "AssignTo",
    },
  ];

  const addIcon = (type) => {
    if (type === "I") {
      return <InfoIcon sx={{ color: "#0288d1" }} />;
    }
    if (type === "S") {
      return <CheckCircleIcon sx={{ color: "#388e3c" }} />;
    }
    if (type === "W") {
      return <WarningIcon color="secondary" sx={{ color: "#f57c00" }} />;
    }
    if (type === "E") {
      return <CancelIcon sx={{ color: "#d32f2f" }} />;
    }
  };

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      const icon = addIcon(item?.type);

      return [
        moment(item?.createdOn).format("DD-MM-YYYY"),
        item?.createdBy,
        item?.uzeit,
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            {icon} {item?.message}
          </div>
        </>,
        item?.assigned,
      ];
    });
    return modifiedResponse;
  };

  const getData = async () => {
    if (OrderId) {
      const formData = new FormData();
      formData.append("orderId", OrderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      try {
        const res = (
          await axios.post(
            process.env.REACT_APP_SERVER_URL + `/api/topBar/getNotification`,
            formData
          )
        ).data;
        setTableData(modifyResponse(res));
      } catch (error) {
        console.log(error, "err");
      }
    }
  };

  const createNotification = () => {
    if (customNoticeRef.current) {
      customNoticeRef.current.createNotification();
    }
  };

  useEffect(() => {
    getData();
  }, [OrderId]);

  return (
    <>
      <div style={{ marginTop: "1em" }}>
        <ThemeProvider theme={() => getMuiTheme()}>
          <Table data={tableData} columns={columns} options={options}></Table>
        </ThemeProvider>
        <CrmModal
          maxWidth="sm"
          title="Create Notification"
          show={openCreateNotification}
          handleShow={() => {
            setOpenCreateNotification(false);
          }}
          primaryBtnText="Submit"
          SecondaryBtnText="Cancel"
          primarySave={() => {
            createNotification();
          }}
          disabled={disableSubmitBtn}
          secondarySave={() => {
            setOpenCreateNotification(false);
          }}
        >
          <CreateCustomNotification
            getData={getData}
            ref={customNoticeRef}
            // paymentTerms={paymentTerms}
            // arrForInvoice={arrForInvoice}

            // setOpenCreatenvoice={setOpenCreatenvoice}
            setOpenCreateNotification={setOpenCreateNotification}
            setDisableSubmitBtn={setDisableSubmitBtn}
          />
        </CrmModal>
      </div>
    </>
  );
};

export default CustomNotification;
