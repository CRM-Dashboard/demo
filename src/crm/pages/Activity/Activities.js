/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
// import FileUploader from "./FileUploader/FileUploader";

import ActivityDetails from "./ActivityDetails";
import CustomTabLayout from "../../components/tabs/CustomTabLayout";

export default function Activities() {
  const tabs = [
    {
      label: "Activity",
      component: <ActivityDetails />,
    },
    // {
    //   label: "File Upload",
    //   component: <FileUploader />,
    // },
  ];

  return <CustomTabLayout tabPanels={tabs} />;
}
