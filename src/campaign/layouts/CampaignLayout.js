import React, { memo } from "react";
import CustomSidebar from "../../drawingManagement/components/CustomSidebar";
import { useNavigate, Routes, Route } from "react-router-dom";
import { routes } from "../constants/routes";
import CampaignHome from "../pages/CampaignHome";
import Survey from "../components/Survey";
import Analysis from "../pages/Analysis";

const CampaignLayout = () => {
  const navigate = useNavigate();

  const handleNavigation = (to) => {
    navigate(to); // Navigate to the new route
  };

  return (
    <>
      <div className="w-100 h-100">
        <CustomSidebar
          appBarTitle="Campaign"
          routes={routes}
          navigateHandler={handleNavigation}
          logo={require("../../assets/gera_logo.jpg")}
        >
          <Routes>
            <Route path="/*">
              <Route index element={<CampaignHome />} />
              <Route path="survey/:id" element={<Survey />} />
              <Route path="analysis" element={<Analysis />} />
            </Route>
          </Routes>
        </CustomSidebar>
      </div>
    </>
  );
};

export default memo(CampaignLayout);
