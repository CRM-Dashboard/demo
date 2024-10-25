import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const DrawingDashboard = () => {
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const getDropdownList = async () => {
    try {
      const url =
        process.env.REACT_APP_SERVER_URL + "/api/drawing/get-dropdown";
      // const url =
      // process.env.REACT_APP_SERVER_URL + "/api/drawing/get-drawing-list";
      // /get-drawing-list
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("projectId", "1132");
      const res = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDropdownList();
  }, []);

  return (
    <div>
      DrawingDashboard
      <NavLink style={{}} to={`details/255`}>
        {" "}
        Id
      </NavLink>
    </div>
  );
};

export default DrawingDashboard;
