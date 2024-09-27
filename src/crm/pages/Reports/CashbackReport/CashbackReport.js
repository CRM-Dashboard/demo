/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import Table from "mui-datatables";
import { useSelector } from "react-redux";
import FileUploader from "./FileUploader";
import { Grid, Button, IconButton, MenuItem, Checkbox } from "@mui/material";
import CreateCashBackReceipt from "./CreateCashBackReceipt";
import CrmModal from "../../../components/crmModal/CrmModal";
import GlobalFunctions from "./../../../utils/GlobalFunctions";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputField from "../../../components/inputField/InputField";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";
import LabelWithCheckbox from "../../../components/labelWithCheckBox/LabelWithCheckBox";
import CircularScreenLoader from "../../../components/circularScreenLoader/CircularScreenLoader";

export default function CashbackReport() {
  const [response, setResponse] = useState([]);
  const [requestNo, setRequestNo] = useState();
  const [fileIndex, setFileIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [cashbackId, setCashbackId] = useState("");
  const [dataToUpdate, setDataToUpdate] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState();
  const [projectData, setProjectData] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [openFileUpload, setOpenFileUpload] = useState(false);
  const [openCreateForm, setopenCreateForm] = useState(false);

  const ref = useRef(null);
  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const OrderId = reducerData?.searchBar?.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  // const projectId = reducerData.dashboard.project.projectId;
  const loggedInUser = reducerData.LoginReducer.loggedInUser;

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

  const saveCashbackReceipt = () => {
    if (ref.current) {
      ref.current.saveReceipt();
    }
  };

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        "",
        item?.cashback,
        item?.building,
        item?.flatno,
        item?.customer,
        item?.appDt,
        item?.regDt,
        item?.delay,
        item?.status,
        item?.selfEmp,
        item?.salaried,
        item?.selfFund,
        item?.bankLoan,
        item?.eligible,
      ];
    });
    return modifiedResponse;
  };

  async function getData() {
    setLoading(true);
    const formData = new FormData();
    formData.append("projectId", selectedProjects.toString());
    formData.append("orderId", OrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(process.env.REACT_APP_SERVER_URL + "/api/reports/cashbackList", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setResponse(data);
        setTableData(modifyResponse(data));
        console.log("@@@@@@@@@data", data);
        setLoading(false);
      })
      .catch(() => {});
  }

  const columns = [
    {
      options: {
        customBodyRenderLite: (rowIndex) =>
          tableData.length > 0 && [
            <IconButton
              color="primary"
              size="small"
              id={rowIndex[0]}
              onClick={() => {
                setSelectedOrderId(response[rowIndex].orderId);
                setDataToUpdate(response[rowIndex]);
                setCashbackId(
                  response[rowIndex].cashback + response[rowIndex].orderId
                );
                setRequestNo(response[rowIndex].cashback);
              }}
              style={
                response[rowIndex].status.length > 0
                  ? { pointerEvents: "none", opacity: "0.4" }
                  : {}
              }
            >
              <LabelWithCheckbox
                value={
                  cashbackId
                    ? response[rowIndex].cashback +
                        response[rowIndex].orderId ===
                      cashbackId
                    : false
                }
              />
            </IconButton>,
          ],
      },
    },
    { name: "Type" },
    { name: "Building" },
    { name: "Unit" },
    {
      name: "Customer Name",
    },
    {
      name: "Application Date",
    },
    {
      name: "Registration Date",
    },
    {
      name: "Delay",
    },
    {
      name: "Status",
    },
    { name: "Self Employee" },
    {
      name: "Salaried",
    },
    {
      name: "Self Fund",
    },
    {
      name: "Bank Loan",
    },
    {
      name: "Eligible",
    },
  ];

  const getFilesCount = () => {
    const formData = new FormData();
    formData.append("reqNo", requestNo);
    formData.append("orderId", OrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("process", "CASHBACK");
    fetch(
      process.env.REACT_APP_SERVER_URL + "/api/activity/getFileUrlsByReqNo",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setFileIndex(data.data.length);
        }
      });
  };

  const saveUrls = (fileUrls) => {
    const entryData = [];
    var Index = fileIndex;
    // eslint-disable-next-line array-callback-return
    fileUrls?.map((obj) => {
      entryData.push({
        DOKNR: requestNo,
        REFERENCE: selectedOrderId,
        LO_INDEX: Index + 1,
        PROCESS: "CASHBACK",
        FILENAME: obj?.key?.split("/")?.pop(),
        URL: obj.url,
        AEDAT: new Date()?.toISOString()?.split("T")[0],
        AENAM: loggedInUser.name,
        AEZET: new Date()?.toLocaleTimeString("en-GB", { hour12: false }),
      });
      Index = Index + 1;
    });

    const formData = new FormData();
    formData.append("entryData", JSON.stringify(entryData));
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(
      process.env.REACT_APP_SERVER_URL + "/api/activity/saveUploadedFiles",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          snackbar.showSuccess("File URLs data saved successfully");
        }
      });

    console.log("data*************", entryData);
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
        disabled={!cashbackId}
        onClick={() => {
          setopenCreateForm(true);
        }}
        sx={{ marginRight: "0.5em" }}
      >
        Create
      </Button>,
    ],
  };

  const getProjectData = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(process.env.REACT_APP_SERVER_URL + "/api/project", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setProjectData(data.ProjectList);
      });
  };

  const handleProjectSelection = (event) => {
    const value = event.target.value;
    setSelectedProjects(typeof value === "string" ? value.split(",") : value);
    console.log(
      "###########selected projects",
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    getProjectData();
    // getData();
  }, []);

  return (
    <Grid sx={{ paddingTop: "0.5em" }}>
      <Grid
        container
        spacing={2}
        columnSpacing={2}
        columns={12}
        sx={{
          paddingLeft: "0.5em",
          paddingRight: "0.5em",
          paddingBottom: "0.5em",
          marginTop: "0.5em",
          marginLeft: "0.01em",
          marginRight: "1em",
          backgroundColor: "white",
        }}
      >
        <Grid item xs={4} sm={4} lg={4} md={4}>
          <InputField
            select
            label={"Project"}
            value={selectedProjects}
            onChange={handleProjectSelection}
            SelectProps={{
              multiple: true,
              renderValue: (selected) =>
                selected
                  .map(
                    (id) =>
                      projectData.find((project) => project.projectId === id)
                        ?.name
                  )
                  .join(", "), // Shows project names as comma-separated values
            }}
          >
            <MenuItem value="">
              <em>Select Project</em>
            </MenuItem>

            {projectData?.map((project) => (
              <MenuItem key={project?.projectId} value={project?.projectId}>
                <Checkbox
                  sx={{
                    "&.MuiButtonBase-root": {
                      padding: "0px",
                      paddingRight: "9px",
                    },
                  }}
                  checked={selectedProjects.indexOf(project?.projectId) > -1}
                />
                {project?.name}
              </MenuItem>
            ))}
          </InputField>
        </Grid>
        <Grid item xs={4} sm={4} lg={4} md={4} />
        <Grid
          item
          xs={4}
          sm={4}
          lg={4}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Button
            disabled={selectedProjects?.toString()?.trim()?.length === 0}
            variant="contained"
            onClick={() => {
              // [
              //   "Registration_status",
              //   "Confirmation_status",
              //   "Possession_status",
              // ].map((group) => {
              //   console.log(
              //     "####################status codes",
              //     getSelectedStatusCodes(group)
              //   );
              // });
              // console.log(
              //   "############# selectddata",
              //   selectedProjects,
              //   selectedCrmIds
              // );
              // getSelectedStatusCodes();
              getData();
            }}
          >
            {" "}
            Apply{" "}
          </Button>
        </Grid>
      </Grid>
      <br />

      {!loading ? (
        <ThemeProvider theme={() => getMuiTheme()}>
          <Table data={tableData} columns={columns} options={options}></Table>
        </ThemeProvider>
      ) : (
        <CircularScreenLoader />
      )}
      <CrmModal
        maxWidth="md"
        show={openCreateForm}
        handleShow={() => {
          setopenCreateForm(false);
          setCashbackId("");
        }}
        primaryBtnText="Create"
        SecondaryBtnText="Close"
        secondarySave={() => {
          setopenCreateForm(false);
          setCashbackId("");
        }}
        disabled={!isFileUploaded}
        primarySave={() => {
          saveCashbackReceipt();
          setCashbackId("");
        }}
        title="Create Cashback Request"
      >
        <CreateCashBackReceipt
          setIsFileUploaded={setIsFileUploaded}
          getFilesCount={getFilesCount}
          requestNo={requestNo}
          setOpenFileUpload={setOpenFileUpload}
          setopenCreateForm={setopenCreateForm}
          ref={ref}
          getTableData={getData}
          dataToUpdate={dataToUpdate}
          isFileUploaded={isFileUploaded}
        />
      </CrmModal>
      <CrmModal
        maxWidth="sm"
        show={openFileUpload}
        handleShow={() => {
          setOpenFileUpload(false);
        }}
        SecondaryBtnText="Close"
        secondarySave={() => {
          setOpenFileUpload(false);
        }}
      >
        <FileUploader
          callBack={saveUrls}
          requestNo={requestNo}
          // isFileUploaded={isFileUploaded}
          selectedOrderId={selectedOrderId}
          setOpenFileUpload={setOpenFileUpload}
          setIsFileUploaded={setIsFileUploaded}
        />
      </CrmModal>
    </Grid>
  );
}
