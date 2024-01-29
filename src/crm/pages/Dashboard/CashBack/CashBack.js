import React, { useState, useEffect } from "react";
import Table from "mui-datatables";
import { Button } from "@mui/material";
import GlobalFunctions from "../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CreateCashBackReceipt from "./CreateCashBackReceipt";
import CrmModal from "../../../components/crmModal/CrmModal";

export default function CashBack() {
  const [tableData, setTableData] = useState([]);
  const [openCreateForm, setopenCreateForm] = useState(false);

  const reducerData = useSelector((state) => state);
  const OrderId = reducerData.searchBar.orderId;

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
        onClick={() => {
          setopenCreateForm(true);
        }}
      >
        Create
      </Button>,
    ],
  };

  const columns = [
    {
      name: "Type",
      label: "Type",
    },
    {
      name: "Created On",
      label: "Created On",
    },
    {
      name: "Created By",
      label: "Created By",
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
  ];

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item?.type,
        item?.createdOn,
        item?.createdBy,
        item?.amount,
        item?.remark,
        item?.status,
      ];
    });
    return modifiedResponse;
  };

  useEffect(() => {
    fetch(`/sap/bc/react/crm/cashback?sap-client=250&vbeln=${OrderId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setTableData(modifyResponse(data));
        }
      });
  }, [OrderId]);

  return (
    <div>
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
        // primarySave={() => {
        //   savePayment();
        // }}
        title="Create Cashback Request"
      >
        <CreateCashBackReceipt />
      </CrmModal>
    </div>
  );
}
