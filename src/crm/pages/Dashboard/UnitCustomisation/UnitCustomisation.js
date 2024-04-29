/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-sparse-arrays */
import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import UnitItemData from "./UnitItemData";
import { Button } from "@mui/material";
import { useSelector } from "react-redux/es/hooks/useSelector";
import CreateUnitCustomReq from "./CreateUnitCustomReq";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const UnitCustomisation = () => {
  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const [data, setData] = useState([]);
  const [canCreateReq, setCanCreateReq] = useState(false);

  const [uniqueIdOfItemData, setUniqueIdOfItemData] = useState("");

  const modifyResponse = (res) => {
    const modifiedResponse = res?.map((item) => {
      return [
        item.reqNo,
        item?.project,
        item?.unit,
        item.customer,
        item.kunnr,
        item.rejRsn,
      ];
    });
    return modifiedResponse;
  };

  const getTableData = () => {
    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(
      process.env.REACT_APP_SERVER_URL + "/api/dashboard/unitCustomDetails",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setData(modifyResponse(data[0].header));
        }
      });
  };

  useEffect(() => {
    getTableData();
  }, []);

  useEffect(() => {
    getTableData();
  }, [orderId]);

  const columns = [
    {
      name: "Request Number",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => {
                setUniqueIdOfItemData(tableMeta.rowData);
              }}
            >
              {value}
            </span>
          );
        },
      },
    },
    {
      name: "Project",
    },
    {
      name: "Unit",
    },
    {
      name: "Customer",
    },
    {
      name: "kunnr",
    },
    { name: "Rejection Reason" },
  ];

  const options = {
    selectableRows: "none",
    customToolbar: () => [
      <Button
        variant="contained"
        disableElevation
        disableFocusRipple
        size="small"
        onClick={() => {
          setCanCreateReq(true);
        }}
      >
        Create New Request
      </Button>,
    ],
  };

  return (
    <>
      <div style={{ marginTop: "1em" }}>
        {canCreateReq ? (
          <>
            <div>
              <Button
                onClick={() => {
                  setCanCreateReq(false);
                }}
              >
                <ArrowBackIosIcon />
                Back
              </Button>
            </div>
            <CreateUnitCustomReq
              setCanCreateReq={setCanCreateReq}
              getTableData={getTableData}
            />
          </>
        ) : !uniqueIdOfItemData ? (
          <MUIDataTable
            title={"Unit Customisation Requests"}
            data={data}
            columns={columns}
            options={options}
          />
        ) : (
          <>
            <div>
              <Button
                onClick={() => {
                  setUniqueIdOfItemData("");
                }}
              >
                <ArrowBackIosIcon />
                Back
              </Button>
            </div>
            <UnitItemData
              uniqueIdOfItemData={uniqueIdOfItemData}
              setUniqueIdOfItemData={setUniqueIdOfItemData}
            />
          </>
        )}
      </div>
    </>
  );
};

export default UnitCustomisation;
