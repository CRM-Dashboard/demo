/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Layout from "./Layout";
import LoginPage from "../crm/pages/Login/LoginPage";
import Invoices from "../crm/pages/Invoices/Invoices";
import { useSelector, useDispatch } from "react-redux";
import HomePage from "../crm/pages/HomePage/HomePage";
import Sidebar from "../HierarchyTable/OverView/Sidebar";
import Dashboard from "../crm/pages/Dashboard/Dashboard";
import ProjectMenus from "../ProjectOptions/ProjectMenus";
import Tasks from "../HierarchyTable/TaskManagement/Tasks";
import ApprovalPage from "../crm/pages/HomePage/ApprovalPage";
import TrackerLayout from "../HierarchyTable/OverView/Layout";
import CallHistory from "../crm/pages/CallHistory/CallHistory";
import ThemeAction from "../crm/pages/ThemeOptions/ThemeAction";
import Tickets from "../HierarchyTable/TicketManagement/Tickets";
import FileMovement from "../crm/pages/FileMovement/FileMovement";
import Projects from "../HierarchyTable/ProjectManagement/Projects";
import AgingReport from "../crm/pages/Reports/AgingReport/AgingReport";
import EmailReport from "../crm/pages/Reports/EmailReport/EmailReport";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import ServiceRequest from "../crm/pages/Reports/ServiceRequest/ServiceRequest";
import CashbackReport from "../crm/pages/Reports/CashbackReport/CashbackReport";
import ITHierarchyDashboard from "../HierarchyTable/Dashboard/Dashboard";
import CustomerDetails from "../crm/pages/Dashboard/CustomerDetails/CustomerDetails";
import CancellationReport from "../crm/pages/Reports/CancellationReport/CancellationReport";
import Changes from "../HierarchyTable/ChangeManagement/Changes";

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
                <Route path="/*" element={<TrackerLayout />}>
                  {/* <Route index element={<HierarchyTable />} /> */}
                  <Route path="task" element={<Tasks />} />
                  <Route path="tickets" element={<Tickets />} />
                  <Route path="project" element={<Projects />} />
                  <Route path="changes" element={<Changes />} />
                  <Route path="dashboard" element={<ITHierarchyDashboard />} />
                </Route>
                {/* <Route path="/menus/table" element={<HierarchyTable />} /> */}
                <Route path="/menus/table" element={<Sidebar />} />
                <Route path="/requestApproval" element={<ApprovalPage />} />
                <Route path="/crm/*" element={<Layout />}>
                  <Route index element={<CustomerDetails />} />
                  <Route path="fileMovement" element={<FileMovement />} />
                  <Route path="customerDetails" element={<CustomerDetails />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="callHistory" element={<CallHistory />} />
                  <Route path="invoices" element={<Invoices />} />
                  <Route path="emailReport" element={<EmailReport />} />
                  <Route path="serviceRequest" element={<ServiceRequest />} />
                  <Route path="agingReport" element={<AgingReport />} />
                  <Route path="cashBackReport" element={<CashbackReport />} />
                  <Route
                    path="cancellationReport"
                    element={<CancellationReport />}
                  ></Route>
                </Route>
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
}
