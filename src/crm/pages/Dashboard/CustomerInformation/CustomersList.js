/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CustomersList.css";
import Table from "mui-datatables";
import { useDispatch } from "react-redux";
import CallIcon from "@mui/icons-material/Call";
import { Box, IconButton } from "@mui/material";
import CustomerInfoCard from "./CustomerInfoCard";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";
import customerInfoAction from "../../Dashboard/CustomerInformation/CustomerInfoReducer/CustomerInfoAction";

export default function CustomersList() {
  const [sid, setSid] = useState(0);
  const [response, setResponse] = useState([]);
  const [callAPI, setCallAPI] = useState(false);
  const [stateData, setStateData] = useState([]);
  const [titleData, setTitleData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [occupations, setOccupation] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [customerInfo, setCutomerInfo] = useState("");
  const [openCustInfo, setOpenCustInfo] = useState(false);
  const [filteredResponse, setFilteredResponse] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState("");
  const [customerMobileNumber, setCustomerMobileNumber] = useState("");

  const snackbar = UseCustomSnackbar();
  const dispatch = useDispatch();
  const reducerData = useSelector((state) => state);
  const Sid = reducerData.customerInfoReducer.custListSid;
  const crmId = reducerData.dashboard.crmId;
  const OrderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const loggedInUser = reducerData.LoginReducer.loggedInUser;
  // const projectId = reducerData?.dashboard?.project?.projectId;

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.customerName,
        // item?.Mobile,
        // item?.Email,
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
        item?.Mobile,
      ];
    });
    return modifiedResponse;
  };

  // const maskPhoneNumber = (number) => {
  //   const maskedNumber =
  //     number.substring(0, number.length - 4).replace(/\d/g, "X") +
  //     number.substring(number.length - 4);
  //   return maskedNumber;
  // };

  const getCallDetailsBySid = (sid) => {
    return new Promise((resolve, reject) => {
      if (sid) {
        const apiUrl =
          process.env.REACT_APP_SERVER_URL + "/api/exotel/callDetails";
        const formData = new FormData();
        formData.append("sid", sid);

        fetch(apiUrl, { method: "POST", body: formData })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            if (data) {
              resolve(data.Calls);
            } else {
              reject(new Error("No data received"));
            }
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(new Error("SID is not provided"));
      }
    });
  };

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: OrderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: `${userName} called to ${customerMobileNumber}`,
      CHANGEIND: "",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const saveCallDetailsAPI = (callDetails) => {
    // process.env.REACT_APP_SERVER_URL
    const apiUrl =
      process.env.REACT_APP_SERVER_URL + "/api/topBar/saveCallDetails";

    fetch(apiUrl, { method: "POST", body: callDetails })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          saveLog();
          snackbar.showSuccess("Call Deatails save successfully!");
        }
      })
      .catch((error) => {
        if (error) {
          snackbar.showError(
            "Error while saving call details. Please try again!"
          );
        }
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (callAPI && sid) {
        const interval = setInterval(async () => {
          if (callAPI && sid) {
            try {
              // Fetch status of sid here
              const data = await getCallDetailsBySid(Sid); // Assuming getCallDetailsBySid is an asynchronous function

              const sidData = data?.filter((data) => data.Sid === sid);
              const status = sidData?.[0]?.Status; // Access the status from the first item of the filtered array
              const recordingUrl = sidData?.[0]?.RecordingUrl;
              console.log("status", status, recordingUrl);

              if (status) {
                setCallAPI(false);
                // setOpenActivityModal(true);
                clearInterval(interval); // Stop checking once flag is set to false
                if (status == "completed") {
                  const uploadToS3 = await axios.post(
                    process.env.REACT_APP_SERVER_URL +
                      "/api/exotel/upload-to-s3",
                    {
                      fileUrl: sidData?.[0]?.RecordingUrl,
                    }
                  );

                  console.log("uploadToS3", uploadToS3);

                  //CODE TO UPLOAD Recording URL TO S3 AND USE THAT URL TO SAVE IN SAP
                  console.log("call update api");
                  const [dateStr, timeStr] =
                    sidData?.[0]?.DateCreated.split(" ");
                  const entryData = {
                    SID: sidData?.[0]?.Sid,
                    ERDAT: dateStr,
                    UZEIT: timeStr,
                    CALL_FROM: sidData?.[0]?.From,
                    CALL_TO: sidData?.[0]?.To,
                    PHONESID: sidData?.[0]?.PhoneNumberSid,
                    STATUS: sidData?.[0]?.Status,
                    START_TIME: sidData?.[0]?.StartTime,
                    S3_URL: "",
                    RECORDING_URL: sidData?.[0]?.RecordingUrl,
                    VBELN: OrderId,
                  };

                  const callDatails = new FormData();
                  callDatails.append("userName", userName);
                  callDatails.append("passWord", passWord);
                  callDatails.append("entryData", JSON.stringify(entryData));

                  saveCallDetailsAPI(callDatails);
                }
              }
            } catch (error) {
              console.error("Error fetching status:", error);
            }
          }
        }, 30000); // 30 seconds interval

        return () => {
          clearInterval(interval);
          setCallAPI(false);
          setSid(0);
          dispatch(customerInfoAction.setCustomerInfoSid(""));
        };
      }
    };

    fetchData();
  }, [callAPI]); // Adding dependencies 'callAPI' and 'sid' to re-run effect when they change

  useEffect(() => {
    const initiateOutgoingCall = async () => {
      if (customerMobileNumber !== "") {
        const formData = new FormData();

        formData.append("From", loggedInUser?.mobile);
        formData.append("To", customerMobileNumber);
        formData.append("CallerId", "020-485-55656");
        formData.append("Record", true);

        const apiUrl =
          process.env.REACT_APP_SERVER_URL + "/api/exotel/make-call";

        try {
          fetch(apiUrl, {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data) {
                setCallAPI(true);
                setSid(data.Call.Sid);
                dispatch(customerInfoAction.setCustomerInfoSid(data.Call.Sid));
                console.log("##########call API", data.Call);
                snackbar.showSuccess("Connecting to..." + customerMobileNumber);
              }
            })
            .catch((error) => {
              throw new Error(
                `Error: ${response.status} - ${response.statusText}`
              );
            });
        } catch (error) {
          snackbar.showError("Error while connecting. Please try again!");
        }
      }
    };

    initiateOutgoingCall();
  }, [customerMobileNumber]);

  const getTableData = () => {
    setIsLoading(true);
    // if (projectId) {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    // formData.append("projectId", projectId);
    formData.append("orderId", OrderId);
    !OrderId && formData.append("crmId", crmId);
    fetch(process.env.REACT_APP_SERVER_URL + `/api/dashboard/getcustomer`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setTitleData(data[0].titledata);
          setCountryData(data[0].countrydata);
          setOccupation(data[0].occupationdata);
          setStateData(data[0].statedata);
          setResponse(data[0]?.customerdata);
          setIsLoading(false);
          setTableData(modifyResponse(data[0]?.customerdata));
          if (OrderId) {
            const filteredArray = data[0]?.customerdata?.filter(
              (obj) => obj.orderId === OrderId
            );
            setFilteredResponse(filteredArray);
            setFilteredCustomers(modifyResponse(filteredArray));
          }
        } else {
          setIsLoading(false);
        }
      });
    // }
  };

  useEffect(() => {
    getTableData();
  }, [OrderId, crmId]);

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
        width: "auto",
        customBodyRenderLite: (rowIndex, value) => (
          <div
            style={OrderId ? { color: "blue", cursor: "pointer" } : {}}
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
    // {
    //   name: "Contact Number",
    //   label: "Contact Number",
    // },
    // {
    //   name: "Email ",
    //   label: "Email",
    // },
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
                  ContactNo = filteredCustomers[dataIndex][11];
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
    download: false,
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
        marginTop: "3em",
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
            <CustomerInfoCard
              customerInfo={customerInfo}
              titleData={titleData}
              occupations={occupations}
              countryData={countryData}
              stateData={stateData}
            />
          )}
        </>
      ) : (
        <CircularScreenLoader />
      )}
    </Box>
  );
}
