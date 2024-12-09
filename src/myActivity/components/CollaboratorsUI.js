import React, { useState } from "react";
import { Stack, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CollaboratorAvatar from "./CollaboratorAvatar";
import AddCollaboratorDialog from "./AddCollaboratorDialog";
import CartDetails from "./CartDetail";

const CollaboratorsUI = ({ deptData, assignData, selectedTicket }) => {
  console.log("asbdgtdg", assignData);
  const [collaborators, setCollaborators] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleAddCollaborator = (data) => {
    setCollaborators([...collaborators, data]);
  };

  return (
    <div>
      <Stack direction="row" spacing={1} alignItems="center">
        {collaborators.map((collaborator, index) => (
          <CollaboratorAvatar
            key={index}
            name={collaborator?.description}
            collaborator={collaborator}
          />
        ))}
        <Tooltip title="Add Collaborator">
          <IconButton onClick={handleOpenDialog}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Dialog for Adding Collaborators */}
      <AddCollaboratorDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleAddCollaborator}
        assignData={assignData}
        deptData={deptData}
        selectedTicket={selectedTicket}
      />
      {/* <CartDetails /> */}
    </div>
  );
};

export default CollaboratorsUI;
