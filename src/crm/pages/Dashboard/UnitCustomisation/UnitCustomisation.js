/* eslint-disable array-callback-return */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-sparse-arrays */
// // TableComponent.js
// import React, { useState, useEffect } from "react";
// import AddIcon from "@mui/icons-material/Add";
// import MUIDataTable from "mui-datatables";
// import { MenuItem, IconButton } from "@mui/material";
// import { Select, Button } from "@mui/material";
// import LabelWithCheckbox from "../../../components/labelWithCheckBox/LabelWithCheckBox";

// const UnitCustomisation = () => {
//   const Data = [
//     {
//       Name: "John Doe",
//       Title: "Software Engineer",
//       Location: "New York",
//       age: "35",
//     },
//     {
//       Name: "Jane Smith",
//       Title: "Data Analyst",
//       Location: "San Francisco",
//       age: "45",
//     },
//     {
//       Name: "Michael Johnson",
//       Title: "Product Manager",
//       Location: "Los Angeles",
//       age: "70",
//     },
//   ];
//   const [data, setData] = useState([]);
//   const [updatedRow, setUpdatedRow] = useState(null);

//   useEffect(() => {
//     const DataForTable = Data.map((item) => {
//       return [item.Name, item.Title, item.Location, item.age];
//     });
//     setData(DataForTable);
//   }, []);

//   const handleAddRow = () => {
//     const newRow = ["", "", "", ""];
//     setData([...data, newRow]);
//   };

//   const handleCellEdit = (e, rowIndex, colIndex) => {
//     const newData = [...data];
//     newData[rowIndex][colIndex] = e.target.value; // Update the Name field value
//     setData(newData);
//     setUpdatedRow(newData);
//   };

//   const handleSave = () => {
//     const template = ["Name", "Title", "Location"];
//     const updatedData = convertToArrayOfObjects(updatedRow, template);
//     console.log("#######updatedData", updatedData);
//   };

//   function convertToArrayOfObjects(data, template) {
//     return data.map((arr, index) => {
//       const obj = {};
//       arr.forEach((value, i) => {
//         obj[template[i]] = value;
//       });
//       return obj;
//     });
//   }

//   const handleDeleteRow = (e) => {
//     console.log("selectedRows######and Event", e);
//     const rowsToDelete = data.map((row) => row.index);
//     const newData = data.filter((_, index) => !rowsToDelete.includes(index));
//     setData(newData);

//     console.log("updated data##########", data);
//   };

//   const columns = [
//     {
//       options: {
//         customBodyRenderLite: (rowIndex) =>
//           data.length > 0 && [
//             <IconButton
//               color="primary"
//               size="small"
//               id={rowIndex[0]}
//               onClick={(e) => {
//                 console.log("#######e", e.target.value);
//               }}
//             >
//               <LabelWithCheckbox />
//             </IconButton>,
//           ],
//       },
//     },
//     {
//       name: "Category",
//       options: {
//         customBodyRender: (value, tableMeta) => (
//           <input
//             type="text"
//             value={value}
//             onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 0)}
//           />
//         ),
//       },
//     },
//     {
//       name: "Location",
//       options: {
//         customBodyRender: (value, tableMeta) => (
//           <Select
//             sx={{
//               "& .MuiOutlinedInput-input": {
//                 padding: "4.5px 14px",
//                 font: "-webkit-control",
//               },
//             }}
//             id="title"
//             name="title"
//             value={value}
//             onChange={(e) => {
//               console.log("value########", value);
//               handleCellEdit(e, tableMeta.rowIndex, 1);
//             }}
//           >
//             <MenuItem value=""> {"Select Age"} </MenuItem>
//             <MenuItem value="QA">QA</MenuItem>
//             <MenuItem value="BA">BA</MenuItem>
//             <MenuItem value="Software Engineer">Software Engineer</MenuItem>
//             <MenuItem value="Data Analyst">Data Analyst</MenuItem>
//             <MenuItem value="Product Manager">Product Manager</MenuItem>
//           </Select>
//         ),
//       },
//     },
//     {
//       name: "Customisation Description",
//       options: {
//         customBodyRender: (value, tableMeta) => (
//           <input
//             type="text"
//             value={value}
//             onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 2)}
//           />
//         ),
//       },
//     },
//     {
//       name: "Feasible",
//       options: {
//         customBodyRender: (value, tableMeta) => (
//           <Select
//             sx={{
//               "& .MuiOutlinedInput-input": {
//                 padding: "4.5px 14px",
//                 font: "-webkit-control",
//               },
//             }}
//             id="age"
//             name="age"
//             value={value}
//             onChange={(e) => {
//               handleCellEdit(e, tableMeta.rowIndex, 3);
//             }}
//           >
//             <MenuItem value=""> {"Select Age"} </MenuItem>
//             <MenuItem value="35">35</MenuItem>
//             <MenuItem value="45">45</MenuItem>
//             <MenuItem value="70">70</MenuItem>
//             <MenuItem value="30-50">30-50</MenuItem>
//             <MenuItem value="50 and above">50 and above</MenuItem>
//           </Select>
//         ),
//       },
//     },
//     { name: "Customer Approval" },
//     { name: "Rejection Reason" },
//   ];

