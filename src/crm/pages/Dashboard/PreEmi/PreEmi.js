/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import Table from "mui-datatables";
import { Button } from "@mui/material";
import CreatePreEmiReceipt from "./CreatePreEmiReceipt";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import CrmModal from "./../../../components/crmModal/CrmModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";

export default function PreEmi() {
  const [tableData, setTableData] = useState([]);
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [files, setFiles] = useState([]);
  // const [progress, setProgress] = useState(10);
  const [openCreateForm, setopenCreateForm] = useState(false);

  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const OrderId = reducerData.searchBar.orderId;
  const snackbar = UseCustomSnackbar();
  const ref = useRef(null);

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

  const handleCreateBtnClick = () => {
    if (OrderId) {
      const formData = new FormData();
      formData.append("orderId", OrderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/so", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data[0].vbeln) {
            if (
              data[0].schemeStart === "0000-00-00" ||
              data[0].schemeEnd === "0000-00-00"
            ) {
              snackbar.showError(
                "Please set Scheme start and Scheme end date!"
              );
            } else {
              setopenCreateForm(true);
            }
          }
        });
    }
  };

  const calculateTotal = () => {
    let total = 0;
    tableData.forEach((row) => {
      total += parseFloat(row[2]); // Assuming currency format like "$1000"
    });

    return total.toFixed(2); // Format total as needed
  };

  const options = {
    selectableRows: "none",
    rowsPerPage: 50,
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
          handleCreateBtnClick();
        }}
      >
        Create
      </Button>,
    ],
    customFooter: () => {
      return (
        <tfoot>
          <tr>
            <td></td>
            <td style={{ fontWeight: "Bold" }}>
              <label style={{ marginLeft: "25em" }}>
                {" "}
                Total : {calculateTotal()}
              </label>
            </td>
          </tr>
        </tfoot>
      );
    },
  };

  const columns = [
    {
      name: "Request Number",
      label: "Request Number",
    },
    {
      name: "Month",
      label: "Month",
    },
    {
      name: "Amount",
      label: "Amount",
    },
    {
      name: "Remark",
      label: "Remark",
    },
    {
      name: "Status",
      label: "Status",
      //   options: {
      //     customBodyRender: (value) => {
      //       const cellStyle = {
      //         fontWeight: "bold",
      //         color:
      //           value === "Invoiced"
      //             ? "#0E9E07" //green
      //             : value === "Mlstn Not Completed"
      //             ? "#FFD800" //yellow
      //             : "red", //red
      //       };

      //       return <div style={cellStyle}>{value}</div>;
      //     },
      //   },
    },
    {
      name: "Created On",
      label: "Created On",
    },
    {
      name: "Created By",
      label: "Created By",
    },
  ];

  const saveReceiptDetails = () => {
    if (ref.current) {
      ref.current.saveReceipt();
    }
  };

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.repayRequestNo,
        item?.monthTxt,
        item?.amount,
        item?.remark,
        item?.status,
        item?.createdOn,
        item?.createdBy,
      ];
    });
    return modifiedResponse;
  };

  const getTableData = () => {
    if (OrderId) {
      const formData = new FormData();
      formData.append("orderId", OrderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      fetch(process.env.REACT_APP_SERVER_URL + `/api/dashboard/preEmi/repay`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setTableData(modifyResponse(data));
          }
        });
    }
  };

  useEffect(() => {
    getTableData();
  }, [OrderId]);

  // const readFileAsBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     const fileBlob = new Blob([file], { type: file.type });

  //     reader.onload = () => {
  //       const base64String = reader.result.split(",")[1];
  //       resolve(base64String);
  //     };

  //     reader.onerror = (error) => {
  //       reject(error);
  //     };

  //     reader.readAsDataURL(fileBlob);
  //   });
  // };

  // const handleFileUpload = (event) => {
  //   console.log("#######event.target.files", event.target.files);
  //   const files1 = event.target.files;
  //   const filesArray = Array.from(files1);
  //   // setFiles((prevArray) => prevArray.concat(filesArray));
  //   console.log(
  //     "#######event.target.filesArray",
  //     files,
  //     filesArray,
  //     filesArray.length
  //   );
  //   // console.log("#######apended files", [...files, ...filesArray]);
  //   setFiles([...files, ...filesArray]);
  //   const finalFiles = [...files, ...filesArray];

  //   console.log("#######finalFiles", finalFiles);
  //   // Convert each file to base64
  //   Promise.all(finalFiles.map((file) => readFileAsBase64(file)))
  //     .then((base64Array) => {
  //       console.log(base64Array);
  //       setSelectedFile(base64Array);
  //     })
  //     .catch((error) => {
  //       console.error("Error reading files#######:", error);
  //     });
  // };

  // const handleUpload = () => {
  //   const formData = new FormData();

  //   [...files].forEach((file) => {
  //     formData.append("files", file);
  //   });

  //   formData.append("file", selectedFile);
  //   console.log("########files", selectedFile);
  //   // axios.post('/api/upload', formData)
  //   //   .then((response) => {
  //   //     console.log(response.data);
  //   //   })
  //   //   .catch((error) => {
  //   //     console.log(error);
  //   //   });
  // };

  // useEffect(() => {
  //   if (progress !== 100) {
  //     setProgress(progress + 10);
  //   }
  // }, [files]);

  return (
    <div style={{ marginTop: "1em" }}>
      <ThemeProvider theme={() => getMuiTheme()}>
        <Table data={tableData} columns={columns} options={options}></Table>
      </ThemeProvider>
      <CrmModal
        maxWidth="md"
        show={openCreateForm}
        handleShow={() => {
          setopenCreateForm(false);
        }}
        primaryBtnText="Create"
        SecondaryBtnText="Close"
        secondarySave={() => {
          setopenCreateForm(false);
        }}
        primarySave={() => {
          saveReceiptDetails();
        }}
        title="Create Pre Emi / Rental Assurance"
      >
        <CreatePreEmiReceipt
          setopenCreateForm={setopenCreateForm}
          ref={ref}
          getTableData={getTableData}
        />
      </CrmModal>
    </div>
  );
}
