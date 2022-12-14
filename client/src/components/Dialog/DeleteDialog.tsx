import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { deleteApi } from "~/api";
import { useAppContext, useDialog } from "~/stores";

export const DeleteDialog = () => {
  const { loading, setLoading, selectedFiles, refresh, setError } =
    useAppContext();
  const { deleteDialog, closeDeleteDialog } = useDialog();

  const onDelete = async () => {
    if (selectedFiles.length === 0) return;

    setError(null);
    setLoading(true);

    const res = await deleteApi(selectedFiles);

    if (res) {
      closeDeleteDialog();
      refresh();
    } else {
      setError("Cannot delete item(s). Please try again.");
    }

    setLoading(false);
  };

  return (
    <Dialog
      open={deleteDialog}
      onClose={closeDeleteDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Item(s)</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete selected item(s)?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDeleteDialog}>No</Button>
        <Button onClick={onDelete} disabled={loading}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
