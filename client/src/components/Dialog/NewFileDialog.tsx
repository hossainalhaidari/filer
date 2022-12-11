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

export const NewFileDialog = () => {
  const { loading, setLoading, newFile, refresh } = useAppContext();
  const { newFileDialog, closeNewFileDialog } = useDialog();
  const [name, setName] = useState("");
  const [hasError, setHasError] = useState(false);

  const onCreate = async () => {
    if (!name) return;

    setLoading(true);

    const res = await createApi(newFile(name));

    if (res) {
      closeNewFileDialog();
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

  useEffect(() => setName(""), [newFileDialog]);

  return (
    <Dialog
      open={newFileDialog}
      onClose={closeNewFileDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">New File</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Enter a name for the new file:
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
        <Button onClick={closeNewFileDialog}>Cancel</Button>
        <Button onClick={onCreate} disabled={loading}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
