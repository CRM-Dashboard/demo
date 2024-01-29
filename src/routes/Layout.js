import React from "react";
import SideBar2 from "../crm/pages/SideBar/SideBar2";
const Layout = ({ children }) => {
  return (
    <div className="w-100">
      <SideBar2 />
      {/* <main key={small_id}>{children}</main> */}
    </div>
  );
};

export default Layout;
