/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "mui-datatables";
import { Box, IconButton } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import CallIcon from "@mui/icons-material/Call";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";
import { useSelector } from "react-redux/es/hooks/useSelector";
import "./CustomersList.css";
import CustomerInfoCard from "./CustomerInfoCard";

export default function CustomersList() {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [openCustInfo, setOpenCustInfo] = useState(false);
  const [customerInfo, setCutomerInfo] = useState("");
  const [customerMobileNumber, setCustomerMobileNumber] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState("");
  const [filteredResponse, setFilteredResponse] = useState([]);

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const OrderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData?.dashboard?.project?.projectId;
  const customerContactNumber = reducerData?.dashboard?.customerContactNo;

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.customerName,
        item?.Mobile,
        item?.Email,
        item?.Address,
        item?.State,
        item?.Country,
        item?.DOB,
        item?.Age,
        item?.Occupation,
        item?.Designation,
        item?.Company,
        item?.Gender,
        item?.city,
      ];
    });
    return modifiedResponse;
  };

  const maskPhoneNumber = (number) => {
    const maskedNumber =
      number.substring(0, number.length - 4).replace(/\d/g, "X") +
      number.substring(number.length - 4);
    return maskedNumber;
  };

  useEffect(() => {
    const initiateOutgoingCall = async () => {
      if (customerMobileNumber !== "") {
        const apiKey = "3466f10b135ae555706ca14fc2ef2e0d200ad0362fb5b150";
        const apiToken = "fd096332b8bc7cadd5df773003cfb45fffa34c4e51274149";
        // const subdomain = "@api.exotel.com";
        // const sid = "gera62";
        // const dataString = "From=9623361900&To=7769952626&CallerId=095-138-86363";
        const formData = new FormData();
        formData.append("From", "09623361900");
        formData.append("To", customerMobileNumber);
        formData.append("CallerId", "095-138-86363");
        formData.append("Record", "true");
        const apiUrl =
          "https://cors-anywhere.herokuapp.com/https://api.exotel.com/v1/Accounts/gera62/Calls/connect.json";
        // const corsAnywhereUrl = "https://cors-anywhere.herokuapp.com/";
        // const corsProxyUrl = "https://cors-proxy.htmldriven.com/";
        const basicAuthToken = btoa(`${apiKey}:${apiToken}`);
        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              Authorization: `Basic ${basicAuthToken}`,
            },
            body: formData,
          });
          if (!response.ok) {
            throw new Error(
              `Error: ${response.status} - ${response.statusText}`
            );
          } else {
            snackbar.showSuccess(
              "Connecting to...",
              maskPhoneNumber(customerContactNumber)
            );
          }
          // const responseBody = await response.json();
        } catch (error) {
          snackbar.showError("Error while connecting. Please try again!");
        }
      }
    };
    initiateOutgoingCall();
  }, [customerMobileNumber]);

  useEffect(() => {
    setIsLoading(true);
    if (projectId) {
      fetch(
        `/sap/bc/react/crm/customer?sap-client=250&projectId=${projectId}&sap-user=${userName}&sap-password=${passWord}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setResponse(data);
            setIsLoading(false);
            setTableData(modifyResponse(data));
            if (OrderId) {
              const filteredArray = data.filter(
                (obj) => obj.orderId === OrderId
              );
              setFilteredResponse(filteredArray);
              setFilteredCustomers(modifyResponse(filteredArray));
            }
          } else {
            setIsLoading(false);
          }
        });
    }
  }, [OrderId]);

  const initialVisibleColumns = [
    {
      name: "Customer Name",
      label: "Customer Name",
      options: {
        customBodyRenderLite: (rowIndex, value) => (
          <div
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => {
              setOpenCustInfo(true);
              setCutomerInfo(response[rowIndex]);
            }}
          >
            {response[rowIndex].customerName}
          </div>
        ),
      },
    },
    {
      name: "Contact Number",
      label: "Contact Number",
    },
    {
      name: "Email ",
      label: "Email",
    },
  ];
  const columns = [
    {
      name: "Customer Name",
      label: "Customer Name",
      options: {
        customBodyRenderLite: (rowIndex, value) => (
          <div
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => {
              if (OrderId) {
                setCutomerInfo(filteredResponse[rowIndex]);
              } else {
                setCutomerInfo(response[rowIndex]);
              }
              setOpenCustInfo(true);
            }}
          >
            {OrderId
              ? filteredCustomers[rowIndex][0]
              : response[rowIndex].customerName}
          </div>
        ),
      },
    },
    {
      name: "Contact Number",
      label: "Contact Number",
    },
    {
      name: "Email ",
      label: "Email",
    },
    {
      name: "Address ",
      label: "Address",
      width: "10em",
      customBodyRender: (value) => (
        <div className="ellipsis-container">
          <span className="ellipsis-text">{value}</span>
        </div>
      ),
    },
    {
      name: "State ",
      label: "State",
    },
    {
      name: "Country ",
      label: "Country",
    },
    {
      name: "DOB ",
      label: "DOB",
    },
    {
      name: "Age ",
      label: "Age",
    },
    {
      name: "Occupation",
      label: "Occupation",
    },
    {
      name: "Designation",
      label: "Designation",
    },
    {
      name: "Company",
      label: "Company",
    },
    {
      name: "Gender",
      label: "Gender",
    },
    {
      name: "City",
      label: "City",
    },
    {
      label: "Action",
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => [
          <IconButton color="primary" size="small">
            <CallIcon
              onClick={() => {
                var ContactNo;
                if (OrderId) {
                  ContactNo = filteredCustomers[dataIndex][1];
                } else {
                  ContactNo = response[dataIndex].Mobile;
                }
                setCustomerMobileNumber(ContactNo);
              }}
              fontSize="inherit"
            />
          </IconButton>,
        ],
      },
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    print: true,
    download: true,
    search: true,
    viewColumns: true,
    filter: true,
    columns: initialVisibleColumns.map((col) => ({
      name: col.name,
      label: col.label,
    })),
  };

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiIconButton: {
          styleOverrides: {
            root: {
              // color: "blue",
              variant: "contained",
              //  GlobalFunctions.getThemeBasedDatailsColour(
              //   reducerData.ThemeReducer.mode
              // ),
            },
          },
        },
        MuiSvgIcon: {
          styleOverrides: {
            root: {
              color: "Blue",
              // GlobalFunctions.getThemeBasedDatailsColour(
              //   reducerData.ThemeReducer.mode
              // ),
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
              lineHeight: "1em",
              width: "2em",
            },
          },
        },
      },
    });

  return (
    <Box
      sx={{
        top: "30%",
        marginTop: "2em",
        height: "100%",
      }}
    >
      {!isLoading ? (
        <>
          {!openCustInfo ? (
            <ThemeProvider theme={() => getMuiTheme()}>
              {reducerData?.searchBar?.searchKey
                ? filteredCustomers && (
                    <Table
                      sx={{ height: "10px", overflow: "hidden" }}
                      data={filteredCustomers}
                      columns={columns}
                      options={options}
                    ></Table>
                  )
                : tableData && (
                    <Table
                      sx={{ height: "10px", overflow: "hidden" }}
                      data={tableData}
                      columns={columns}
                      options={options}
                    ></Table>
                  )}
            </ThemeProvider>
          ) : (
            <CustomerInfoCard customerInfo={customerInfo} />
          )}
        </>
      ) : (
        <CircularScreenLoader />
      )}
    </Box>
  );
}
