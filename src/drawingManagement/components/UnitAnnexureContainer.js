import React, { useMemo, useState, memo } from "react";
import UnitAnnexureAccordion from "./UnitAnnexureAccordion";
import { Button } from "@mui/material";
import withTable from "../../crm/components/TableFilter/withTable";
import TableFilter from "../../crm/components/TableFilter/TableFilter";
import Loading from "./Loading";
import useGetUnitUploadDrawing from "../hooks/useGetUnitUploadDrawing";
import { appendTextToPDF } from "../utils/helpFunctions";
import ErrorPage from "./ErrorPage";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import api from "../../services/api";
import { useSelector } from "react-redux";

const HOCTable = withTable(memo(TableFilter));

const UnitAnnexureContainer = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);
  //   const [role] = useState("admin");
  const [role] = useState("user");

  const { getTableData, tableData, isLoading, error } =
    useGetUnitUploadDrawing();

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
        Header: "maktx",
        accessor: "maktx",
      },
      //   matnr
      {
        Header: "matnr",
        accessor: "matnr",
      },
      {
        Header: "PDF",
        accessor: "url",
        Cell: ({ value }) => {
          console.log("value", value);
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

  const handleModifiedPdfUploadtToS3 = async () => {
    if (selectedItems && selectedItems.length > 0) {
      selectedItems.forEach(async (doc) => {
        const { fileUrl, unitNo, floor, project, building, name, type } = doc;

        let unitX = 870;
        let floorX = 780;
        let floorY = 90;
        let unitY = 740;

        console.log("doc", doc);

        const folderName = `${project}/${building}/${floor}/${unitNo}/${name}.${type}`;

        console.log("folderName", folderName);

        const publicUrl = await appendTextToPDF(
          fileUrl,
          "UNIT NO : " + unitNo,
          unitX,
          unitY,
          "FLOOR : " + floor,
          floorX,
          floorY,
          folderName,
          type
        );
        if (publicUrl) {
          const url = "/api/drawing/upload-url-sap";
          const formData = new FormData();
          formData.append("userName", userName);
          formData.append("passWord", passWord);
          formData.append("matnr", "4403500");
          formData.append("passUrl", publicUrl);
          const res = await api.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log(publicUrl, "publicUrl", res);
        }
      });
    }
  };

  if (error) {
    return <ErrorPage message={""} />;
  }

  const handleGetTableData = () => {
    // if (role === "admin") {
    getTableData("4403500", "", true);
    // }
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
          <Button
            variant="contained"
            disabled={isLoading}
            onClick={handleGetTableData}
            style={{
              padding: "10px 20px",
            }}
          >
            Get Table
          </Button>

          <Button
            onClick={handleModifiedPdfUploadtToS3}
            disabled={selectedItems?.length <= 0}
            variant="contained"
            style={{
              padding: "10px 20px",
              marginLeft: "10px", // Space between buttons
            }}
          >
            Upload PDF
          </Button>
        </div>
        {/* )} */}
        <UnitAnnexureAccordion />
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
