/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Table from "mui-datatables";
import PDFViewer from "./../../components/pdfViewer/PdfViewer";
import CrmModal from "../../components/crmModal/CrmModal";
import GlobalFunctions from "../../utils/GlobalFunctions";
import { Box, IconButton, Button, Grid } from "@mui/material";
import { useSelector } from "react-redux/es/hooks/useSelector";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CrmDatePicker from "../../components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";
import LabelWithCheckbox from "../../components/labelWithCheckBox/LabelWithCheckBox";
import CircularScreenLoader from "../../components/circularScreenLoader/CircularScreenLoader";

export default function Invoices() {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [url, setURL] = useState("");
  const [arrForMail, setArrForMail] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        "",
        item?.Milestone,
        item?.duedate,
        `₹${item?.gstamount}`,
        item.invoicedate,
        `₹${item.netamount}`,
        item.pTerms,
        `₹${item.totalamount}`,
      ];
    });
    return modifiedResponse;
  };

  const isValuePresent = (valueToCheck) => {
    return arrForMail.some((item) => item.vbeln === valueToCheck);
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
                      { vbeln: data.vbeln },
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
                if (!isValuePresent(response[rowIndex].vbeln)) {
                  setArrForMail((prevItems) => [
                    ...prevItems,
                    { vbeln: response[rowIndex].vbeln },
                  ]);
                } else if (isValuePresent(response[rowIndex].vbeln)) {
                  setArrForMail((prevItems) =>
                    prevItems.filter(
                      (item) => item.vbeln !== response[rowIndex].vbeln
                    )
                  );
                }
              }}
            >
              <LabelWithCheckbox
                value={isValuePresent(response[rowIndex].vbeln)}
              />
            </IconButton>,
          ],
      },
    },
    {
      name: "Milestone",
      label: "Milestone",
    },
    {
      name: "Due Date",
      label: "Due Date",
    },
    {
      name: "GST Amount",
      label: "GST Amount",
    },
    {
      name: "Invoice Date",
      label: "Invoice Date",
    },
    {
      name: "Unit Installment",
      label: "Unit Installment",
    },
    {
      name: "Terms",
      label: "Terms",
    },
    {
      name: "Total Amount",
      label: "Total Amount",
    },
    {
      label: "Action",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <IconButton color="primary" size="small">
            <PictureAsPdfIcon
              onClick={() => {
                setURL(
                  `/sap/bc/crm/invoice_print?sap-client=250&vbeln=${response[dataIndex].vbeln}&sap-user=${userName}&sap-password=${passWord}`
                );
                setOpenModal(true);
              }}
              fontSize="inherit"
            />
          </IconButton>,
        ],
      },
    },
  ];

  useEffect(() => {
    const date = dayjs(selectedDate.$d).format("DD/MM/YYYY");
    const projectId = reducerData.dashboard.project.projectId;
    setIsLoading(true);
    fetch(
      `/sap/bc/react/crm/so_invoices_dt?sap-client=250&werks=${projectId}&fkdat=${date}&sap-user=${userName}&sap-password=${passWord}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setResponse(data.InvoiceList);
          setIsLoading(false);
          setTableData(modifyResponse(data.InvoiceList));
        } else {
          setIsLoading(false);
        }
      });
  }, [reducerData.searchBar.orderId, selectedDate]);

  const sendMails = () => {
    fetch(`/sap/bc/react/crm/invoice_mail?sap-client=250`, {
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
          setArrForMail([]);
        }
      })
      .catch((error) => {
        if (error) {
          snackbar.showError("Error while sending mail. Please try again!");
        }
      });
  };

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
        sx={{
          backgroundColor: "#00008B",
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

  return (
    <Box sx={{}}>
      {!isLoading ? (
        <>
          <ThemeProvider theme={() => getMuiTheme()}>
            <Table
              data={tableData}
              columns={columns}
              options={options}
              title={
                <Grid container spacing={4}>
                  <Grid item xs={4} sm={6} md={6}>
                    <CrmDatePicker
                      sx={{
                        "& .MuiInputBase-root": {
                          height: 45,
                        },
                      }}
                      hideIcon
                      value={dayjs(selectedDate)}
                      onChange={(value) => {
                        console.log("#######date", value);

                        setSelectedDate(value);
                      }}
                    ></CrmDatePicker>
                  </Grid>
                </Grid>
              }
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
        </>
      ) : (
        <CircularScreenLoader />
      )}
    </Box>
  );
}