//   const options = {
//     selectableRows: "none",
//     responsive: "vertical",
//     customToolbar: () => [
//       <Button
//         variant="contained"
//         disableElevation
//         disableFocusRipple
//         size="small"
//         onClick={() => {
//           handleAddRow();
//         }}
//         sx={{
//           "&.MuiButton-root": {
//             textTransform: "none",
//             backgroundColor: "#228B22",
//           },
//         }}
//         // disabled={!orderId}
//       >
//         <AddIcon style={{ marginRight: "0.4em" }} />
//         Add New Row
//       </Button>,
//       <Button
//         variant="contained"
//         disableElevation
//         disableFocusRipple
//         size="small"
//         onClick={() => {
//           handleSave();
//         }}
//         sx={{
//           "&.MuiButton-root": {
//             textTransform: "none",
//             backgroundColor: "#228B22",
//           },
//           marginLeft: "1em",
//           paddingLeft: "1em",
//         }}
//         // disabled={!orderId}
//       >
//         Save{" "}
//       </Button>,
//       <Button
//         key="delete-row-button"
//         variant="contained"
//         disableElevation
//         disableFocusRipple
//         size="small"
//         onClick={(e) => handleDeleteRow(e)}
//         sx={{
//           "&.MuiButton-root": {
//             textTransform: "none",
//             backgroundColor: "#FF0000",
//           },
//           marginLeft: "1em",
//           paddingLeft: "1em",
//         }}
//       >
//         Delete Selected Row
//       </Button>,
//     ],
//   };

//   return (
//     <>
//       <div style={{ marginTop: "1em" }}>
//         <MUIDataTable
//           title={"Editable Table"}
//           data={data}
//           columns={columns}
//           options={options}
//         />
//       </div>
//     </>
//   );
// };

// export default UnitCustomisation;
// -----------------------------------------------

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-sparse-arrays */
import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import MUIDataTable from "mui-datatables";
import { MenuItem } from "@mui/material";
import { Select, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const DataForTable = Data.map((item) => {
      return [item.Name, item.Title, item.Location, item.age];
    });
    setData(DataForTable);
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

  const handleSave = () => {
    const template = ["Name", "Title", "Location"];
    const updatedData = convertToArrayOfObjects(data, template);
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

  const handleSetRows = (currentRowsSelected) => {
    //set rows to delete here
    console.log("currentRowsSelected#############", currentRowsSelected);
    setSelectedRows(currentRowsSelected);
    // const newData = data.filter((_, index) => !currentRowsSelected.includes(index));
    // setData(newData);
    // setSelectedRows([]);
  };

  const handleDeleteRow = (setRows) => {
    // Add your custom delete logic here
    console.log("Custom delete function invoked!");
    const indices = selectedRows.map((obj) => obj.dataIndex);

    // Filter out rows whose indices are not present in the indices array
    const newData = data.filter((_, index) => !indices.includes(index));

    console.log("#######newData", newData);
    setData(newData);
    setRows([]);
    setSelectedRows([]);
    // /handleSetRows();
  };

  const columns = [
    {
      name: "Category",
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
            id="title"
            name="title"
            value={value}
            onChange={(e) => {
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
      name: "Customisation Description",
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
      name: "Feasible",
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
    { name: "Customer Approval" },
    { name: "Rejection Reason" },
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

  const handleRowSelect = (rowIndex) => {
    const newSelectedRows = [...selectedRows];
    const index = newSelectedRows.indexOf(rowIndex);
    if (index === -1) {
      newSelectedRows.push(rowIndex);
    } else {
      newSelectedRows.splice(index, 1);
    }
    setSelectedRows(newSelectedRows);
  };

  return (
    <>
      <div style={{ marginTop: "1em" }}>
        <MUIDataTable
          title={"Editable Table"}
          data={data}
          columns={columns}
          options={options}
        />
      </div>
    </>
  );
};

export default UnitCustomisation;
