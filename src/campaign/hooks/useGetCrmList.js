import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";
const useGetCrmList = () => {
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);
  const [isLoading, setIsLoading] = useState(true);
  const [crmList, setCrmList] = useState([]);
  const [error, setError] = useState("");
  const getCrmList = async () => {
    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      const url = `/api/dashboard/getCrmManager`;
      const res = (await api.post(url, formData)).data;
      setCrmList(res);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCrmList();
  }, []);

  return { isLoading, error, crmList };
};

export default useGetCrmList;
