import React, { memo } from "react";
import CustomSidebar from "../../drawingManagement/components/CustomSidebar";
import { useNavigate, Routes, Route } from "react-router-dom";
import { routes } from "../constants/routes";
import KeyManagementHome from "../pages/KeyManagementHome";

const KeyManagementLayout = () => {
  const navigate = useNavigate();

  const handleNavigation = (to) => {
    navigate(to); // Navigate to the new route
  };

  return (
    <>
      <div className="w-100 h-100">
        <CustomSidebar
          appBarTitle="Key Management"
          routes={routes}
          navigateHandler={handleNavigation}
          logo={require("../../assets/gera_logo.jpg")}
        >
          <Routes>
            <Route path="/*">
              <Route index element={<KeyManagementHome />} />
            </Route>
          </Routes>
        </CustomSidebar>
      </div>
    </>
  );
};

export default memo(KeyManagementLayout);
