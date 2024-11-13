import React from "react";
import { useParams } from "react-router-dom";

const RFI = () => {
  const { id } = useParams();
  return <div>RFI {JSON.stringify(id)}</div>;
};

export default RFI;
