/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, forwardRef } from "react";
import Table from "mui-datatables";
import { IconButton } from "@mui/material";
import CrmModal from "../../components/crmModal/CrmModal";
import GlobalFunctions from "./../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";
import CircularScreenLoader from "./../../../crm/components/circularScreenLoader/CircularScreenLoader";

const ViewAndPrintDocument = forwardRef((props, ref) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfData, setPdfData] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [printOptionId, setPrintOptionId] = useState("");

  const reducerData = useSelector((state) => state);
  const snackbar = UseCustomSnackbar();
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
                  if (pdfData || pdfUrl) {
                    setPdfData("");
                    setPdfUrl("");
                  }
                  setPrintOptionId(tableData[dataIndex][1]);
                  setOpenModal(true);
                  setLoading(true);
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

  useEffect(() => {
    if (props.data) {
      const modifiedResponse = props?.data?.map((item) => {
        return [item.name, item.id];
      });

      setTableData(modifiedResponse);
    }
  }, []);

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Print Documents(NOC/Letter/Files)",
      CHANGEIND: "",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  useEffect(() => {
    if (orderId && printOptionId) {
      setLoading(true);

      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("printOptionId", printOptionId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      fetch(process.env.REACT_APP_SERVER_URL + "/api/topBar/print", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.PrintData === "") {
            snackbar.showError("Document is not available to print!");
            setLoading(false);
            setOpenModal(false);
          }
          await setPdfData(data.PrintData);
          saveLog();
        })
        .catch((error) => {
          setLoading(false);
          setOpenModal(false);
          snackbar.showError("Error while opening PDF. Please try again!");
        });
    }
  }, [printOptionId]);

  useEffect(() => {
    // Convert the base64 string to a Uint8Array
    const pdfBytes = atob([pdfData]);
    const pdfArray = new Uint8Array(pdfBytes.length);
    for (let i = 0; i < pdfBytes.length; i++) {
      pdfArray[i] = pdfBytes.charCodeAt(i);
    }

    // Create a Blob from the Uint8Array
    const pdfBlob = new Blob([pdfArray], { type: "application/pdf" });

    // Create a URL for the Blob
    const url = URL.createObjectURL(pdfBlob);

    setPdfUrl(url);
    setLoading(false);

    // Clean up the URL when the component unmounts
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [pdfData]);

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
          setPdfData("");
          setPdfUrl("");
          setLoading(false);
        }}
        SecondaryBtnText="Close"
        secondarySave={() => {
          setOpenModal(false);
          setPdfData("");
          setPdfUrl("");
          setLoading(false);
        }}
      >
        {loading ? (
          <CircularScreenLoader isModal />
        ) : pdfUrl && pdfData ? (
          <iframe title="PDF Viewer" src={pdfUrl} width="100%" height="700px" />
        ) : (
          ""
        )}
      </CrmModal>
    </div>
  );
});

export default ViewAndPrintDocument;
