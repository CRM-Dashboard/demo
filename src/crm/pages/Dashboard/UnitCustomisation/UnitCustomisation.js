/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-sparse-arrays */
// TableComponent.js
import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { MenuItem } from "@mui/material";
import { Select } from "@mui/material";

const UnitCustomisation = () => {
  const Data = [
    {
      Name: "John Doe",
      Title: "Software Engineer",
      Location: "New York",
      age: "35",
    },
    {
      Name: "Jane Smith",
      Title: "Data Analyst",
      Location: "San Francisco",
      age: "45",
    },
    {
      Name: "Michael Johnson",
      Title: "Product Manager",
      Location: "Los Angeles",
      age: "70",
    },
  ];
  const [data, setData] = useState([]);
  const [updatedRow, setUpdatedRow] = useState(null);

  useEffect(() => {
    const DataForTable = Data.map((item) => {
      return [item.Name, item.Title, item.Location, item.age];
    });
    setData(DataForTable);
  }, []);

  const handleCellEdit = (e, rowIndex, colIndex) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = e.target.value; // Update the Name field value
    setData(newData);
    setUpdatedRow(newData);
  };

  const handleSave = () => {
    const template = ["Name", "Title", "Location"];
    const updatedData = convertToArrayOfObjects(updatedRow, template);
    console.log("#######updatedData", updatedData);
  };
  function convertToArrayOfObjects(data, template) {
    return data.map((arr, index) => {
      const obj = {};
      arr.forEach((value, i) => {
        obj[template[i]] = value;
      });
      return obj;
    });
  }

  const columns = [
    {
      name: "Name",
      options: {
        customBodyRender: (value, tableMeta) => (
          <input
            type="text"
            value={value}
            onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 0)}
          />
        ),
      },
    },
    {
      name: "Title",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
                font: "-webkit-control",
              },
            }}
            id="title"
            name="title"
            value={value}
            onChange={(e) => {
              console.log("value########", value);
              handleCellEdit(e, tableMeta.rowIndex, 1);
            }}
          >
            <MenuItem value=""> {"Select Age"} </MenuItem>
            <MenuItem value="QA">QA</MenuItem>
            <MenuItem value="BA">BA</MenuItem>
            <MenuItem value="Software Engineer">Software Engineer</MenuItem>
            <MenuItem value="Data Analyst">Data Analyst</MenuItem>
            <MenuItem value="Product Manager">Product Manager</MenuItem>
          </Select>
        ),
      },
    },
    {
      name: "Location",
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
    {
      name: "Age",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
                font: "-webkit-control",
              },
            }}
            id="age"
            name="age"
            value={value}
            onChange={(e) => {
              handleCellEdit(e, tableMeta.rowIndex, 3);
            }}
          >
            <MenuItem value=""> {"Select Age"} </MenuItem>
            <MenuItem value="35">35</MenuItem>
            <MenuItem value="45">45</MenuItem>
            <MenuItem value="70">70</MenuItem>
            <MenuItem value="30-50">30-50</MenuItem>
            <MenuItem value="50 and above">50 and above</MenuItem>
          </Select>
        ),
      },
    },
  ];
  const options = {
    selectableRows: "none",
    responsive: "vertical",
  };

  return (
    <div>
      <MUIDataTable
        title={"Editable Table"}
        data={data}
        columns={columns}
        options={options}
      />
      <button
        onClick={() => {
          handleSave();
        }}
      >
        Save
      </button>
    </div>
  );
};

export default UnitCustomisation;
