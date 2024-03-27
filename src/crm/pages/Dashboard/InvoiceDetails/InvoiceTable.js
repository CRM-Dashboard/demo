/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "mui-datatables";
import { Box, IconButton, Button, Grid, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CrmModal from "../../../components/crmModal/CrmModal";
import LabelWithCheckbox from "../../../components/labelWithCheckBox/LabelWithCheckBox";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";
import PDFViewer from "./../../../components/pdfViewer/PdfViewer";
import { useSelector } from "react-redux/es/hooks/useSelector";
import TableMuiTheme from "./../../../utils/TableMuiTheme";
import { animated, useSpring } from "react-spring";

export default function InvoiceTable() {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [url, setURL] = useState("");
  const [arrForMail, setArrForMail] = useState([]);
  const [formdata, setFormData] = useState({});

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const getMuiTheme = TableMuiTheme.getMuiTheme(reducerData);

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
        <PDFViewer url={url} formdata={formdata}></PDFViewer>
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

  const sendMails = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("mailIds", JSON.stringify(arrForMail));
    setIsLoading(true);
    fetch(`/api/dashboard/invoice_mail`, {
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
