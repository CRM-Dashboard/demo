import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";

const useGetUnitUploadDrawing = () => {
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tableData, setTableData] = useState([]);
  const getTableData = async (matnr, projectId, isUpload) => {
    try {
      const url = `${process.env.REACT_APP_SERVER_URL}/api/drawing/get-drawing-unit`;
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("matnr", matnr);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("upload_ind", isUpload ? "X" : "");
      setIsLoading(true);
      // Fetching the data as JSON
      const response = await api.post(url, formData, {
        responseType: "json", // Get JSON data
      });

      // Extract the relevant data from the response
      const unitDataArray = response.data.UNIT_S3; // Array of unit data

      // Process each unit data into an array of processed objects
      const processedData = unitDataArray.map((unitData) => {
        // Decode the binary file (assuming it's base64 encoded)
        const binaryData = atob(unitData.file); // Decode the base64 string
        const byteNumbers = new Uint8Array(binaryData.length);

        for (let i = 0; i < binaryData.length; i++) {
          byteNumbers[i] = binaryData.charCodeAt(i);
        }

        // Create Blob from the binary data
        const blob = new Blob([byteNumbers], { type: "application/pdf" }); // Create a Blob
        const fileUrl = URL.createObjectURL(blob); // Create a URL for the Blob

        return {
          name: unitData.name,
          type: unitData.type,
          matnr: unitData.matnr,
          maktx: unitData.maktx,
          building: unitData.building,
          unitNo: unitData.unitNo,
          floor: unitData.floor,
          project: unitData.project,
          s3Bucket: unitData.s3Bucket,
          url: unitData.url,
          fileUrl: fileUrl, // Add the Blob URL for download
          id: unitData.matnr,
        };
      });

      // If needed, store processed data in state
      setTableData(processedData); // Assuming setTableData is for storing additional data
    } catch (error) {
      setError(error.message);
      console.error("Error fetching files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { getTableData, tableData, isLoading, error };
};

export default useGetUnitUploadDrawing;
