// FileMovementReport.js
import React, { useEffect, useMemo, useState, useCallback, memo } from "react";
import withTable from "../../../components/TableFilter/withTable";
import TableFilter from "../../../components/TableFilter/TableFilter";
import AccordionFilter from "./AccordionFilter";
import { useSelector } from "react-redux";
import axios from "axios";
import NumberRangeColumnFilter from "../../../components/TableFilter/NumberRangeColumnFilter";
import DateRangeColumnFilter from "../../../components/TableFilter/DateRangeColumnFilter";
import {
    dateRangeFilter,
    numberRangeFilter,
} from "../../../components/TableFilter/helpTableFunctions";

const HOCTable = withTable(memo(TableFilter));

const FileMovementReport = () => {
    const reducerData = useSelector((state) => state);
    const crmId = reducerData.dashboard.crmId;
    const OrderId = reducerData.searchBar.orderId;
    const passWord = reducerData.LoginReducer.passWord;
    const userName = reducerData.LoginReducer.userName;

    // console.log("filemovement report rendering*****");

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [projectData, setProjectData] = useState([]);
    const [crmData, setCrmData] = useState([]);
    const [selectedCrmIds, setSelectedCrmIds] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);





    const columns = useMemo(
        () => [
            {
                Header: "ProjectName",
                accessor: "project",
            },
            {
                Header: "Building",
                accessor: "building",
            },
            {
                Header: "Flat/Unit No",
                accessor: "flatno",
            },
            {
                Header: "Property",
                accessor: "property",
            },
            {
                Header: "Application Date",
                accessor: "appDt",
                Filter: DateRangeColumnFilter, // Use custom date range filter for DOB column
                filter: dateRangeFilter,
            },
            {
                Header: "Customer",
                accessor: "customerName",
            },
            {
                Header: "SaleToCRM Date",
                accessor: "salToCrmDt",
                Filter: DateRangeColumnFilter,
                filter: dateRangeFilter,
            },
            {
                Header: "CRM Receive Date",
                accessor: "crmRecDt",
                Filter: DateRangeColumnFilter,
                filter: dateRangeFilter,
            },
            {
                Header: "Confirm Date",
                accessor: "confDt",
                Filter: DateRangeColumnFilter,
                filter: dateRangeFilter,
            },
            {
                Header: "SaleTAT",
                accessor: "salTat",
                Filter: NumberRangeColumnFilter,
                filter: numberRangeFilter,
            },
            {
                Header: "GateTAT",
                accessor: "GateTat",
                Filter: NumberRangeColumnFilter,
                filter: numberRangeFilter,
            },
            {
                Header: "CRMTAT  ",
                accessor: "crmTat",
                Filter: NumberRangeColumnFilter, // Use custom number filter for age column

                filter: (rows, id, filterValue) => {
                    const [operator, value] = filterValue;
                    if (!value) return rows;
                    switch (operator) {
                        case "greaterThan":
                            return rows.filter((row) => row.values[id] > value);
                        case "lessThan":
                            return rows.filter((row) => row.values[id] < value);
                        case "equals":
                        default:
                            return rows.filter((row) => row.values[id] == value);
                    }
                },
            },
        ],

        []
    );
    const memoizedData = useMemo(() => data, [data]);


    const getProjectData = useCallback(async () => {
        const formData = new FormData();
        formData.append("userName", userName);
        formData.append("passWord", passWord);

        try {
            const response = await axios.post(
                process.env.REACT_APP_SERVER_URL + "/api/project",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setProjectData(response.data.ProjectList);
        } catch (error) {
            console.error("Error fetching project data:", error);
        }
    }, [userName, passWord]);

    const getCrmDetails = useCallback(async () => {
        const formData = new FormData();
        formData.append("userName", userName);
        formData.append("passWord", passWord);
        formData.append("crmId", userName);

        try {
            const response = await axios.post(
                process.env.REACT_APP_SERVER_URL + "/api/dashboard/getCrmManager",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.data.length > 0) {
                setCrmData(response.data);
            }
        } catch (error) {
            console.error("Error fetching CRM details:", error);
        }
    }, [userName, passWord]);

    const handleProjectSelection = useCallback((event) => {
        const value = event.target.value;
        setSelectedProjects(typeof value === "string" ? value.split(",") : value);
    }, []);

    const handleCrmSelection = useCallback((event) => {
        const value = event.target.value;
        setSelectedCrmIds(typeof value === "string" ? value.split(",") : value);
    }, []);

    const getTableData = useCallback(async () => {
        const formData = new FormData();
        formData.append("orderId", OrderId);
        formData.append("userName", userName);
        formData.append("passWord", passWord);
        crmId
            ? formData.append("crmId", crmId)
            : formData.append("crmIds", selectedCrmIds.toString());
        formData.append("projectIds", selectedProjects.toString());

        setLoading(true);

        try {
            const response = await axios.post(
                process.env.REACT_APP_SERVER_URL + "/api/dashboard/so_list",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setData(response.data[0]?.orderdata || []);
        } catch (error) {
            console.error("Error fetching table data:", error);
        } finally {
            setLoading(false);
        }
    }, [OrderId, userName, passWord, crmId, selectedCrmIds, selectedProjects]);

    useEffect(() => {
        getCrmDetails();
        getProjectData();
    }, [getCrmDetails, getProjectData]);
    return (
        <div>
            <AccordionFilter
                projectData={projectData}
                crmData={crmData}
                selectedCrmIds={selectedCrmIds}
                selectedProjects={selectedProjects}
                handleProjectSelection={handleProjectSelection}
                handleCrmSelection={handleCrmSelection}
                getTableData={getTableData}
                loading={loading}
            />
            {loading ? (
                <h2>Loading...</h2>
            ) : (

                <HOCTable
                    columns={columns}
                    data={memoizedData}
                    pageSize={100}
                    select={false}
                    editable={false}
                    showFilter={true}
                    pagination={false}
                />

            )}
        </div>
    );
};

export default FileMovementReport;
