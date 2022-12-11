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

import { extractApi } from "~/api";
import { useAppContext, useDialog } from "~/stores";

export const ExtractDialog = () => {
  const { getFile, joinCwd, loading, setLoading, refresh } = useAppContext();
  const { extractDialog, closeExtractDialog } = useDialog();
  const file = getFile();
  const [name, setName] = useState("");
  const [hasError, setHasError] = useState(false);

  const onChange = (newName: string) => {
    if (!newName) {
      setHasError(true);
    } else {
      setHasError(false);
    }
    setName(newName);
  };

  const onExtract = async () => {
    if (file == null || !name) return;

    setLoading(true);

    const res = await extractApi(file, joinCwd(name));

    if (res) {
      closeExtractDialog();
      refresh();
    }

    setLoading(false);
  };

  useEffect(() => setName(""), [extractDialog]);

  return (
    <Dialog
      open={extractDialog}
      onClose={closeExtractDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Extract Archive</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Enter the directory name for your extracted files:
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
        <Button onClick={closeExtractDialog}>Cancel</Button>
        <Button onClick={onExtract} disabled={loading}>
          Extract
        </Button>
      </DialogActions>
    </Dialog>
  );
};
