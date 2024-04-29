/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, forwardRef, useEffect } from "react";
import Table from "mui-datatables";
import GlobalFunctions from "./../../utils/GlobalFunctions";
import CrmModal from "./../../components/crmModal/CrmModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Box, Typography, IconButton } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";

const SendMailComponent = forwardRef((props, ref) => {
  const [openModal, setOpenModal] = useState(false);
  const [mailId, setMailId] = useState("");
  const [disabledYesBtn, setDisabledYesBtn] = useState(false);
  const [tableData, setTableData] = useState([]);

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const orderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  useEffect(() => {
    if (props.data) {
      const modifiedResponse = props?.data?.map((item) => {
        return [item.name, item.id];
      });

      setTableData(modifiedResponse);
    }
  }, []);

  const sendMail = () => {
    setDisabledYesBtn(true);
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
          setDisabledYesBtn(false);
        }
      })
      .catch((error) => {
        if (error) {
          setOpenModal(false);
          snackbar.showError("Error while sending mail. Please try again!");
        }
      });
  };

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

  const columns = [
    {
      name: "Mail",
      label: "Mail",
    },
    {
      name: "Action",
      label: "Action",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <IconButton color="primary" size="small">
            <ForwardToInboxIcon
              onClick={() => {
                setOpenModal(true);
                setMailId(tableData[dataIndex][1]);
              }}
            />
          </IconButton>,
        ],
      },
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    print: false,
    download: false,
    search: false,
    viewColumns: false,
    filter: false,
    footer: false,
    pagination: false,
  };

  return (
    <div style={{ backgroundColor: "#000000" }} className="toolbarBgColor">
      <ThemeProvider theme={() => getMuiTheme()}>
        <Table data={tableData} columns={columns} options={options}></Table>
      </ThemeProvider>
      <CrmModal
        maxWidth="sm"
        show={openModal}
        handleShow={() => {
          setOpenModal(false);
        }}
        primaryBtnText="Yes"
        SecondaryBtnText="No"
        disabled={disabledYesBtn}
        primarySave={() => {
          sendMail();
        }}
        secondarySave={() => {
          setDisabledYesBtn(true);
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
});
export default SendMailComponent;
