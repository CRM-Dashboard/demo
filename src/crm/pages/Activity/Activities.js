/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Updates from "./Updates";
import TreeTable from "./TreeTable";
import { Grid } from "@mui/material";
import ActivityDetails from "./ActivityDetails";
import CustomTabLayout from "../../components/tabs/CustomTabLayout";

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
