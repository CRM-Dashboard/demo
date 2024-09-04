/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import ViewAndPrintDocument from "./ViewAndPrintDocument";
import DropdownConstants from "./../../utils/DropdownConstants";
import CustomTabLayout from "../../components/tabs/CustomTabLayout";
import ShowFileUsingURL from "./ShowFileUsingURL";

export default function PrintOptions() {
  const tabs = [
    {
      label: "NOC Documents ",
      component: <ViewAndPrintDocument data={DropdownConstants.NocDocument} />,
    },
    {
      label: "Letter Documents",
      component: (
        <ViewAndPrintDocument data={DropdownConstants.letterDocument} />
      ),
    },
    {
      label: "Files",
      component: (
        <ViewAndPrintDocument data={DropdownConstants.PrintDocument} />
      ),
    },
    {
      label: "Car Parking",
      component: <ShowFileUsingURL />,
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
