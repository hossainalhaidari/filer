import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";

import { useAppContext, useDialog } from "~/stores";
import { fileSize } from "~/utils/helpers";

export const DetailsDialog = () => {
  const { getFile } = useAppContext();
  const { detailsDialog, closeDetailsDialog } = useDialog();
  const file = getFile();

  const rows = [
    {
      key: "Name",
      value: file?.name,
    },
    {
      key: "Type",
      value: file?.isDir ? "Folder" : file?.mime,
    },
    {
      key: "Size",
      value: fileSize(file?.size ?? 0),
    },
    {
      key: "Last Modified",
      value: file?.date,
    },
    {
      key: "Mode",
      value: file?.mode,
    },
    {
      key: "Path",
      value: file?.path === "" ? "/" : file?.path,
    },
  ];

  return (
    <Dialog
      open={detailsDialog}
      onClose={closeDetailsDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Item Details</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.key}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" width={135}>
                    <Typography variant="overline" color={grey[500]}>
                      {row.key}
                    </Typography>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">{row.value}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDetailsDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
