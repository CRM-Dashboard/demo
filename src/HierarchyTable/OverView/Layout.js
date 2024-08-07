import React from "react";
import SideBar from "./Sidebar";
const Layout = ({ children }) => {
  return (
    <div className="w-100 h-100">
      <SideBar />
    </div>
  );
};

export default Layout;
