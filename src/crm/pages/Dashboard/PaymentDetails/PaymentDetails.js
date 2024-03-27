/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import Table from "mui-datatables";
import AddIcon from "@mui/icons-material/Add";
import { Box, IconButton, Button, Grid, Typography } from "@mui/material";
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
  const [formdata, setFormData] = useState({});
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
          <Grid sx={{ paddingLeft: "1.3em" }}>
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
          </Grid>
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
                const formData = new FormData();
                formData.append("recpt_no", details.ReceiptNumber);
                formData.append("kunnr", details.CustomerNumber);
                formData.append("vbeln", details.SalesOrderNumber);
                formData.append("userName", userName);
                formData.append("passWord", passWord);

                const URL = "/api/dashboard/paymentDetails/receipt_print";
                setFormData({ method: "POST", body: formData });
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
    const formdata = new FormData();
    formdata.append("userName", userName);
    formdata.append("passWord", passWord);
    formdata.append("orderId", orderId);
    fetch(
      process.env.REACT_APP_SERVER_URL +
        "/api/dashboard/paymentDetails/so_receipt",
      {
        method: "POST",
        body: formdata,
      }
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
    const formData = new FormData();
    formData.append("mailIds", JSON.stringify(arrForMail));
    formData.append("userName", userName);
    formData.append("passWord", passWord);

    setIsLoading(true);

    fetch(
      process.env.REACT_APP_SERVER_URL +
        `/api/dashboard/paymentDetails/receipt_mail`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => {
        return response;
      })
      .then((data) => {
        if (data) {
          snackbar.showSuccess(
            <Typography> Sent Mail(s) Successfully!</Typography>
          );
          setIsLoading(false);
          setArrForMail([]);
        }
      })
      .catch((error) => {
        if (error) {
          snackbar.showError(
            "Error while sending receipt mail. Please try again!"
          );
        }
      });
  };

  useEffect(() => {
    getTableData();
  }, [orderId]);

  const calculateTotal = () => {
    let total = 0;
    tableData.forEach((row) => {
      total += parseFloat(row[3]); // Assuming currency format like "$1000"
    });

    return total.toFixed(2); // Format total as needed
  };

  const options = {
    selectableRows: "none",
    rowsPerPage: 100,
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
    customFooter: () => {
      return (
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td style={{ fontWeight: "Bold", "&.td": { paddingLeft: "0em" } }}>
              {" "}
              Total : {calculateTotal()}
            </td>
          </tr>
        </tfoot>
      );
    },
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
        <div style={{ marginTop: "1em" }}>
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
            <PDFViewer url={url} formdata={formdata}></PDFViewer>
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
        </div>
      ) : (
        <CircularScreenLoader />
      )}
    </Box>
  );
}
