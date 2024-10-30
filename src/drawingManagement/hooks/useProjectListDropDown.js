import { useSelector } from "react-redux";
import api from "../../services/api";
import { useEffect, useState } from "react";

const useProjectListDropdown = () => {
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);
  const [projecList, setProjectList] = useState();
  const fetchProjects = async () => {
    try {
      const url = `/api/drawing/get-projectlist`;
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      const res = (await api.post(url, formData)).data;
      setProjectList(res?.ProjectList);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  return { projecList };
};

export default useProjectListDropdown;
