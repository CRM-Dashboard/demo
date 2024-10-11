/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "mui-datatables";
import { animated, useSpring } from "react-spring";
import { ThemeProvider } from "@mui/material/styles";
import TableMuiTheme from "./../../../utils/TableMuiTheme";
import CrmModal from "../../../components/crmModal/CrmModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { TableRow, TableCell, TableFooter } from "@mui/material";
import PDFViewer from "./../../../components/pdfViewer/PdfViewer";
import { Box, IconButton, Button, Grid, Typography } from "@mui/material";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";
import GlobalFunctions from "./../../../utils/GlobalFunctions";
import LabelWithCheckbox from "../../../components/labelWithCheckBox/LabelWithCheckBox";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";

export default function InvoiceTable() {
  const [url, setURL] = useState("");
  const [page, setPage] = useState(0);
  const [formdata, setFormData] = useState({});
  const [response, setResponse] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [arrForMail, setArrForMail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const orderId = reducerData.searchBar.orderId;
  const getMuiTheme = TableMuiTheme.getMuiTheme(reducerData);
  const txtColour = GlobalFunctions.getThemeBasedDatailsColour(
    reducerData.ThemeReducer.mode
  );

  const ExternalComponent = (props) => {
    return (
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
    );
  };

  const styles = useSpring({
    from: {
      opacity: 0,
      y: "6%",
    },
    to: {
      opacity: 1,
      y: "0%",
    },
  });

  const AnimatedDialog = animated(ExternalComponent);

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        "",
        item?.Milestone,
        item.invoicedate.replaceAll(".", "-") !== "Invalid date"
          ? item.invoicedate.replaceAll(".", "-")
          : "",
        item.pTerms,
        item?.duedate.replaceAll(".", "-") !== "Invalid date"
          ? item?.duedate.replaceAll(".", "-")
          : "",
        GlobalFunctions.formatToIndianNumber(item.netamount),
        GlobalFunctions.formatToIndianNumber(item?.gstamount),
        GlobalFunctions.formatToIndianNumber(item.totalamount),
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
          <Grid sx={{ paddingLeft: "1.3em" }}>
            <LabelWithCheckbox
              value={arrForMail?.length === response?.length}
              disable={
                arrForMail?.length < response?.length && arrForMail?.length > 0
              }
              onClick={() => {
                // eslint-disable-next-line array-callback-return
                response?.map((data) => {
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
          </Grid>
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
      name: "Invoice Date",
      label: "Invoice Date",
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
      label: "Invoice Certificate",
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
    {
      label: "Architect Certificate",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <IconButton color="primary" size="small">
            <PictureAsPdfIcon
              onClick={() => {
                const formData = new FormData();
                formData.append("invoiceNumber", response[dataIndex].vbeln); //3130016274
                formData.append("userName", userName);
                formData.append("passWord", passWord);
                setURL(
                  process.env.REACT_APP_SERVER_URL +
                    "/api/dashboard/archCertificate_print"
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

  useEffect(() => {
    const orderId = reducerData.searchBar.orderId;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("OrderId", orderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);

    fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/invoices", {
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
  }, [reducerData.searchBar.orderId]);

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId + "_" + arrForMail[0].vbeln,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Send invoice mail",
      CHANGEIND: "",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const sendMails = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("mailIds", JSON.stringify(arrForMail));

    setIsLoading(true);
    fetch(
      `https://gera-crm-server.azurewebsites.net//api/dashboard/invoice_mail`,
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
          saveLog();
          snackbar.showSuccess(
            <Typography> Sent Mail(s) Successfully!</Typography>
          );
          // setEnableBtn(true);
          setArrForMail([]);
          setIsLoading(false);
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
    rowsPerPage: 100,
    elevation: 0,
    print: true,
    download: true,
    search: true,
    viewColumns: true,
    filter: true,
    filterType: "dropdown",
    responsive: "standard",
    rowsPerPageOptions: [5, 10, 25, 50],
    onChangeRowsPerPage(numberOfRows) {
      setRowsPerPage(numberOfRows);
    },
    onChangePage(page) {
      setPage(page);
    },
    customTableBodyFooterRender: (opts) => {
      const startIndex = page * rowsPerPage;
      const endIndex = (page + 3) * rowsPerPage;

      let unitSumAmount = opts.data
        .slice(startIndex, endIndex)
        .reduce((accu, item) => {
          return accu + Number(item.data[5].replaceAll(",", ""));
        }, 0);
      let gstSumAmount = opts.data
        .slice(startIndex, endIndex)
        .reduce((accu, item) => {
          return accu + Number(item.data[6].replaceAll(",", ""));
        }, 0);
      let totalSumAmount = opts.data
        .slice(startIndex, endIndex)
        .reduce((accu, item) => {
          return accu + Number(item.data[7].replaceAll(",", ""));
        }, 0);

      return (
        <>
          {tableData.length > 0 && (
            <TableFooter>
              <TableRow>
                {opts.columns.map((col, index) => {
                  if (col.display === "true") {
                    if (!col.name) {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "Milestone") {
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
                    }
                    if (col.name === "Invoice Date") {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "Terms") {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "Due Date") {
                      return <TableCell key={index}>{}</TableCell>;
                    } else if (col.name === "Unit Installment") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {unitSumAmount}
                        </TableCell>
                      );
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
                          {gstSumAmount}
                        </TableCell>
                      );
                    } else if (col.name === "Total Amount") {
                      return (
                        <TableCell
                          style={{
                            color: txtColour,
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                          key={index}
                        >
                          {totalSumAmount}
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
    customToolbar: () => [
      <Button
        variant="contained"
        disableElevation
        disableFocusRipple
        size="small"
        disabled={!arrForMail.length > 0}
        onClick={() => {
          sendMails();
        }}
      >
        Send Mail
      </Button>,
    ],
  };

  return (
    <Box>
      {!isLoading ? (
        <div style={{ marginTop: "1em" }}>
          <ThemeProvider theme={() => getMuiTheme}>
            <Table data={tableData} columns={columns} options={options}></Table>
          </ThemeProvider>
          <AnimatedDialog style={styles} />
        </div>
      ) : (
        <CircularScreenLoader />
      )}
    </Box>
  );
}
