/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Updates from "./Updates";
import ActivityDetails from "./ActivityDetails";
import TreeTable from "./TreeTable";
import CustomTabLayout from "../../components/tabs/CustomTabLayout";
import { Grid } from "@mui/material";

// const summaryData = [
//   {
//     ID: "1",
//     Name: "Order 1",
//     units: "1395",
//     unitPrice: "47.00",
//     price: 65565,
//     category: "Seafoods",
//     subtask: [
//       {
//         ID: "1.1",
//         Name: "Mackerel",
//         category: "Frozen seafood",
//         units: "235",
//         unitPrice: "12.26",
//         price: 2881.1,
//         subtask: [
//           {
//             ID: "1.1.1",
//             Name: "Mackerel",
//             category: "Frozen seafood",
//             units: "235",
//             unitPrice: "12.26",
//             price: 2881.1,
//           },
//           {
//             ID: "1.1.2",
//             Name: "Yellowfin Tuna",
//             category: "Frozen seafood",
//             units: "324",
//             unitPrice: "18.45",
//             price: 5977.8,
//           },
//         ],
//       },
//       {
//         ID: "1.2",
//         Name: "Yellowfin Tuna",
//         category: "Frozen seafood",
//         units: "324",
//         unitPrice: "18.45",
//         price: 5977.8,
//       },
//       {
//         ID: "1.3",
//         Name: "Herrings",
//         category: "Frozen seafood",
//         units: "488",
//         unitPrice: "11.45",
//         price: 5587.6,
//       },
//       {
//         ID: "1.4",
//         Name: "Preserved Olives",
//         category: "Edible",
//         units: "125",
//         unitPrice: "19.56",
//         price: 2445,
//       },
//       {
//         ID: "1.5",
//         Name: "Sweet corn Frozen",
//         category: "Edible",
//         units: "223",
//         unitPrice: "12.34",
//         price: 2751.82,
//       },
//     ],
//   },
//   {
//     ID: "2",
//     Name: "Order 2",
//     units: "1944",
//     unitPrice: "58.45",
//     price: 1245.73,
//     category: "Products",
//     subtask: [
//       {
//         ID: "2.1",
//         Name: "Tilapias",
//         category: "Frozen seafood",
//         units: "278",
//         unitPrice: "15.45",
//         price: 4295.1,
//       },
//       {
//         ID: "2.2",
//         Name: "White Shrimp",
//         category: "Frozen seafood",
//         units: "560",
//         unitPrice: "17.66",
//         price: 9889.6,
//       },
//       {
//         ID: "2.3",
//         Name: "Fresh Cheese",
//         category: "Dairy",
//         units: "323",
//         unitPrice: "12.35",
//         price: 3989,
//       },
//       {
//         ID: "2.4",
//         Name: "Blue Veined Cheese",
//         category: "Dairy",
//         units: "370",
//         unitPrice: "15.77",
//         price: 5834.9,
//       },
//       {
//         ID: "2.5",
//         Name: "Butter",
//         category: "Dairy",
//         units: "413",
//         unitPrice: "19.45",
//         price: 8032.85,
//       },
//     ],
//   },
//   {
//     ID: "3",
//     Name: "Order 3",
//     units: "1120",
//     unitPrice: "33.45",
//     price: 37464,
//     category: "Crystals",
//     subtask: [
//       {
//         ID: "3.1",
//         Name: "Lead glassware",
//         category: "Solid crystals",
//         units: "542",
//         unitPrice: "19.56",
//         price: 10601.52,
//       },
//       {
//         ID: "3.2",
//         Name: "Pharmaceutical Glassware",
//         category: "Solid crystals",
//         units: "324",
//         unitPrice: "11.36",
//         price: 3680.64,
//         subtask: [
//           {
//             ID: "2.1",
//             Name: "Tilapias",
//             category: "Frozen seafood",
//             units: "278",
//             unitPrice: "15.45",
//             price: 4295.1,
//           },
//           {
//             ID: "2.2",
//             Name: "White Shrimp",
//             category: "Frozen seafood",
//             units: "560",
//             unitPrice: "17.66",
//             price: 9889.6,
//           },
//           {
//             ID: "2.3",
//             Name: "Fresh Cheese",
//             category: "Dairy",
//             units: "323",
//             unitPrice: "12.35",
//             price: 3989,
//           },
//           {
//             ID: "2.4",
//             Name: "Blue Veined Cheese",
//             category: "Dairy",
//             units: "370",
//             unitPrice: "15.77",
//             price: 5834.9,
//           },
//         ],
//       },
//       {
//         ID: "3.3",
//         Name: "Glass beads",
//         category: "Solid crystals",
//         units: "254",
//         unitPrice: "16.11",
//         price: 4091.94,
//       },
//     ],
//   },
// ];

