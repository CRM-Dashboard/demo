import { useSelector } from "react-redux";
import api from "../../services/api";
import { useState } from "react";

const useUnitListDropDown = () => {
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);
  const [unitList, setUnitList] = useState();
  const fetchUnit = async (projectId) => {
    try {
      const url = `/api/drawing/get-unitlist`;
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("werks", projectId);
      const res = (await api.post(url, formData)).data;
      setUnitList(res?.UnitList);
    } catch (error) {
      console.log(error);
    }
  };

  return { unitList, fetchUnit };
};

export default useUnitListDropDown;
