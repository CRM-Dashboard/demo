/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import Battery from "../../components/Battery/Battery";
import { Typography } from "@mui/material";
import CrmModal from "../../components/crmModal/CrmModal";
import { DateRangePicker } from "@maxstudener/react-mui-daterange-picker";
import moment from "moment";

// Important!!!!
// const TreeTable = ({ data }) => {
//   const [tableData, setTableData] = useState([]);

//   const renderExpandableRow = (rowData, rowMeta) => {
//     const item = data[rowMeta.dataIndex];

//     if (item.subdata && item.subdata.length > 0) {
//       return (
//         <tr key={`expandable-row-${item.ID}`}>
//           <td colSpan="5">
//             {" "}
//             {/* Adjust the colSpan according to the number of columns */}
//             <TreeTable data={item.subdata} />
//           </td>
//         </tr>
//       );
//     }
//   };

//   const options = {
//     expandableRows: true,
//     print: false,
//     download: false,
//     search: false,
//     filter: false,
//     viewColumns: false,
//     selectableRows: "none",
//     renderExpandableRow,
//   };

//   const columns = [
//     { name: "ID", label: "ID" },
//     { name: "Roll Number", label: "Roll Number" },
//     { name: "Name", label: "Name" },
//     { name: "Project", label: "Project" },
//   ];

//   useEffect(() => {
//     const DataForTable = data.map((item) => {
//       return [item.id, item.rollno, item.name, item.project];
//     });
//     setTableData(DataForTable);
//   }, []);

//   // const handleCellEdit = (newValue, rowIndex, columnIndex) => {
//   //   const updatedData = [...tableData];
//   //   updatedData[rowIndex][columnIndex] = newValue;
//   //   setTableData(updatedData);

//   //   // Send updated data to API
//   //   // Example: fetch('your-api-endpoint', { method: 'PUT', body: JSON.stringify(updatedData) });
//   // };

//   return (
//     <MUIDataTable
//       data={tableData}
//       columns={columns}
//       options={{
//         ...options,
//         // customBodyRender: (value, tableMeta, updateValue) => {
//         //   return (
//         //     <input
//         //       type="text"
//         //       value={value}
//         //       onChange={(e) =>
//         //         handleCellEdit(
//         //           e.target.value,
//         //           tableMeta.rowIndex,
//         //           tableMeta.columnIndex
//         //         )
//         //       }
//         //     />
//         //   );
//         // },
//       }}
//     />
//   );
// };

// const TreeTable = ({ data, secondIteration }) => {
//   const [tableData, setTableData] = useState([]);
//   const [dateRange, setDateRange] = useState("");
//   const [shouldShowDateRage, setShouldShowDateRage] = useState("");

//   const renderExpandableRow = (rowData, rowMeta) => {
//     const item = data[rowMeta.dataIndex];

//     if (item.subdata && item.subdata.length > 0) {
//       return (
//         <tr key={`expandable-row-${item.ID}`}>
//           <td colSpan="5">
//             {/* Adjust the colSpan according to the number of columns */}
//             <TreeTable data={item.subdata} secondIteration={"true"} />
//           </td>
//         </tr>
//       );
//     }
//   };

//   const options = {
//     expandableRows: true,
//     print: false,
//     download: false,
//     search: false,
//     filter: false,
//     viewColumns: false,
//     selectableRows: "none",
//     renderExpandableRow,
//     hideToolbar: true,
//     columnOptions: {
//       display: "false",
//     },
//   };

//   const columns = [
//     "ID",
//     "Roll Number",
//     "Name",
//     "Project",
//     "Success Ratio",
//     "Date Range",
//   ];

//   const childColumns = [{ name: "" }, { name: "" }, { name: "" }, { name: "" }];

//   useEffect(() => {
//     const DataForTable = data.map((item) => {
//       return [
//         item.id,
//         item.rollno,
//         item.name,
//         item.project,
//         <Battery percentage={item.percentage} />,
//         <Typography
//           onClick={() => {
//             setShouldShowDateRage(true);
//           }}
//         >
//           {dateRange ? dateRange : "Set"}
//         </Typography>,
//       ];
//     });
//     setTableData(DataForTable);
//   }, []);

