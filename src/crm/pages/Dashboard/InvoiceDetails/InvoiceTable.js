/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "mui-datatables";
import { Box, IconButton, Button, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CrmModal from "../../../components/crmModal/CrmModal";
import LabelWithCheckbox from "../../../components/labelWithCheckBox/LabelWithCheckBox";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";
import PDFViewer from "./../../../components/pdfViewer/PdfViewer";
import { useSelector } from "react-redux/es/hooks/useSelector";
import TableMuiTheme from "./../../../utils/TableMuiTheme";

export default function InvoiceTable() {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [url, setURL] = useState("");
  const [arrForMail, setArrForMail] = useState([]);

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const getMuiTheme = TableMuiTheme.getMuiTheme(reducerData);

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
    const orderId = reducerData.searchBar.orderId;
    setIsLoading(true);
    fetch(
      `http://115.124.113.252:8000/sap/bc/crm/invoices?sap-client=250&vbeln=${orderId}&sap-user=${userName}&sap-password=${passWord}`
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
  }, [reducerData.searchBar.orderId]);

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
        <>
          <ThemeProvider theme={() => getMuiTheme}>
            <Table data={tableData} columns={columns} options={options}></Table>
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
