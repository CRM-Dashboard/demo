import React from "react";
import Updates from "./Updates";
import ActivityDetails from "./ActivityDetails";
import CustomTabLayout from "../../components/tabs/CustomTabLayout";

export default function Activities() {
  const tabs = [
    {
      label: "Activity",
      component: <ActivityDetails />,
    },
    {
      label: "Updates",
      component: <Updates />,
    },
  ];

  return <CustomTabLayout tabPanels={tabs} />;
}
