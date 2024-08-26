import React from "react";
import UnitOutstandingAgeing from "./UnitOutstandingAgeing";
import WeeklyCollectionTarget from "./WeeklyCollectionTarget";
import CustomTabLayout from "./../../../components/tabs/CustomTabLayout";

export default function AgingReport() {
  const tabs = [
    {
      label: "Unit Outstanding Ageing",
      component: <UnitOutstandingAgeing />,
    },
    {
      label: "Weekly Collection Target",
      component: <WeeklyCollectionTarget />,
    },
  ];

  return (
    <div
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-end",
        flexDirection: "row-reverse",
      }}
    >
      <CustomTabLayout tabPanels={tabs} />
    </div>
  );
}
