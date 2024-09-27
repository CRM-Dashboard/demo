/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, forwardRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import MUIDataTable from "mui-datatables";
import { MenuItem } from "@mui/material";
import { Select, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux/es/hooks/useSelector";
import GlobalFunctions from "./../../../utils/GlobalFunctions";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";

const CreateUnitCustomReq = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [categories, setCategory] = useState([]);
  const [locations, setLocation] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);

  const reducerData = useSelector((state) => state);
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const snackbar = UseCustomSnackbar();

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
          setCategory(data[0].categdata);
          setLocation(data[0].locdata);
        }
      });
  };

  useEffect(() => {
    getTableData();
  }, []);

  const handleAddRow = () => {
    const newRow = ["", "", "", ""];
    setData([...data, newRow]);
  };

  const handleCellEdit = (e, rowIndex, colIndex) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = e.target.value; // Update the Name field value
    setData(newData);
  };

  const saveLog = async (data) => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Create Unit Customisation Request",
      CHANGEIND: "I",
      VALUE_OLD: {},
      VALUE_NEW: data,
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const handleSave = () => {
    const template = ["Category", "Location", "Changes", "vbeln"];
    const updatedData = convertToArrayOfObjects(data, template);

    setBtnLoading(true);

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
          saveLog(updatedData);
          snackbar.showSuccess("Request Created Successfully!");
          props.setCanCreateReq(false);
          setBtnLoading(false);
          props.getTableData();
        }
      });
  };

  function convertToArrayOfObjects(data, template) {
    return data?.map((arr, index) => {
      const obj = {};
      arr.forEach((value, i) => {
        if (template[i] === "vbeln") {
          obj[template[i]] = orderId;
        } else {
          obj[template[i]] = value;
        }
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
    const indices = selectedRows.map((obj) => obj.dataIndex);

    // Filter out rows whose indices are not present in the indices array
    const newData = data?.filter((_, index) => !indices.includes(index));
    setData(newData);
    setRows([]);
    setSelectedRows([]);
  };

  const columns = [
    {
      name: "Category",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
                font: "-webkit-control",
              },
            }}
            id="Category"
            name="Category"
            value={value}
            onChange={(e) => {
              handleCellEdit(e, tableMeta.rowIndex, 0);
            }}
          >
            <MenuItem value=""> {"Select Category"} </MenuItem>
            {categories?.map((data) => {
              return (
                <MenuItem value={data.category}> {data.category}</MenuItem>
              );
            })}
          </Select>
        ),
      },
    },
    {
      name: "Location",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
                font: "-webkit-control",
              },
            }}
            id="Location"
            name="Location"
            value={value}
            onChange={(e) => {
              handleCellEdit(e, tableMeta.rowIndex, 1);
            }}
          >
            <MenuItem value=""> {"Select Category"} </MenuItem>
            {locations.map((data) => {
              return <MenuItem value={data.location}> {data.locTxt}</MenuItem>;
            })}
          </Select>
        ),
      },
    },
    {
      name: "Changes",
      options: {
        customBodyRender: (value, tableMeta) => (
          <input
            type="text"
            value={value}
            onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 2)}
          />
        ),
      },
    },
  ];

  const options = {
    selectableRows: "single",
    responsive: "vertical",
    onRowSelectionChange: handleSetRows,

    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <DeleteIcon
        selectedRows={selectedRows}
        // onDelete={() => handleDeleteRow()}
        onClick={() => handleDeleteRow(setSelectedRows)}
      />
    ),
    customToolbar: () => [
      <Button
        variant="contained"
        disableElevation
        disableFocusRipple
        size="small"
        onClick={handleAddRow}
        sx={{
          "&.MuiButton-root": {
            textTransform: "none",
            backgroundColor: "#228B22",
          },
        }}
      >
        <AddIcon style={{ marginRight: "0.4em" }} />
        Add New Row
      </Button>,
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
          title={"Unit Customisation Request Create"}
          data={data}
          columns={columns}
          options={options}
        />
      </div>
    </>
  );
});

export default CreateUnitCustomReq;
