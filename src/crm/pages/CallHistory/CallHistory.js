/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import SAPCallLogs from "./SAPCallLogs";
import IncomingCalls from "./IncomingCalls";
import CustomTabLayout from "../../components/tabs/CustomTabLayout";
import OutGoingCalls from "./OutGoingCalls";

export default function CallHistory() {
  const tabs = [
    {
      label: "SAP Call Logs",
      component: <SAPCallLogs />,
    },
    {
      label: "OutGoing Calls",
      component: <OutGoingCalls />,
    },
    {
      label: "Incoming Calls",
      component: <IncomingCalls />,
    },
  ];

  return (
    <div>
      <CustomTabLayout tabPanels={tabs} />
    </div>
  );
}
