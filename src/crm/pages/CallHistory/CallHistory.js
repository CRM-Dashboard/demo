/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import OutGoingCalls from "./OutGoingCalls";
import IncomingOrMissedCalls from "./IncomingOrMissedCalls";
import CustomTabLayout from "../../components/tabs/CustomTabLayout";

export default function CallHistory() {
  const tabs = [
    {
      label: "OutGoing Calls",
      component: <OutGoingCalls />,
    },
    {
      label: "Incoming / Missed Calls",
      component: <IncomingOrMissedCalls />,
    },
  ];

  return (
    <div>
      <CustomTabLayout tabPanels={tabs} />
    </div>
  );
}
