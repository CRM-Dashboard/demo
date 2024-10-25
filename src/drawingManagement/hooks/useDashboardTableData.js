// src/hooks/useTableData.js

import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";

const useDashboardTableData = () => {
  const [tableData, setTableData] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [tableError, setTableError] = useState("");

  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);

  const getTableData = async (
    selectedProjects,
    selectedLocations,
    selectedCategories,
    selectedStages
  ) => {
    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      if (selectedProjects?.length) {
        formData.append("projectId", selectedProjects[0]);
      }
      if (selectedLocations?.length) {
        formData.append("locationId", selectedLocations[0]);
      }
      if (selectedCategories?.length) {
        formData.append("categId", selectedCategories[0]);
      }
      if (selectedStages?.length) {
        formData.append("stageId", selectedStages[0]);
      }

      const path = `/api/drawing/get-drawing-list`;
      setIsTableLoading(true);
      const response = await api.post(path, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTableData(response.data); // Set the response data
      return response.data; // Return the response for further use
    } catch (error) {
      console.error("Error fetching table data:", error);
      setTableError(error?.message);
    } finally {
      setIsTableLoading(false);
    }
  };

  return { getTableData, tableData, isTableLoading, tableError };
};

export default useDashboardTableData;