const treedata = [
  {
    id: "1",
    rollno: "6253",
    name: "RIOJ1A",
    project: "Construction-IOJ Tower 1A",
    percentage: "50",
  },
  {
    id: "2",
    rollno: "6254",
    name: "RIOJ1AEAR",
    project: " Earthwork",
    percentage: "60",
  },
  {
    id: "3",
    rollno: "6255",
    name: "RIOJ1AEAREXC",
    project: "Mass Excavation",
    percentage: "30",
  },
  {
    id: "3",
    rollno: "6256",
    name: "RIOJ1AEARBFL",
    project: "Backfilling",
    percentage: "40",
  },
  {
    id: "3",
    rollno: "6257",
    name: "RIOJ1AEARCAR",
    project: "Pit Excavation",
    percentage: "50",
  },
  {
    id: "3",
    rollno: "6258",
    name: "RIOJ1AEARCAR",
    project: "Rubble Soling",
    percentage: "60",
  },
  {
    id: "3",
    rollno: "6259",
    name: "RIOJ1AEARANT",
    project: "Anti Termite Work",
    percentage: "70",
  },
  {
    id: "3",
    rollno: "6261",
    name: "RIOJ1AEARDEW",
    project: "Dewatering Work",
    percentage: "80",
  },
  {
    id: "3",
    rollno: "6262",
    name: "RIOJ1AEARPRO",
    project: "Provisional Sum",
    percentage: "90",
  },
  {
    id: "2",
    rollno: "6263",
    name: "RIOJ1AFND",
    project: "Foundation",
    percentage: "100",
  },
  {
    id: "2",
    rollno: "6264",
    name: "RIOJ1AFND",
    project: "Foundation",
    percentage: "10",
  },
  {
    id: "3",
    rollno: "6265",
    name: "RIOJ1AEARDEW",
    project: "Dewatering Work",
    percentage: "10",
  },
  {
    id: "3",
    rollno: "6266",
    name: "RIOJ1AEARPRO",
    project: "Provisional Sum",
    percentage: "10",
  },
  {
    id: "3",
    rollno: "6267",
    name: "RIOJ1AEARDEW",
    project: "Dewatering Work",
    percentage: "10",
  },
  {
    id: "3",
    rollno: "6268",
    name: "RIOJ1AEARPRO",
    project: "Provisional Sum",
    percentage: "10",
  },
  {
    id: "3",
    rollno: "6269",
    name: "RIOJ1AEARDEW",
    project: "Dewatering Work",
    percentage: "10",
  },
  {
    id: "4",
    rollno: "6270",
    name: "RIOJ1AEARDEW",
    project: "Dewatering Work",
    percentage: "10",
  },
  {
    id: "4",
    rollno: "6271",
    name: "RIOJ1AEARDEW",
    project: "Dewatering Work",
    percentage: "10",
  },
  {
    id: "3",
    rollno: "6272",
    name: "RIOJ1AEARPRO",
    project: "Provisional Sum",
    percentage: "10",
  },
  {
    id: "2",
    rollno: "6273",
    name: "RIOJ1AFND",
    project: "Foundation",
    percentage: "10",
  },
];

export default function Activities() {
  const [data, setTableData] = useState("");

  const dfs = (data, parentId) => {
    const result = [];
    let i = 0;
    while (i < data.length && data[i].id > parentId) {
      if (data[i].id === String(Number(parentId) + 1)) {
        const obj = data[i];
        const subdata = dfs(data.slice(i + 1), obj.id);
        if (subdata.length > 0) {
          obj.subdata = subdata;
        }
        result.push(obj);
        i++;
      } else {
        i++;
      }
    }
    return result;
  };
  useEffect(() => {
    const output = dfs(treedata, "0");
    // const dataToSave = JSON.stringify(output, null, 2);
    console.log("dataToSave##########", output);
    console.log(JSON.stringify(output, null, 2));
    setTableData(output);
  }, []);

  const tabs = [
    {
      label: "Activity",
      component: <ActivityDetails />,
    },
    {
      label: "Updates",
      component: <Updates />,
    },
    {
      label: "Hierarchy Table",
      component: (
        <Grid sx={{ marginTop: "2em" }}>
          <TreeTable data={data} secondIteration={false} />
        </Grid>
      ),
    },
  ];

  return <CustomTabLayout tabPanels={tabs} />;
}
