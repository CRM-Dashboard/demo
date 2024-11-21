import React, { useState, useEffect, useMemo, memo } from "react";
import moment from "moment";
import { useSelector } from "react-redux/es/hooks/useSelector";
import api from "../../../../services/api";
import withTable from "../../../components/TableFilter/withTable";
import ZigzagTable from "../../../components/TableFilter/ZigzagTable";
import { ThreeDot } from "react-loading-indicators";

const HOCTable = withTable(memo(ZigzagTable));

export default function TodayActivity() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const reducerData = useSelector((state) => state);
  const crmId = reducerData.dashboard.crmId;
  const OrderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData.dashboard.project;

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "erdat",
      },
      {
        Header: "Activity Type",
        accessor: "actTypTxt",
      },
      {
        Header: "Mode",
        accessor: "actModeTxt",
      },
      {
        Header: "Amount",
        accessor: "dmbtr",
      },
      {
        Header: "Action",
        accessor: "action",
      },
      {
        Header: "Time",
        accessor: "pltac",
      },
      {
        Header: "Remarks",
        accessor: "remark",
      },
    ],
    []
  );

  const memoizedData = useMemo(() => tableData, [tableData]);

  const getTableData = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("crmId", crmId);
      formData.append("orderId", OrderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("projectId", projectId);

      const response = await api.post(`/api/activity/getActivity`, formData);
      const data = response.data;

      if (data[0]?.actdata) {
        const todayActivity = data[0]?.actdata?.filter(
          (act) =>
            act.erdat === moment(new Date()).format("YYYY-MM-DD") &&
            !act.compInd
        );
        setTableData(todayActivity);
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTableData();
  }, [crmId, OrderId, projectId]);

  return (
    <div style={{ padding: "5px", fontFamily: "Arial, sans-serif" }}>
      {loading ? (
        <ThreeDot text={"Loading activities..."} />
      ) : memoizedData.length > 0 ? (
        <HOCTable
          columns={columns}
          data={memoizedData}
          select={false}
          pagination={false}
          showFilter={false}
          pageSize={100}
        />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100px",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ color: "#555", marginBottom: "4px" }}>
            No Activity Available
          </h2>
          <p style={{ color: "#777", fontSize: "16px", textAlign: "center" }}>
            There are no activities to display for today. Check back later for
            updates.
          </p>
        </div>
      )}
    </div>
  );
}
