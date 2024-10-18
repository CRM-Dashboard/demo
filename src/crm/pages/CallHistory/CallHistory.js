/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
// import SAPCallLogs from "./SAPCallLogs";
import CustomTabLayout from "../../components/tabs/CustomTabLayout";
// import IncomingCalls from "./IncomingCalls";
// import OutGoingCalls from "./OutGoingCalls";
import MyInComingCalls from "./MyInComingCalls";
import MyOutGoingCalls from "./MyOutGoingCalls";
import RefactorIncomingCalls from "./RefactorIncomingCalls";
import RefactorOutgoingCalls from "./RefactorOutgoingCalls";
import RefctorSap from "./RefctorSap";



export default function CallHistory() {
  const tabs = [
    // {
    //   label: "SAP Call Logs",
    //   component: <SAPCallLogs />,
    // },
    {
      label: "SAP Call Logs",
      component: <RefctorSap />,
    },
    // {
    //   label: "Incoming Calls",
    //   component: <IncomingCalls />,
    // },
    {
      label: "Incoming Calls",
      component: <RefactorIncomingCalls />,
    },
    // {
    //   label: "OutGoing Calls",
    //   component: <OutGoingCalls />,
    // },
    {
      label: "OutGoing Calls",
      component: <RefactorOutgoingCalls />,
    },
    {
      label: "My Incoming Calls",
      component: <MyInComingCalls />,
    },
    {
      label: "My Outgoing Calls",
      component: <MyOutGoingCalls />,
    },
  ];

  return (
    <div>
      <CustomTabLayout tabPanels={tabs} />
    </div>
  );
}
