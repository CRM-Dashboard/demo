import React, { useState, useRef } from "react";
import TreeTable from "./TreeTable";
import { Grid, Button } from "@mui/material";

export default function HomePage() {
  // const [data, setTableData] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openCreateTicket, setOpenCreateTicket] = useState(false);
  const [openCreateChange, setOpenCreateChange] = useState(false);

  const ref = useRef(null);

  return (
    <Grid sx={{ marginTop: "0.7em", position: "relative" }}>
      {/* Fixed button div */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "#fff",
          padding: "0.5em 0",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            disableElevation
            disableFocusRipple
            size="sm"
            onClick={() => {
              setOpenCreateForm(true);
            }}
            sx={{
              margin: "0.2em",
              "&.MuiButton-root": {
                textTransform: "none",
                backgroundColor: "#228B22",
              },
            }}
          >
            New Project
          </Button>

          <Button
            variant="contained"
            disableElevation
            disableFocusRipple
            size="sm"
            onClick={() => {
              setOpenCreateTask(true);
            }}
            sx={{
              margin: "0.2em",
              "&.MuiButton-root": {
                textTransform: "none",
                backgroundColor: "#228B22",
              },
            }}
            disabled={!selectedRows.projectId || selectedRows.taskId}
          >
            New Task
          </Button>

          <Button
            variant="contained"
            disableElevation
            disableFocusRipple
            size="sm"
            onClick={() => {
              setOpenCreateTicket(true);
            }}
            sx={{
              margin: "0.2em",
              "&.MuiButton-root": {
                textTransform: "none",
                backgroundColor: "#228B22",
              },
            }}
            disabled={!selectedRows.taskId}
          >
            New Issue
          </Button>

          <Button
            variant="contained"
            disableElevation
            disableFocusRipple
            size="sm"
            onClick={() => {
              setOpenCreateChange(true);
            }}
            sx={{
              margin: "0.2em",
              "&.MuiButton-root": {
                textTransform: "none",
                backgroundColor: "#228B22",
              },
            }}
            disabled={!selectedRows.projectId}
          >
            New Change
          </Button>
        </div>
      </div>

      <div>
        <TreeTable
          ref={ref}
          secondIteration="false"
          openCreateForm={openCreateForm}
          setOpenCreateForm={setOpenCreateForm}
          openCreateTask={openCreateTask}
          setOpenCreateTask={setOpenCreateTask}
          openCreateTicket={openCreateTicket}
          setOpenCreateTicket={setOpenCreateTicket}
          openCreateChange={openCreateChange}
          setOpenCreateChange={setOpenCreateChange}
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
        />
      </div>
    </Grid>
  );
}
