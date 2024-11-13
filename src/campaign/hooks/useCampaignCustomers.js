import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";

const useCampaignCustomers = () => {
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tableData, setTableData] = useState([]);
  const getTableData = async (crmId, projectId) => {
    try {
      const url = `${process.env.REACT_APP_SERVER_URL}/api/drawing/get-drawing-unit`;
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("crmId", crmId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      setIsLoading(true);
      // Fetching the data as JSON
      const response = (
        await api.post(url, formData, {
          responseType: "json", // Get JSON data
        })
      ).data;

      setTableData(response); // Assuming setTableData is for storing additional data
    } catch (error) {
      setError(error.message);
      console.error("Error fetching files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { getTableData, tableData, isLoading, error };
};

export default useCampaignCustomers;
