/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  IconButton,
  Button,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import moment from "moment";
import Table from "mui-datatables";
import CrmModal from "../../components/crmModal/CrmModal";
import GlobalFunctions from "../../utils/GlobalFunctions";
import PDFViewer from "./../../components/pdfViewer/PdfViewer";
import { useSelector } from "react-redux/es/hooks/useSelector";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TableRow, TableCell, TableFooter } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import LabelWithCheckbox from "../../components/labelWithCheckBox/LabelWithCheckBox";
import CircularScreenLoader from "../../components/circularScreenLoader/CircularScreenLoader";
import CrmDatePicker from "../../components/crmDatePicker/CrmDatePicker";

export default function Invoices() {
  const [url, setURL] = useState("");
  const [page, setPage] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [response, setResponse] = useState([]);
  const [formdata, setFormData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [arrForMail, setArrForMail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState([null, null]);

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData?.dashboard?.project?.projectId;
  const txtColour = GlobalFunctions.getThemeBasedDatailsColour(
    reducerData.ThemeReducer.mode
  );

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        "",
        moment(item.billingDate).format("DD-MM-YYYY"),
        item?.Milestone,
        item.pTerms,
        item?.duedate,
        `₹${item.netamount}`,
        GlobalFunctions.getFormatedNumber(item?.gstamt),
        `₹${item.totalamount}`,
      ];
    });
    return modifiedResponse;
  };

  const isValuePresent = (valueToCheck) => {
    return arrForMail.some((item) => item.vbeln === valueToCheck);
  };

  const handleDateFilterChange = (dateRange) => {
    setDateRange(dateRange);
    if (dateRange[0] && dateRange[1]) {
      const startDate = dayjs(dateRange[0]).startOf("day");
      const endDate = dayjs(dateRange[1]).endOf("day");
      const filteredData = response.filter((item) => {
        const invoiceDate = dayjs(item.invoicedate, "DD/MM/YYYY");
        return invoiceDate.isAfter(startDate) && invoiceDate.isBefore(endDate);
      });
      setTableData(modifyResponse(filteredData));
    } else {
      setTableData(modifyResponse(response));
    }
  };

  useEffect(() => {
    handleDateFilterChange(dateRange);
  }, [dateRange]);

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
                  if (arrForMail?.length > 0) {
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
          </Grid>
        ),
        customBodyRenderLite: (rowIndex) =>
          tableData?.length > 0 && [
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
      name: "Invoice Date",
      label: "Invoice Date",
      options: {
        filter: true,
        filterType: "custom",
        customFilterListOptions: { render: (v) => `Invoice Date: ${v}` },
        filterOptions: {
          logic: (invoiceDate, filters) => {
            if (filters[0] && filters[1]) {
              const dateToFilter = dayjs(invoiceDate, "DD/MM/YYYY");
              const startDate = dayjs(filters[0]);
              const endDate = dayjs(filters[1]);
              return !(
                dateToFilter.isAfter(startDate.subtract(1, "day")) &&
                dateToFilter.isBefore(endDate.add(1, "day"))
              );
            }
            return false;
          },
          display: (filterList, onChange, index, column) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateRangePicker
                startText="Start Date"
                endText="End Date"
                value={dateRange}
                onChange={(newValue) => {
                  setDateRange(newValue);
                  onChange(newValue);
                }}
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField {...startProps} />
                    <Box sx={{ mx: 2 }}> to </Box>
                    <TextField {...endProps} />
                  </>
                )}
              />
            </LocalizationProvider>
          ),
        },
      },
    },
    {
      name: "Milestone",
      label: "Milestone",
    },
    {
      name: "Terms",
      label: "Terms",
    },
    {
      name: "Due Date",
      label: "Due Date",
    },
    {
      name: "Unit Installment",
      label: "Unit Installment",
    },
    {
      name: "GST Amount",
      label: "GST Amount",
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
                const formData = new FormData();
                formData.append("orderId", response[dataIndex].vbeln);
                formData.append("userName", userName);
                formData.append("passWord", passWord);
                setURL(
                  process.env.REACT_APP_SERVER_URL +
                    "/api/dashboard/invoice_print"
                );
                setFormData({ method: "POST", body: formData });
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
    const formData = new FormData();
    formData.append("toDate", toDate);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("fromDate", fromDate);
    formData.append("projectId", projectId);

    fetch(process.env.REACT_APP_SERVER_URL + "/api/invoices/so_invoices_dt", {
      ///api/dashboard/invoices
      method: "POST",
      body: formData,
    })
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
  };

  // useEffect(() => {
  //   setIsLoading(true);
  //   getTableData();
  // }, [reducerData.searchBar.orderId]);

  const sendMails = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("mails".JSON.stringify(arrForMail));

    fetch(process.env.REACT_APP_SERVER_URL + `/api/invoices/so_invoices_mail`, {
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
        disabled={!arrForMail?.length > 0}
        onClick={() => {
          sendMails();
        }}
      >
        Send Mail
      </Button>,
    ],
    rowsPerPageOptions: [5, 10, 25, 50],
    onChangeRowsPerPage(numberOfRows) {
      setRowsPerPage(numberOfRows);
    },
    onChangePage(page) {
      setPage(page);
    },
    customTableBodyFooterRender: (opts) => {
      const startIndex = page * rowsPerPage;
      const endIndex = (page + 6) * rowsPerPage;

      let sumGstAmount = opts.data
        .slice(startIndex, endIndex)
        .reduce((accu, item) => {
          return accu + Number(item.data[6]?.replaceAll(",", ""));
        }, 0);

      return (
        <>
          {tableData?.length > 0 && (
            <TableFooter>
              <TableRow>
                {opts.columns.map((col, index) => {
                  if (col.display === "true") {
                    if (col.name == undefined) {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "Invoice Date") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          Total
                        </TableCell>
                      );
                    } else if (col.name === "Milestone") {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "Terms") {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "Due Date") {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "Unit Installment") {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "GST Amount") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {sumGstAmount}
                        </TableCell>
                      );
                    }
                  }
                })}
              </TableRow>
            </TableFooter>
          )}
        </>
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

  return (
    <Box sx={{}}>
      {!isLoading ? (
        <>
          <ThemeProvider theme={() => getMuiTheme()}>
            <Table
              title={
                <Grid container columnSpacing={2} columns={12}>
                  <Grid item sm={4} lg={4} md={4}>
                    <CrmDatePicker
                      id="fromDate"
                      name="fromDate"
                      label="From"
                      value={dayjs(fromDate)}
                      onChange={(value) => {
                        const formattedDate = value
                          ? dayjs(value).format("YYYYMMDD")
                          : "";
                        setFromDate(formattedDate);
                      }}
                    />
                  </Grid>
                  <Grid item sm={4} lg={4} md={4}>
                    <CrmDatePicker
                      id="toDate"
                      name="toDate"
                      label="To"
                      value={dayjs(toDate)}
                      onChange={(value) => {
                        const formattedDate = value
                          ? dayjs(value).format("YYYYMMDD")
                          : "";
                        setToDate(formattedDate);
                      }}
                    />
                  </Grid>
                  <Grid item sm={4} md={4} lg={4}>
                    <Button
                      sx={{ backgroundColor: "green", color: "white" }}
                      disabled={!fromDate && !toDate}
                      onClick={() => {
                        getTableData();
                      }}
                    >
                      {" "}
                      Go{" "}
                    </Button>
                  </Grid>
                </Grid>
              }
              data={tableData}
              columns={columns}
              options={options}
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
            <PDFViewer
              url={url}
              formdata={formdata}
              object="Invoice PDF Viewer"
            ></PDFViewer>
          </CrmModal>
        </>
      ) : (
        <CircularScreenLoader />
      )}
    </Box>
  );
}
