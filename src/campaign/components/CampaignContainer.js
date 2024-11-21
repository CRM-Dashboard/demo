import React, { memo, useState, useCallback, useMemo } from "react";
import { Button, Grid, Tooltip, IconButton } from "@mui/material";
import CampaignAccordion from "./CampaignAccordion";
import withTable from "../../crm/components/TableFilter/withTable";
import TableFilter from "../../crm/components/TableFilter/TableFilter";
import useProjectListDropdown from "../../drawingManagement/hooks/useProjectListDropDown";
import ErrorPage from "../../drawingManagement/components/ErrorPage";
import { Link, useNavigate } from "react-router-dom";
import useGetCrmList from "../hooks/useGetCrmList";
import useGetCampaignCustomerList from "../hooks/useGetCampaignCustmersList";
import ThreeDot from "../../components/ThreeDot";
import axios from "axios";

import CallIcon from "@mui/icons-material/Call";
import { useSelector } from "react-redux";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";

const HOCTable = withTable(memo(TableFilter));

const generatePath = (id) => `survey/${id}`;

const CampaignContainer = () => {
  const loggedInUser = useSelector(
    (reducerData) => reducerData.LoginReducer.loggedInUser
  );
  const snackbar = UseCustomSnackbar();
  const [selectedProjects, setSelectedProjects] = useState("");
  const [selectedCrm, setSelectedCrm] = useState("");
  const { projecList } = useProjectListDropdown();
  const { crmList } = useGetCrmList();
  const { getTableData, tableData, isTableLoading, error } =
    useGetCampaignCustomerList();
  const navigate = useNavigate();

  const initiateOutgoingCall = async (customerMobileNumber) => {
    if (customerMobileNumber) {
      const formData = new FormData();

      formData.append("From", loggedInUser?.mobile);
      formData.append("To", customerMobileNumber);
      formData.append("CallerId", "020-485-55656");
      formData.append("Record", true); // FormData accepts strings

      const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/exotel/make-call`;

      try {
        const response = await axios.post(apiUrl, formData);

        if (response.data && response.data.Call) {
          snackbar.showSuccess(`Connecting to... ${customerMobileNumber}`);
          // Uncomment and use these as needed
          // setCallAPI(true);
          // setSid(response.data.Call.Sid);
          // dispatch(customerInfoAction.setCustomerInfoSid(response.data.Call.Sid));
        } else {
          snackbar.showError("Unexpected response format.");
        }
      } catch (error) {
        console.error("Error in initiateOutgoingCall:", error);
        snackbar.showError("Error while connecting. Please try again!");
      }
    }
  };

  const columns = useMemo(
    () => [
      // arktx
      {
        Header: "Project",
        accessor: "arktx",
      },
      {
        Header: "CRM",
        accessor: "crmid",
      },
      {
        Header: "Customer Name",
        accessor: "customerName",
      },
      {
        Header: "City",
        accessor: "city",
      },
      {
        Header: "State",
        accessor: "State",
      },
      {
        Header: "Country",
        accessor: "Country",
      },
      {
        Header: "Occupation",
        accessor: "Occupation",
      },
      {
        Header: "Designation",
        accessor: "Designation",
      },
      {
        Header: "Company",
        accessor: "Company",
      },
      {
        Header: "Gender",
        accessor: "Gender",
      },
      {
        Header: "Action",
        accessor: "Mobile",
        Cell: ({ value, row }) => {
          const path = generatePath(row?.original?.orderId);
          return (
            <Grid container gap={2} alignItems={"center"}>
              <Grid item md={5} sm={5} xs={5} xl={5}>
                <Tooltip title="Call">
                  <IconButton onClick={() => initiateOutgoingCall(value)}>
                    <CallIcon sx={{ color: "green" }} />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item md={5} sm={5} xs={5} xl={5}>
                <Tooltip title="Survey">
                  <Link
                    to={path}
                    // target="_blank"
                    // rel="noreferrer"
                    style={{
                      display: "block",
                      cursor: "pointer",
                      width: "100%",
                      height: "100%",
                      color: "blue",

                      // textDecoration: "none",
                      // color: "inherit",
                    }}
                  >
                    Survey
                  </Link>
                </Tooltip>
              </Grid>
            </Grid>
          );
        },
      },
    ],
    []
  );

  const memoizedData = useMemo(() => tableData, [tableData]);

  const handleProjectSelection = useCallback((event) => {
    const value = event.target.value;
    setSelectedProjects(typeof value === "string" ? value.split(",") : value);
  }, []);

  const handleCrmSelection = useCallback((event) => {
    const value = event.target.value;

    setSelectedCrm(typeof value === "string" ? value.split(",") : value);
  }, []);

  const handleGetTableData = () => {
    // Use the first selected project or an empty string
    const projectId = selectedProjects[0] || ""; // Use the first selected project or an empty string
    const crmId = selectedCrm[0] || "";
    if (selectedProjects.length > 0 && selectedCrm.length > 0) {
      getTableData(projectId, crmId); // Call with both parameters
    } else if (selectedProjects.length > 0) {
      getTableData(projectId, ""); // Call with only projectId
    } else if (selectedCrm.length > 0) {
      getTableData("", crmId); // Call with only crmId
    }
  };

  if (error) {
    return <ErrorPage message={""} />;
  }
  return (
    <>
      <Grid container gap={4}>
        <Grid item md={12} sm={12} xl={12} xs={12}>
          <CampaignAccordion
            projectData={projecList || []}
            selectedProjects={selectedProjects}
            handleProjectSelection={handleProjectSelection}
            crmData={crmList || []}
            selectedCrm={selectedCrm}
            handleCrmSelection={handleCrmSelection}
            getTableData={handleGetTableData}
            loading={isTableLoading}
          />
        </Grid>
        <Grid item md={12} sm={12} xl={12} xs={12}>
          {isTableLoading ? (
            <ThreeDot text="Data Is Loading...!!!" />
          ) : (
            <HOCTable
              columns={columns}
              data={memoizedData || []}
              pageSize={100}
              // select={role === "admin" ? true : false}
              select={false}
              editable={false}
              showFilter={true}
              pagination={true}
              // setSelectedItems={setSelectedItems}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default CampaignContainer;
