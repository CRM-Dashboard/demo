import React, { useState } from "react";
import { Stack, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CollaboratorAvatar from "./CollaboratorAvatar";
import AddCollaboratorDialog from "./AddCollaboratorDialog";
import CartDetails from "./CartDetail";

const CollaboratorsUI = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleAddCollaborator = (data) => {
    console.log("Ddmskdusjdyhsyh", data);

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
      />
      {/* <CartDetails /> */}
    </div>
  );
};

export default CollaboratorsUI;
