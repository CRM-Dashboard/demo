import React from "react";
import CustomTabLayout from "../../components/tabs/CustomTabLayout";
import CustomNotification from "../../components/notification/CustomNotification";
import AllNotification from "../../components/notification/AllNotification";

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
  ];

  return (
    <div>
      <CustomTabLayout tabPanels={tabs} />
    </div>
  );
};
export default Notification;
