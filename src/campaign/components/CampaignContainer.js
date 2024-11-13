import React, { memo, useState, useCallback, useMemo } from "react";
import { Button, Grid } from "@mui/material";
import CampaignAccordion from "./CampaignAccordion";
import withTable from "../../crm/components/TableFilter/withTable";
import TableFilter from "../../crm/components/TableFilter/TableFilter";
import useProjectListDropdown from "../../drawingManagement/hooks/useProjectListDropDown";
import useCampaignCustomers from "../hooks/useCampaignCustomers";
import ErrorPage from "../../drawingManagement/components/ErrorPage";
import { useNavigate } from "react-router-dom";
const HOCTable = withTable(memo(TableFilter));

const CampaignContainer = () => {
  const [selectedProjects, setSelectedProjects] = useState("");
  const [selectedCrm, setSelectedCrm] = useState("");
  const { projecList } = useProjectListDropdown();
  const { getTableData, tableData, isLoading, error } = useCampaignCustomers();
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        Header: "Customer Name",
        accessor: "customerName",
      },
      {
        Header: "State",
        accessor: "State",
      },
      {
        Header: "Country",
        accessor: "Country",
      },
      {
        Header: "BirthDay",
        accessor: "DOB",
      },
      {
        Header: "Age",
        accessor: "Age",
      },
      {
        Header: "Occupation",
        accessor: "Occupation",
      },
      {
        Header: "Designation",
        accessor: "Designation",
      },
      {
        Header: "Company",
        accessor: "Company",
      },
      {
        Header: "Gender",
        accessor: "Gender",
      },
      {
        Header: "city",
        accessor: "city",
      },
      {
        Header: "Mobile",
        accessor: "Mobile",
      },
    ],
    []
  );
  const memoizedData = useMemo(() => tableData, [tableData]);

  const handleProjectSelection = useCallback((event) => {
    const value = event.target.value;
    setSelectedProjects(typeof value === "string" ? value.split(",") : value);
  }, []);

  const handleCrmSelection = useCallback((event) => {
    const value = event.target.value;
    setSelectedCrm(typeof value === "string" ? value.split(",") : value);
  }, []);

  const handleGetTableData = () => {
    // Use the first selected unit or an empty string
    const project = selectedProjects[0] || ""; // Use the first selected project or an empty string

    if (selectedProjects.length > 0) {
      getTableData(project, ""); // Call with both parameters
    }
    // } else if (selectedUnit.length > 0) {
    //   getTableData(unit, "", true); // Call with only unit
    // } else if (selectedProjects.length > 0) {
    //   getTableData("", project, true); // Call with only project
    // }
  };

  if (error) {
    return <ErrorPage message={""} />;
  }
  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          navigate("survey/3");
        }}
      >
        Survey
      </Button>
      <Grid container gap={4}>
        <Grid item md={12} sm={12} xl={12} xs={12}>
          <CampaignAccordion
            projectData={projecList || []}
            selectedProjects={selectedProjects}
            handleProjectSelection={handleProjectSelection}
            crmData={[]}
            selectedCrm={selectedCrm}
            handleCrmSelection={handleCrmSelection}
            getTableData={handleGetTableData}
            loading={isLoading}
          />
        </Grid>
        <Grid item md={12} sm={12} xl={12} xs={12}>
          {false ? (
            //   <Loading message={"Drawing is Loading..."} />
            "sdjsj"
          ) : (
            <HOCTable
              columns={columns}
              data={memoizedData || []}
              pageSize={100}
              // select={role === "admin" ? true : false}
              select={false}
              editable={false}
              showFilter={false}
              pagination={true}
              // setSelectedItems={setSelectedItems}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default CampaignContainer;
