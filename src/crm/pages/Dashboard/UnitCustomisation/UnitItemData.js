/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, forwardRef } from "react";
import MUIDataTable from "mui-datatables";
import { MenuItem } from "@mui/material";
import { Select, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux/es/hooks/useSelector";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";

const UnitItemData = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [locations, setLocation] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);

  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const snackbar = UseCustomSnackbar();

  const getLocaltionName = (data) => {
    const latestLocation = locations?.filter((obj) => obj?.location === data);
    return latestLocation[0]?.locTxt;
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
          setLocation(data[0].locdata);
          const Data = data[0]?.item?.filter(
            (data) => data?.reqNo === props?.uniqueIdOfItemData[0]
          );

          const DataForTable = Data?.map((item) => {
            return [
              item?.category,
              getLocaltionName(item?.location),
              item?.changes,
              item?.amount,
              item?.feasible,
              item?.approval,
              item?.rejRsn,
              item?.posnr,
              item?.qty,
              item?.uom,
              item?.price,
              item?.reqNo,
              item?.vbeln,
              item?.mandt,
            ];
          });
          setData(DataForTable);
        }
      });
  };

  useEffect(() => {
    getTableData();
  }, []);

  const handleCellEdit = (e, rowIndex, colIndex) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = e.target.value; // Update the Name field value
    setData(newData);
  };

  const handleSave = () => {
    setBtnLoading(true);
    const template = [
      "category",
      "location",
      "changes",
      "amount",
      "feasible",
      "approval",
      "rejRsn",
      "posnr",
      "qty",
      "uom",
      "price",
      "reqNo",
      "vbeln",
      "mandt",
    ];
    const updatedData = convertToArrayOfObjects(data, template);

    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(updatedData));
    fetch(
      process.env.REACT_APP_SERVER_URL +
        "/api/dashboard/createUnitCustomRequest",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          snackbar.showSuccess("Request Updated Successfully!");
          props.setUniqueIdOfItemData("");
          setBtnLoading(false);
        }
      });
  };

  function convertToArrayOfObjects(data, template) {
    return data?.map((arr, index) => {
      const obj = {};
      arr.forEach((value, i) => {
        obj[template[i]] = value;
      });
      return obj;
    });
  }

  const handleSetRows = (currentRowsSelected) => {
    //set rows to delete here
    setSelectedRows(currentRowsSelected);
    // const newData = data.filter((_, index) => !currentRowsSelected.includes(index));
    // setData(newData);
    // setSelectedRows([]);
  };

  const handleDeleteRow = (setRows) => {
    // Add your custom delete logic here
    const indices = selectedRows.map((obj) => obj.dataIndex);

    // Filter out rows whose indices are not present in the indices array
    const newData = data?.filter((_, index) => !indices.includes(index));

    setData(newData);
    setRows([]);
    setSelectedRows([]);
    // /handleSetRows();
  };

  const columns = [
    {
      name: "Category",
    },
    {
      name: "Location",
    },
    {
      name: "Changes",
    },
    {
      name: "Amount",
    },
    {
      name: "Feasible",
    },
    {
      name: "Approval",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
                font: "-webkit-control",
              },
            }}
            id="approval"
            name="approval"
            value={value}
            onChange={(e) => {
              handleCellEdit(e, tableMeta.rowIndex, 5);
            }}
          >
            <MenuItem value="2"> {"No"} </MenuItem>
            <MenuItem value="1"> {"Yes"}</MenuItem>;
          </Select>
        ),
      },
    },
    {
      name: "Rejection Reason",
    },
  ];

  const options = {
    selectableRows: "single",
    responsive: "vertical",
    onRowSelectionChange: handleSetRows,

    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <DeleteIcon
        selectedRows={selectedRows}
        onClick={() => handleDeleteRow(setSelectedRows)}
      />
    ),

    customToolbar: () => [
      <Button
        variant="contained"
        disabled={btnLoading}
        disableElevation
        disableFocusRipple
        size="small"
        onClick={handleSave}
        sx={{
          "&.MuiButton-root": {
            textTransform: "none",
            backgroundColor: "#228B22",
          },
          marginLeft: "1em",
          paddingLeft: "1em",
        }}
      >
        Save{" "}
      </Button>,
    ],
  };

  return (
    <>
      <div style={{ marginTop: "1em" }}>
        <MUIDataTable
          title={"Unit Customisation Request Change"}
          data={data}
          columns={columns}
          options={options}
        />
      </div>
    </>
  );
});

export default UnitItemData;
