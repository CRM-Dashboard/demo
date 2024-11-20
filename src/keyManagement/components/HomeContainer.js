import { Grid, Tooltip } from "@mui/material";
import React, { useCallback, useState, useMemo, memo } from "react";
import HomeAccordion from "./HomeAccordion";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import withTable from "../../crm/components/TableFilter/withTable";
import TableFilter from "../../crm/components/TableFilter/TableFilter";
import ThreeDot from "../../components/ThreeDot";
import { fetchProjects, getOrderData } from "../services/homeService";

const HOCTable = withTable(memo(TableFilter));

const generatePath = (id) => `create/${id}`;

const HomeContainer = () => {
  const [selectedProjects, setSelectedProjects] = useState("");
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);

  const { data, isLoading, error } = useQuery({
    queryKey: ["project", userName, passWord],
    queryFn: fetchProjects,
  });

  const { data: tableData, isLoading: isTableLoading } = useQuery({
    queryKey: ["so-list", userName, passWord, selectedProjects[0]],
    queryFn: getOrderData,
    enabled: !!selectedProjects[0],
  });

  const handleProjectSelection = useCallback((event) => {
    const value = event.target.value;
    setSelectedProjects(typeof value === "string" ? value.split(",") : value);
  }, []);

  const memoizedData = useMemo(() => tableData, [tableData]);

  const columns = useMemo(
    () => [
      {
        Header: "Customer Name",
        accessor: "customerName",
      },
      {
        Header: "Project",
        accessor: "project",
      },
      {
        Header: "Property",
        accessor: "property",
      },

      {
        Header: "Action",
        accessor: "orderId",
        Cell: ({ value, row }) => {
          const path = generatePath(row?.original?.orderId);
          return (
            <Grid container gap={2} alignItems={"center"}>
              <Grid item md={5} sm={5} xs={5} xl={5}>
                <Tooltip title="Key">
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
                    Key
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

  return (
    <Grid container gap={2}>
      <Grid item md={12} sm={12} xl={12} xs={12}>
        <HomeAccordion
          projectData={data || []}
          selectedProjects={selectedProjects}
          handleProjectSelection={handleProjectSelection}
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
            showFilter={false}
            pagination={true}
            // setSelectedItems={setSelectedItems}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default HomeContainer;
