/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, forwardRef } from "react";
import Table from "mui-datatables";
import { IconButton } from "@mui/material";
import CrmModal from "../../components/crmModal/CrmModal";
import GlobalFunctions from "./../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularScreenLoader from "./../../../crm/components/circularScreenLoader/CircularScreenLoader";

const ShowFileUsingURL = forwardRef((props, ref) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [tableData, setTableData] = useState([]);

  const reducerData = useSelector((state) => state);
  const orderId = reducerData?.searchBar?.orderId;
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

  const columns = [
    {
      name: "Document",
      label: "Document",
    },
    {
      name: "View / Download ",
      label: "View / Download",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <IconButton color="primary" size="small">
            <img
              alt="pdf"
              className="logo"
              src={require("./../../../assets/pdfIcon.png")}
              style={{ height: "2em", width: "2em", margin: "0.2em" }}
              onClick={() => {
                if (orderId) {
                  if (pdfUrl) {
                    setPdfUrl("");
                  }
                  console.log("##########currenturl", tableData[dataIndex][1]);
                  const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
                    tableData[dataIndex][1]
                  )}&embedded=true`;
                  setPdfUrl(googleViewerUrl);
                  setOpenModal(true);
                }
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

  const getData = () => {
    if (orderId) {
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/so", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data[0]?.so[0]?.carparkAllotedUrl) {
            const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
              data[0].so[0].carparkAllotedUrl
            )}&embedded=true`;
            setPdfUrl(googleViewerUrl);
            saveLog();
            setTableData([
              ["Allotted Car Parking", data[0].so[0].carparkAllotedUrl],
            ]);
            console.log(
              "##########currenturl",
              data[0].so[0].carparkAllotedUrl
            );
          }
        });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Print Documents(Car Parking)",
      CHANGEIND: "",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  return (
    <div
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-end",
        flexDirection: "row-reverse",
        paddingTop: "2em",
        paddingBottom: "2em",
      }}
    >
      <ThemeProvider theme={() => getMuiTheme()}>
        <Table data={tableData} columns={columns} options={options}></Table>
      </ThemeProvider>

      <CrmModal
        maxWidth="xxl"
        show={openModal}
        handleShow={() => {
          setOpenModal(false);
          setPdfUrl("");
          setLoading(false);
        }}
        SecondaryBtnText="Close"
        secondarySave={() => {
          setOpenModal(false);
          setPdfUrl("");
          setLoading(false);
        }}
      >
        {loading ? (
          <CircularScreenLoader isModal />
        ) : pdfUrl ? (
          <iframe title="PDF Viewer" src={pdfUrl} width="100%" height="700px" />
        ) : (
          ""
        )}
      </CrmModal>
    </div>
  );
});

export default ShowFileUsingURL;
