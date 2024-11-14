// /api/dashboard/getcustomer

import { useState } from "react";
import api from "../../services/api";
import { useSelector } from "react-redux";

const useGetCampaignCustomerList = () => {
  const [tableData, setTableData] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [tableError, setTableError] = useState("");

  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);

  const getTableData = async (projectId, crmId) => {
    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      if (crmId && projectId) {
        formData.append("crmId", crmId);
        formData.append("projectId", projectId);
      } else if (projectId) {
        formData.append("projectId", projectId);
      } else if (crmId) {
        formData.append("crmId", crmId);
      }

      const path = `/api/dashboard/getcustomer`;
      setIsTableLoading(true);
      const response = await api.post(path, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTableData(response?.data[0]?.customerdata); // Set the response data
      return response?.data[0]?.customerdata; // Return the response for further use
    } catch (error) {
      console.error("Error fetching table data:", error);
      setTableError(error?.message);
    } finally {
      setIsTableLoading(false);
    }
  };

  return { getTableData, tableData, isTableLoading, tableError };
};

export default useGetCampaignCustomerList;
