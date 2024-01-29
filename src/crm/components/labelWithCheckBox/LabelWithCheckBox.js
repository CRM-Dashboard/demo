import React from "react";
import PropTypes from "prop-types";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import styled from "@emotion/styled";

function LabelWithCheckbox(props) {
  const { label, value, ...rest } = props;

  const ErpCheckbox = styled(Checkbox)({
    "&.MuiCheckbox-root": {
      scale: "0.75",
    },
  });

  return (
    <FormControlLabel
      control={<ErpCheckbox disableRipple checked={value} />}
      label={<Typography variant="body-1">{label}</Typography>}
      {...rest}
    />
  );
}

LabelWithCheckbox.propTypes = {
  label: PropTypes.string,
  value: PropTypes.bool,
};

export default LabelWithCheckbox;
