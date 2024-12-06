import React from "react";
import { Avatar } from "@mui/material";

const CollaboratorAvatar = ({ name }) => {
  return (
    <>
      <Avatar>{name?.charAt(0)?.toUpperCase()}</Avatar>
    </>
  );
};

export default CollaboratorAvatar;
