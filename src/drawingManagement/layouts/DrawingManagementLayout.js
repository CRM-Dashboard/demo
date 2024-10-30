import React, { memo } from "react";
import CustomSidebar from "../components/CustomSidebar";
import { useNavigate, Routes, Route } from "react-router-dom";
import DrawingDashboard from "../pages/DrawingDashboard";
import DrawingRegister from "../pages/DrawingRegister";
import RFI from "../pages/RFI";
import DrawingTransmittal from "../pages/DrawingTransmittal";
import DrawingCertificate from "../pages/DrawingCertificate";
import { routes } from "../constants/constants";
import DrawingDetails from "../pages/DrawingDetails";
import UnitAnnexure from "../pages/UnitAnnexure";

const DrawingManagementLayout = () => {
  const navigate = useNavigate();

  const handleNavigation = (to) => {
    navigate(to); // Navigate to the new route
  };

  return (
    <>
      <div className="w-100 h-100">
        <CustomSidebar
          appBarTitle="Drawing Management"
          routes={routes}
          navigateHandler={handleNavigation}
          //   headerContent={"headerContent"}
          logo={require("../../assets/gera_logo.jpg")}
        >
          <Routes>
            <Route path="/*">
              <Route index element={<DrawingDashboard />} />
              <Route path="details/:id" element={<DrawingDetails />} />
              <Route path="register" element={<DrawingRegister />} />
              <Route path="rfi" element={<RFI />} />
              <Route path="transmittal" element={<DrawingTransmittal />} />
              <Route path="certificate" element={<DrawingCertificate />} />
              <Route path="unit-annexure" element={<UnitAnnexure />} />
            </Route>
          </Routes>
        </CustomSidebar>
      </div>
    </>
  );
};

export default memo(DrawingManagementLayout);
