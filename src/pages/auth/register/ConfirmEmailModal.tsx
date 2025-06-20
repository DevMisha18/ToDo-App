import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

type confirmEmailModalType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ConfirmEmailModal: React.FC<confirmEmailModalType> = ({
  open,
  setOpen,
}) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Confirmation Email Sent!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          We&apos;ve sent a confirmation email to your inbox. Please click the
          link inside to verify your account and unlock full access to the app.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Okay</Button>
      </DialogActions>
    </Dialog>
  );
};
