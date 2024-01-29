/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import Table from "mui-datatables";
import AddIcon from "@mui/icons-material/Add";
import { Box, IconButton, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CrmModal from "../../../components/crmModal/CrmModal";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";
import PDFViewer from "./../../../components/pdfViewer/PdfViewer";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";
import { useSelector } from "react-redux/es/hooks/useSelector";
import CreatePaymentReceipt from "./CreatePaymentReceipt";
import LabelWithCheckbox from "../../../components/labelWithCheckBox/LabelWithCheckBox";

export default function PaymentDetails() {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [url, setURL] = useState("");
  const [arrForMail, setArrForMail] = useState([]);
  const [openCreateForm, setopenCreateForm] = useState(false);

  const ref = useRef(null);
  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const orderId = reducerData.searchBar.orderId;

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        "",
        item?.CreatedOn,
        item?.Towards,
        `₹${item?.Amount}`,
        item.UTRNumber,
        item.PaymentDate,
      ];
    });
    return modifiedResponse;
  };

  const isValuePresent = (valueToCheck) => {
    return arrForMail.some((item) => item.recpt_no === valueToCheck);
  };

  const columns = [
    {
      options: {
        customHeadRender: (rowIndex) => (
          <div className="pl-4">
            <LabelWithCheckbox
              value={arrForMail?.length === response?.length}
              disable={
                arrForMail?.length < response?.length && arrForMail?.length > 0
              }
              onClick={() => {
                // eslint-disable-next-line array-callback-return
                response.map((data) => {
                  if (arrForMail.length > 0) {
                    setArrForMail([]);
                  } else {
                    setArrForMail((prevItems) => [
                      ...prevItems,
                      {
                        vbeln: data.SalesOrderNumber,
                        recpt_no: data.ReceiptNumber,
                      },
                    ]);
                  }
                });
              }}
            />
          </div>
        ),
        customBodyRenderLite: (rowIndex) =>
          tableData.length > 0 && [
            <IconButton
              color="primary"
              size="small"
              id={rowIndex[0]}
              onClick={() => {
                if (!isValuePresent(response[rowIndex].ReceiptNumber)) {
                  setArrForMail((prevItems) => [
                    ...prevItems,
                    {
                      vbeln: response[rowIndex].SalesOrderNumber,
                      recpt_no: response[rowIndex].ReceiptNumber,
                    },
                  ]);
                } else if (isValuePresent(response[rowIndex].ReceiptNumber)) {
                  setArrForMail((prevItems) =>
                    prevItems.filter(
                      (item) =>
                        item.recpt_no !== response[rowIndex].ReceiptNumber
                    )
                  );
                }
              }}
            >
              <LabelWithCheckbox
                value={isValuePresent(response[rowIndex].ReceiptNumber)}
              />
            </IconButton>,
          ],
      },
    },
    {
      name: "Created On",
      label: "Created On",
    },
    {
      name: "Towards",
      label: "Towards",
    },
    {
      name: "Amount",
      label: "Amount",
    },
    {
      name: "UTR Number",
      label: "UTR Number",
    },
    {
      name: "Payment Date",
      label: "Payment Date",
    },

    {
      label: "Action",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <IconButton color="primary" size="small">
            <PictureAsPdfIcon
              onClick={() => {
                const details = response[dataIndex];
                const URL = `/sap/bc/react/crm/receipt_print?sap-client=250&vbeln=${details.SalesOrderNumber}&kunnr=${details.CustomerNumber}&recpt_no=${details.ReceiptNumber}`;
                setURL(URL);
                setOpenModal(true);
              }}
              fontSize="inherit"
            />
          </IconButton>,
        ],
      },
    },
  ];

  const getTableData = () => {
    setIsLoading(true);
    fetch(
      `http://115.124.113.252:8000/sap/bc/react/crm/so_receipt?sap-client=250&vbeln=${orderId}&sap-user=${userName}&sap-password=${passWord}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setResponse(data.PaymentReceipts);
          setIsLoading(false);
          setTableData(modifyResponse(data.PaymentReceipts));
        } else {
          setIsLoading(false);
        }
      });
  };

  const sendMails = () => {
    fetch(`/sap/bc/react/crm/receipt_mail?sap-client=250`, {
      method: "POST",
      body: JSON.stringify(arrForMail),
      headers: {
        Accept: "application/json",
        Origin: "http://115.124.113.252:8000/",
        Referer: "http://115.124.113.252:8000/",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        return response;
      })
      .then((data) => {
        if (data) {
          snackbar.showSuccess("Sent Mail(s) Successfully!");
        }
      })
      .catch((error) => {
        if (error) {
          snackbar.showError("Error while sending mail. Please try again!");
        }
      });
  };

  useEffect(() => {
    getTableData();
  }, [orderId]);

  const options = {
    selectableRows: "none",
    elevation: 0,
    print: true,
    download: true,
    search: true,
    viewColumns: true,
    filter: true,
    customToolbar: () => [
      <Button
        variant="contained"
        disableElevation
        disableFocusRipple
        size="small"
        onClick={() => {
          setopenCreateForm(true);
        }}
        sx={{
          "&.MuiButton-root": {
            textTransform: "none",
            backgroundColor: "#228B22",
          },
        }}
        disabled={!orderId}
      >
        <AddIcon style={{ marginRight: "0.4em" }} />
        New Payment Receipt
      </Button>,
      <Button
        variant="contained"
        disableElevation
        disableFocusRipple
        size="small"
        sx={{
          marginLeft: "1em",
          "&.MuiButton-root": {
            textTransform: "none",
            backgroundColor: "#228B22",
            color: "white",
          },
        }}
        disabled={!arrForMail.length > 0}
        onClick={() => {
          sendMails();
        }}
      >
        Send Mail
      </Button>,
    ],
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

  const savePayment = () => {
    if (ref.current) {
      ref.current.savePaymentDetails();
    }
  };

  return (
    <Box sx={{ top: "30%" }}>
      {!isLoading ? (
        <>
          <ThemeProvider theme={getMuiTheme}>
            <Table
              data={tableData}
              columns={columns}
              options={options}
              sx={{
                MuiTableCell: {
                  head: {
                    backgroundColor: "red !important",
                  },
                },
              }}
            ></Table>
          </ThemeProvider>
          <CrmModal
            maxWidth="xxl"
            show={openModal}
            handleShow={() => {
              setOpenModal(false);
            }}
            SecondaryBtnText="Close"
            secondarySave={() => {
              setOpenModal(false);
            }}
          >
            <PDFViewer url={url}></PDFViewer>
          </CrmModal>
          <CrmModal
            maxWidth="md"
            show={openCreateForm}
            handleShow={() => {
              setopenCreateForm(false);
            }}
            title="Create Payment Receipt"
            primaryBtnText="Create"
            SecondaryBtnText="Close"
            secondarySave={() => {
              setopenCreateForm(false);
            }}
            primarySave={() => {
              savePayment();
            }}
          >
            <CreatePaymentReceipt
              setopenCreateForm={setopenCreateForm}
              getTableData={getTableData}
              ref={ref}
            />
          </CrmModal>
        </>
      ) : (
        <CircularScreenLoader />
      )}
    </Box>
  );
}
