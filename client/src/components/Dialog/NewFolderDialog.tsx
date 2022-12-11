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

import { createApi } from "~/api";
import { useAppContext, useDialog } from "~/stores";

export const NewFolderDialog = () => {
  const { loading, setLoading, newDir, refresh } = useAppContext();
  const { newFolderDialog, closeNewFolderDialog } = useDialog();
  const [name, setName] = useState("");
  const [hasError, setHasError] = useState(false);

  const onCreate = async () => {
    if (!name) return;

    setLoading(true);

    const res = await createApi(newDir(name));

    if (res) {
      closeNewFolderDialog();
      refresh();
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

  useEffect(() => setName(""), [newFolderDialog]);

  return (
    <Dialog
      open={newFolderDialog}
      onClose={closeNewFolderDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">New Folder</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Enter a name for the new folder:
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
        <Button onClick={closeNewFolderDialog}>Cancel</Button>
        <Button onClick={onCreate} disabled={loading}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
