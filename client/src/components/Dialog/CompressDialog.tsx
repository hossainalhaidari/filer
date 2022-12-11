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

import { compressApi } from "~/api";
import { useAppContext, useDialog } from "~/stores";

export const CompressDialog = () => {
  const { joinCwd, loading, setLoading, selectedFiles, refresh } =
    useAppContext();
  const { compressDialog, closeCompressDialog } = useDialog();
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

  const onCompress = async () => {
    if (selectedFiles.length === 0 || !name) return;

    setLoading(true);

    const res = await compressApi(selectedFiles, joinCwd(name));

    if (res) {
      closeCompressDialog();
      refresh();
    }

    setLoading(false);
  };

  useEffect(() => setName(""), [compressDialog]);

  return (
    <Dialog
      open={compressDialog}
      onClose={closeCompressDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Compress Files</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Enter a name for your zip file:
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
        <Button onClick={closeCompressDialog}>Cancel</Button>
        <Button onClick={onCompress} disabled={loading}>
          Compress
        </Button>
      </DialogActions>
    </Dialog>
  );
};
