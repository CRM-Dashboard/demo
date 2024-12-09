import React, { useMemo, useState, memo, useCallback, useEffect } from "react";
import UnitAnnexureAccordion from "./UnitAnnexureAccordion";
import withTable from "../../crm/components/TableFilter/withTable";
import TableFilter from "../../crm/components/TableFilter/TableFilter";
import Loading from "./Loading";
import useGetUnitUploadDrawing from "../hooks/useGetUnitUploadDrawing";
import { appendTextToPDF } from "../utils/helpFunctions";
import ErrorPage from "./ErrorPage";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import usePostUploadUrlToSap from "../hooks/usePostUploadUrlToSap";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import LoadingButton from "@mui/lab/LoadingButton";
import useProjectListDropdown from "../hooks/useProjectListDropDown";
import useUnitListDropDown from "../hooks/useUnitListDropDown";
const HOCTable = withTable(memo(TableFilter));

const UnitAnnexureContainer = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  //   const [role] = useState("admin");
  const [role] = useState("user");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  const { projecList } = useProjectListDropdown();
  const { unitList, fetchUnit } = useUnitListDropDown();
  const { getTableData, tableData, isLoading, error } =
    useGetUnitUploadDrawing();
  const { postToSap } = usePostUploadUrlToSap();
  const snackbar = UseCustomSnackbar();

  useEffect(() => {
    if (selectedProjects) {
      fetchUnit(selectedProjects);
    }
  }, [selectedProjects]);

  const handleProjectSelection = useCallback((event) => {
    const value = event.target.value;
    setSelectedProjects(typeof value === "string" ? value.split(",") : value);
  }, []);

  const handleUnitSelection = useCallback((event) => {
    const value = event.target.value;
    setSelectedUnit(typeof value === "string" ? value.split(",") : value);
  }, []);

  const column = useMemo(
    () => [
      {
        Header: "Building",
        accessor: "building",
      },
      {
        Header: "Floor",
        accessor: "floor",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "UnitNo",
        accessor: "unitNo",
      },
      //   maktx
      {
        Header: "maktx",
        accessor: "maktx",
      },
      //   matnr
      {
        Header: "matnr",
        accessor: "matnr",
      },
    ],
    []
  );

  const showPdfColumn = useMemo(
    () => [
      {
        Header: "Building",
        accessor: "building",
      },
      {
        Header: "Floor",
        accessor: "floor",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "UnitNo",
        accessor: "unitNo",
      },
      //   maktx
      {
        Header: "Project/Unit",
        accessor: "maktx",
      },
      //   matnr
      // {
      //   Header: "matnr",
      //   accessor: "matnr",
      // },
      {
        Header: "PDF",
        accessor: "url",
        Cell: ({ value }) => {
          if (!value) {
            return <span>No PDF Available ,Please upload </span>;
          }

          return (
            <a href={value} target="_blank" rel="noreferrer">
              <PictureAsPdfIcon />
            </a>
          );
        },
      },
    ],
    []
  );

  const memoizedData = useMemo(() => tableData, [tableData]);

  console.log("memoizedData", memoizedData);

  const handleModifiedPdfUploadToS3 = async () => {
    if (!selectedItems || selectedItems.length === 0) {
      return; // Early exit if there are no selected items
    }

    setIsUploading(true); // Start uploading before processing

    try {
      // Create an array of promises for all uploads
      const uploadPromises = selectedItems.map(async (doc) => {
        const { fileUrl, unitNo, floor, project, building, name, type, matnr } =
          doc;

        const unitX = 870;
        const floorX = 780;
        const floorY = 90;
        const unitY = 740;

        const folderName = `${project}/${building}/${floor}/${unitNo}/${name}.${type}`;

        const resp = await appendTextToPDF(
          fileUrl,
          "UNIT NO : " + unitNo,
          unitX,
          unitY,
          "FLOOR : " + floor,
          floorX,
          floorY,
          folderName,
          matnr
        );

        const { publicUrl, matnr: parseMatnr } = resp;

        if (publicUrl) {
          const res = await postToSap(parseMatnr, publicUrl);
          if (res.MESSAGE) {
            snackbar.showSuccess(res.MESSAGE);
          }
        }
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
    } catch (error) {
      snackbar.showError("Error Occurred...");
    } finally {
      setIsUploading(false); // Stop uploading in all scenarios

      setSelectedItems([]);
    }
  };

  if (error) {
    return <ErrorPage message={""} />;
  }

  const handleGetTableData = () => {
    const unit = selectedUnit[0] || ""; // Use the first selected unit or an empty string
    const project = selectedProjects[0] || ""; // Use the first selected project or an empty string
    setSelectedItems([]);

    if (selectedProjects.length > 0 && selectedUnit.length > 0) {
      getTableData(unit, project, true); // Call with both parameters
    } else if (selectedUnit.length > 0) {
      getTableData(unit, "", true); // Call with only unit
    } else if (selectedProjects.length > 0) {
      getTableData("", project, true); // Call with only project
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column", // Column layout for content
          height: "100vh", // Full height of the viewport
          padding: "5px", // Padding around the content
          boxSizing: "border-box", // Include padding in the total width and height
        }}
      >
        {/* {role === "admin" && ( */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end", // Align buttons to the right
            marginBottom: "5px", // Space below the buttons
            marginTop: 0,
            paddingTop: 0,
          }}
        >
          <LoadingButton
            onClick={handleModifiedPdfUploadToS3}
            loading={isUploading}
            disabled={selectedItems?.length <= 0 || isUploading || isLoading}
            loadingPosition="start" // Position of loading spinner ('start', 'center', 'end')
            startIcon={<FileUploadIcon />}
            variant="contained"
            // loadingIndicator="Uploading..."
            style={{
              padding: "10px 20px",
              marginLeft: "10px", // Space between buttons
            }}
          >
            Upload PDF
          </LoadingButton>
        </div>
        {/* )} */}
        <UnitAnnexureAccordion
          projectData={projecList || []}
          selectedProjects={selectedProjects}
          handleProjectSelection={handleProjectSelection}
          unitData={unitList || []}
          selectedUnit={selectedUnit}
          handleUnitSelection={handleUnitSelection}
          getTableData={handleGetTableData}
          isUploading={isUploading}
          loading={isLoading}
        />
        {/* Conditional rendering for loading state */}
        {isLoading ? (
          <Loading message={"Drawing is Loading..."} />
        ) : (
          <HOCTable
            columns={role === "admin" ? column : showPdfColumn}
            data={memoizedData || []}
            pageSize={100}
            // select={role === "admin" ? true : false}
            select={true}
            editable={false}
            showFilter={true}
            pagination={true}
            setSelectedItems={setSelectedItems}
          />
        )}
      </div>
    </>
  );
};

export default UnitAnnexureContainer;
