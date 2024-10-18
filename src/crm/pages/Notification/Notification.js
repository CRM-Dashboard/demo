import React from "react";
import CustomTabLayout from "../../components/tabs/CustomTabLayout";
import AllNotification from "../../pages/Notification/AllNotification";
import CustomNotification from "../../pages/Notification/CustomNotification";
import SystemNotification from "./SystemNotification";

const Notification = () => {
  const tabs = [
    {
      label: "All Notifications",
      component: <AllNotification />,
    },
    {
      label: "Custom Notifications",
      component: <CustomNotification />,
    },
    {
      label: "Custom Notifications",
      component: <CustomNotification />,
    },
    {
      label: "System Notifications",
      component: <SystemNotification />,
    },
  ];

  return (
    <div>
      <CustomTabLayout tabPanels={tabs} />
    </div>
  );
};
export default Notification;
