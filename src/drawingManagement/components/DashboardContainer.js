import React, { useState, useCallback, memo, useMemo } from "react";
import useGetDashboardDropdown from "../hooks/useGetDashboardDropdown";
import DashboardAccordion from "./DashboardAccordion";
import useDashboardTableData from "../hooks/useDashboardTableData";
import withTable from "../../crm/components/TableFilter/withTable";
import TableFilter from "../../crm/components/TableFilter/TableFilter";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import ErrorPage from "./ErrorPage";
import { useDispatch } from "react-redux";
import { setSelectedDrawing } from "./drawingDashboardActions";

const HOCTable = withTable(memo(TableFilter));
const generatePath = (drawUid) => `details/${drawUid}`;

const DashboardContainer = () => {
  const {
    projectList,
    categoryList,
    locationList,
    stageList,
    isLoadingLists,
    listError,
  } = useGetDashboardDropdown();

  const { getTableData, isTableLoading, tableData, tableError } =
    useDashboardTableData();
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedCatogoreis, setSelectedCatogoreis] = useState([]);
  const [selectedStages, setSelectedStages] = useState([]);
  const dispatch = useDispatch();

  const memoizedData = useMemo(() => tableData, [tableData]);

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "drawUid",
        Cell: ({ value, row }) => {
          const path = generatePath(value);
          return (
            <Link
              to={path}
              style={{
                display: "block",
                cursor: "pointer",
                width: "100%",
                height: "100%",
                textDecoration: "none",
                color: "inherit",
              }}
              onClick={() => dispatch(setSelectedDrawing(row?.original))}
            >
              {value}
            </Link>
          );
        },
      },
      {
        Header: "Draw No",
        accessor: "drawNo",
      },

      {
        Header: "Drawing",
        accessor: "drawTxt",
      },
      {
        Header: "Building",
        accessor: "building",
      },
      {
        Header: "Name",
        accessor: "name1",
      },

      {
        Header: "Version",
        accessor: "version",
      },
      {
        Header: "Category",
        accessor: "categ",
      },
      {
        Header: "Stage",
        accessor: "stage",
      },
      {
        Header: "Planned Date",
        accessor: "tedat",
      },
      {
        Header: "Uploaded Date",
        accessor: "uploadDt",
      },
      {
        Header: "Remarks",
        accessor: "remarks",
      },
    ],
    []
  );

  const handleProjectSelection = useCallback((event) => {
    const value = event.target.value;
    setSelectedProjects(typeof value === "string" ? value.split(",") : value);
  }, []);
  const handleLocationSelection = useCallback((event) => {
    const value = event.target.value;
    setSelectedLocations(typeof value === "string" ? value.split(",") : value);
  }, []);
  const handleCategorySelection = useCallback((event) => {
    const value = event.target.value;
    setSelectedCatogoreis(typeof value === "string" ? value.split(",") : value);
  }, []);

  const handleStageSelection = useCallback((event) => {
    const value = event.target.value;
    setSelectedStages(typeof value === "string" ? value.split(",") : value);
  }, []);

  const fetchTableData = useCallback(() => {
    getTableData(
      selectedProjects,
      selectedLocations,
      selectedCatogoreis,
      selectedStages
    );
  }, [
    getTableData,
    selectedProjects,
    selectedLocations,
    selectedCatogoreis,
    selectedStages,
  ]);

  if (listError) {
    return <ErrorPage message={""} />;
  }
  if (tableError) {
    return <ErrorPage message={""} />;
  }

  return (
    <div>
      {isLoadingLists ? (
        <Loading />
      ) : (
        <DashboardAccordion
          projectList={projectList}
          selectedProjects={selectedProjects}
          handleProjectSelection={handleProjectSelection}
          locationList={locationList}
          selectedLocations={selectedLocations}
          handleLocationSelection={handleLocationSelection}
          categoryList={categoryList}
          selectedCatogoreis={selectedCatogoreis}
          handleCategorySelection={handleCategorySelection}
          stageList={stageList}
          selectedStages={selectedStages}
          handleStageSelection={handleStageSelection}
          getTableData={fetchTableData}
        />
      )}

      {!isLoadingLists && isTableLoading ? (
        <Loading message={"Drawing is Loading..."} />
      ) : (
        <HOCTable
          columns={columns}
          data={memoizedData || []}
          pageSize={100}
          select={false}
          editable={false}
          showFilter={true}
          pagination={true}
        />
      )}
    </div>
  );
};

export default DashboardContainer;
