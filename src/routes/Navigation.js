/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import HomePage from "../crm/pages/HomePage/HomePage";
import Dashboard from "../crm/pages/Dashboard/Dashboard";
import CallHistory from "../crm/pages/CallHistory/CallHistory";
import CustomerDetails from "../crm/pages/Dashboard/CustomerDetails/CustomerDetails";
import EmailReport from "../crm/pages/Reports/EmailReport/EmailReport";
import ServiceRequest from "../crm/pages/Reports/ServiceRequest/ServiceRequest";
import AgingReport from "../crm/pages/Reports/AgingReport/AgingReport";
import Layout from "./Layout";
import ThemeAction from "../crm/pages/ThemeOptions/ThemeAction";
import { useSelector, useDispatch } from "react-redux";
import LoginPage from "../crm/pages/Login/LoginPage";
import ApprovalPage from "../crm/pages/HomePage/ApprovalPage";
import Invoices from "../crm/pages/Invoices/Invoices";
import ProjectMenus from "../ProjectOptions/ProjectMenus";
import Mails from "./../crm/pages/Mails/Mails";
import HierarchyTable from "./../HierarchyTable/HomePage/HomePage";

export default function Navigation() {
  const themeReducer = useSelector((state) => state.ThemeReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    const mode = localStorage.getItem("themeMode");
    const color = localStorage.getItem("colorMode");
    if (mode === "") {
      localStorage.setItem("mode", "theme-mode-light");
      dispatch(ThemeAction.setMode("theme-mode-light"));
    }
    if (color === "") {
      localStorage.setItem("color", "theme-color-blue");
      dispatch(ThemeAction.setColor("theme-color-blue"));
    }
  }, []);

  useEffect(() => {
    const themeClass = localStorage.getItem("themeMode");
    const colorClass = localStorage.getItem("colorMode");
    dispatch(ThemeAction.setMode(themeClass));
    dispatch(ThemeAction.setColor(colorClass));
  }, [dispatch]);

  return (
    <div className="layout">
      <Router>
        <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
          <div className="layout__content">
            <div className="layout__content-main">
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/menus" element={<ProjectMenus />} />
                <Route path="/menus/home" element={<HomePage />} />
                <Route path="/menus/table" element={<HierarchyTable />} />
                <Route path="/requestApproval" element={<ApprovalPage />} />
                <Route path="/crm/*" element={<Layout />}>
                  <Route index element={<CustomerDetails />} />
                  <Route path="customerDetails" element={<CustomerDetails />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="callHistory" element={<CallHistory />} />
                  <Route path="invoices" element={<Invoices />} />
                  <Route path="mails" element={<Mails />} />
                  <Route path="emailReport" element={<EmailReport />} />
                  <Route path="serviceRequest" element={<ServiceRequest />} />
                  <Route path="agingReport" element={<AgingReport />} />
                </Route>
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
}
