import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import { renameApi } from "~/api";
import { useAppContext, useDialog } from "~/stores";

export const RenameDialog = () => {
  const { getFile, loading, setLoading, refresh, setError } = useAppContext();
  const { renameDialog, closeRenameDialog } = useDialog();
  const file = getFile();
  const [name, setName] = useState(file?.name);
  const [hasError, setHasError] = useState(false);

  const onRename = async () => {
    if (file == null || !name) return;

    setError(null);
    setLoading(true);

    const res = await renameApi(file, name);

    if (res) {
      closeRenameDialog();
      refresh();
    } else {
      setError("Cannot rename item. Please try again.");
    }

    setLoading(false);
  };

  const onChange = (newName: string) => {
    if (!newName) {
      setHasError(true);
    } else {
      setHasError(false);
    }
    setName(newName);
  };

  useEffect(() => setName(file?.name), [renameDialog]);

  return (
    <Dialog
      open={renameDialog}
      onClose={closeRenameDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Rename Item</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Enter the new name for selected item:
        </DialogContentText>
        <TextField
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          error={hasError}
          value={name}
          onChange={(e) => onChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeRenameDialog}>Cancel</Button>
        <Button onClick={onRename} disabled={loading}>
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
};
