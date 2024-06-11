import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
} from "@mui/material";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import styled from "@mui/material/styles/styled";
import { useSpring, animated } from "react-spring";
import CancelIcon from "@mui/icons-material/Cancel";

function CrmModal(props) {
  //   const { modalAction } = useContext(ModalContext);
  const DialogTitleCustom = styled(DialogTitle)(({ theme }) => ({
    background: "#F3F5F7",
    color: "#363B4D",
    fontSize: "1.25rem",
    borderBottom: "1px solid #E0E0E0",
    width: "100%",
  }));

  const fade = useSpring({
    from: { opacity: props.show ? 1 : 0 },
    to: { opacity: 1 },
  });

  //   const primaryButtonIcon = useMemo(() => {
  //     if (modalAction.icon) {
  //       return modalAction.icon;
  //     }
  //     if (props.icon) {
  //       return props.icon;
  //     }
  //     return CheckIcon;
  //   }, [modalAction.icon, props.icon]);

  //   const primaryButtonText = useMemo(() => {
  //     if (modalAction.primaryBtnText) {
  //       return modalAction.primaryBtnText;
  //     }
  //     if (props.primaryBtnText) {
  //       return props.primaryBtnText;
  //     }
  //     return "Save";
  //   }, [modalAction.primaryBtnText, props.primaryBtnText]);

  //   const primaryButtonSavingText = useMemo(() => {
  //     if (modalAction.savingText) {
  //       return modalAction.savingText;
  //     }
  //     if (props.savingText) {
  //       return props.savingText;
  //     }
  //     return "Saving";
  //   }, [modalAction.savingText, props.savingText]);

  return (
    <animated.div style={fade}>
      <Dialog
        fullWidth
        maxWidth={props.maxWidth}
        maxHeight={props.maxHeight}
        open={props.show}
        onClose={props.handleShow}
        sx={{
          "& .MuiDialog-paper": {
            overflowY: "initial",
            height: props.maxHeight,
          },
        }}
      >
        <Grid style={{ alignItems: "flex-start", display: "flex" }}>
          {props.title && <DialogTitleCustom>{props.title}</DialogTitleCustom>}
        </Grid>

        {props.closeModal && (
          <Grid
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <CancelIcon onClick={props.closeModal} />
          </Grid>
        )}

        <DialogContent>
          {props.contentText && (
            <DialogContentText>{props.contentText}</DialogContentText>
          )}
          {props.children}
        </DialogContent>

        <DialogActions>
          {props.primaryBtnText && (
            <Button
              sx={{
                "&.MuiButton-root": {
                  textTransform: "none",
                  backgroundColor: "#228B22",
                },
              }}
              size="md"
              variant="contained"
              onClick={props.primarySave}
              disabled={props.disabled}
              icon={props.primaryIcon}
            >
              {props.primaryBtnText ? props.primaryBtnText : ""}
            </Button>
          )}
          {props.SecondaryBtnText && (
            <Button
              sx={{
                "&.MuiButton-root": {
                  textTransform: "none",
                  backgroundColor: "#ff0000",
                },
              }}
              variant="contained"
              size="md"
              onClick={props.secondarySave}
              icon={props.secondaryIcon}
            >
              {props.SecondaryBtnText ? props.SecondaryBtnText : ""}
            </Button>
          )}
          {props.TertiaryBtnText && (
            <Button
              sx={{
                "&.MuiButton-root": {
                  textTransform: "none",
                  backgroundColor: "gray",
                },
              }}
              disabled={props.disabledTertiaryBtn}
              variant="contained"
              size="md"
              onClick={props.TertiarySave}
            >
              {props.TertiaryBtnText ? props.TertiaryBtnText : ""}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </animated.div>
  );
}

CrmModal.defaultProps = {
  confirmation: false,
};

CrmModal.propTypes = {
  maxWidth: PropTypes.string,
  maxHeight: PropTypes.string,
  confirmation: PropTypes.bool,
  show: PropTypes.bool,
  primaryBtnText: PropTypes.string,
  secondPrimaryBtnText: PropTypes.string,
  secondaryBtnText: PropTypes.string,
  handleShow: PropTypes.func,
  title: PropTypes.node || PropTypes.string,
  contentText: PropTypes.string,
  children: PropTypes.node,
  deleteBtnText: PropTypes.string,
  deletingBtnText: PropTypes.string,
  savingText: PropTypes.string,
  icon: PropTypes.any,
  TertiaryBtnText: PropTypes.string,
  TertiarySave: PropTypes.func,
  secondarySavingText: PropTypes.any,
  disabledTertiaryBtn: PropTypes.bool,
  cancelBtnText: PropTypes.string,
  secondarySave: PropTypes.func,
  primarySave: PropTypes.func,
  closeModal: PropTypes.func,
};

export default CrmModal;
