import * as React from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";

function CircularScreenLoader({ isModal, style }) {
  return (
    // screen loader center of the screen
    <div
      style={
        isModal
          ? {
              padding: "100px",
            }
          : {}
      }
    >
      <Box
        sx={
          style || {
            position: "absolute",
            top: "50%",
            left: isModal ? "50%" : "50%",
            transform: "translate(-50%,-50%)",
          }
        }
      >
        <CircularProgress />
      </Box>
    </div>
  );
}

CircularScreenLoader.defaultProps = {
  isModal: false,
};

CircularScreenLoader.propTypes = {
  isModal: PropTypes.bool,
  style: PropTypes.any,
};

export default CircularScreenLoader;