//   return (
//     <>
//       {tableData.length > 0 && (
//         <MUIDataTable
//           data={tableData}
//           columns={
//             secondIteration === "true"
//               ? columns.map((column) => ({
//                   ...column.name,
//                   hideHeader: true, // Hides the header of each column
//                 }))
//               : columns
//           }
//           options={options}
//         />
//       )}

//       <CrmModal
//         maxWidth="md"
//         show={shouldShowDateRage}
//         handleShow={() => {
//           setShouldShowDateRage(false);
//         }}
//         primaryBtnText="Save"
//         primarySave={() => {
//           console.log(
//             "range.startDate########",
//             moment(dateRange.startDate).format("DD/MM/YYYY") +
//               "-" +
//               moment(dateRange.endDate).format("DD/MM/YYYY")
//           );
//           const finalRange =
//             moment(dateRange.startDate).format("DD/MM/YYYY") +
//             " - " +
//             moment(dateRange.endDate).format("DD/MM/YYYY");
//           setDateRange(finalRange);
//           setShouldShowDateRage(false);
//         }}
//       >
//         <DateRangePicker
//           onChange={(range) => {
//             console.log("######range", range);
//             setDateRange(range);
//           }}
//         />
//       </CrmModal>
//     </>
//   );
// };

const TreeTable = ({ data, secondIteration }) => {
  const [tableData, setTableData] = useState([]);
  const [dateRange, setDateRange] = useState("");
  const [shouldShowDateRange, setShouldShowDateRange] = useState("");

  const renderExpandableRow = (rowData, rowMeta) => {
    const item = data[rowMeta.dataIndex];

    if (item.subdata && item.subdata.length > 0) {
      return (
        <tr key={`expandable-row-${item.ID}`}>
          <td colSpan="5">
            <TreeTable data={item.subdata} secondIteration={"true"} />
          </td>
        </tr>
      );
    }
  };

  const options = {
    expandableRows: true,
    print: false,
    download: false,
    search: false,
    filter: false,
    viewColumns: false,
    selectableRows: "none",
    renderExpandableRow,
    hideToolbar: true,
    columnOptions: {
      display: "false",
    },
  };

  const columns = [
    "ID",
    "Roll Number",
    {
      name: "Name",
      options: {
        customBodyRender: (value, tableMeta) => (
          <input
            type="text"
            value={value}
            onChange={(e) => handleNameChange(e, tableMeta.rowIndex)}
          />
        ),
      },
    },
    "Project",
    "Success Ratio",
    "Date Range",
  ];

  useEffect(() => {
    const DataForTable = data.map((item) => {
      return [
        item.id,
        item.rollno,
        item.name,
        item.project,
        <Battery percentage={item.percentage} />,
        <Typography
          onClick={() => {
            setShouldShowDateRange(true);
          }}
        >
          {dateRange ? dateRange : "Set"}
        </Typography>,
      ];
    });
    setTableData(DataForTable);
  }, []);

  const handleNameChange = (e, rowIndex) => {
    const newData = [...tableData];
    newData[rowIndex][2] = e.target.value; // Update the Name field value
    setTableData(newData);
  };

  return (
    <>
      {tableData.length > 0 && (
        <MUIDataTable
          data={tableData}
          columns={
            secondIteration === "true"
              ? columns.map((column) => ({
                  ...column,
                  options: { ...(column.options || {}), hideHeader: true }, // Hides the header of each column
                }))
              : columns
          }
          options={options}
        />
      )}

      <CrmModal
        maxWidth="md"
        show={shouldShowDateRange}
        handleShow={() => {
          setShouldShowDateRange(false);
        }}
        primaryBtnText="Save"
        primarySave={() => {
          console.log(
            "range.startDate########",
            moment(dateRange.startDate).format("DD/MM/YYYY") +
              "-" +
              moment(dateRange.endDate).format("DD/MM/YYYY")
          );
          const finalRange =
            moment(dateRange.startDate).format("DD/MM/YYYY") +
            " - " +
            moment(dateRange.endDate).format("DD/MM/YYYY");
          setDateRange(finalRange);
          setShouldShowDateRange(false);
        }}
      >
        <DateRangePicker
          onChange={(range) => {
            console.log("######range", range);
            setDateRange(range);
          }}
        />
      </CrmModal>
    </>
  );
};

export default TreeTable;
