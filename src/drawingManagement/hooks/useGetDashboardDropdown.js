import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";

const useGetDashboardDropdown = () => {
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);

  const [projectList, setProjectList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [stageList, setStageList] = useState([]);
  const [categoryList, setCatogoryList] = useState([]);
  const [isLoadingLists, setIsLoadingLists] = useState(true);
  const [listError, setListError] = useState("");

  const getDropdownList = async () => {
    try {
      const path = "/api/drawing/get-dropdown";
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      const res = (
        await api.post(path, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
      if (res && res[0]) {
        setProjectList(res[0]?.project);
        setLocationList(res[0]?.location);
        setCatogoryList(res[0]?.category);
        setStageList(res[0]?.stage);
      }
    } catch (error) {
      setListError(error?.message);
      console.log(error);
    } finally {
      setIsLoadingLists(false);
    }
  };

  useEffect(() => {
    getDropdownList();
  }, []);

  return {
    projectList,
    locationList,
    stageList,
    categoryList,
    isLoadingLists,
    listError,
  };
};
export default useGetDashboardDropdown;
