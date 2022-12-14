import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { useEffect, useState } from "react";

import { chmodApi } from "~/api";
import { useAppContext, useDialog } from "~/stores";
import { modeToNumber } from "~/utils/helpers";

export const ModeDialog = () => {
  const { loading, setLoading, selectedFiles, refresh, setError } =
    useAppContext();
  const { modeDialog, closeModeDialog } = useDialog();
  const [ownerMode, setOwnerMode] = useState(0);
  const [groupMode, setGroupMode] = useState(0);
  const [otherMode, setOtherMode] = useState(0);

  const toggleOwnerMode = (amount: number, isChecked: boolean) => {
    setOwnerMode(isChecked ? ownerMode + amount : ownerMode - amount);
  };

  const toggleGroupMode = (amount: number, isChecked: boolean) => {
    setGroupMode(isChecked ? groupMode + amount : groupMode - amount);
  };

  const toggleOtherMode = (amount: number, isChecked: boolean) => {
    setOtherMode(isChecked ? otherMode + amount : otherMode - amount);
  };

  const onChange = async () => {
    if (selectedFiles.length === 0) return;

    setError(null);
    setLoading(true);

    const res = await chmodApi(
      selectedFiles,
      `${ownerMode}${groupMode}${otherMode}`
    );

    if (res) {
      closeModeDialog();
      refresh();
    } else {
      setError("Cannot change mode. Please try again.");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!modeDialog) return;

    if (selectedFiles.length === 1) {
      const allMode = modeToNumber(selectedFiles[0].mode);
      setOwnerMode(allMode[0]);
      setGroupMode(allMode[1]);
      setOtherMode(allMode[2]);
    } else {
      setOwnerMode(0);
      setGroupMode(0);
      setOtherMode(0);
    }
  }, [modeDialog, selectedFiles]);

  return (
    <Dialog
      open={modeDialog}
      onClose={closeModeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Change Mode</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Enter the new mode for selected item(s):
        </DialogContentText>

        <Box sx={{ display: "flex" }}>
          <FormControl sx={{ m: 3 }}>
            <FormLabel component="legend">Owner</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={ownerMode >= 4}
                    onChange={(e) => toggleOwnerMode(4, e.target.checked)}
                  />
                }
                label="Read"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={[2, 3, 6, 7].includes(ownerMode)}
                    onChange={(e) => toggleOwnerMode(2, e.target.checked)}
                  />
                }
                label="Write"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={[1, 3, 5, 7].includes(ownerMode)}
                    onChange={(e) => toggleOwnerMode(1, e.target.checked)}
                  />
                }
                label="Execute"
              />
            </FormGroup>
          </FormControl>
          <FormControl component="fieldset" sx={{ m: 3 }} variant="standard">
            <FormLabel component="legend">Group</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={groupMode >= 4}
                    onChange={(e) => toggleGroupMode(4, e.target.checked)}
                  />
                }
                label="Read"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={[2, 3, 6, 7].includes(groupMode)}
                    onChange={(e) => toggleGroupMode(2, e.target.checked)}
                  />
                }
                label="Write"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={[1, 3, 5, 7].includes(groupMode)}
                    onChange={(e) => toggleGroupMode(1, e.target.checked)}
                  />
                }
                label="Execute"
              />
            </FormGroup>
          </FormControl>
          <FormControl component="fieldset" sx={{ m: 3 }} variant="standard">
            <FormLabel component="legend">Other</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={otherMode >= 4}
                    onChange={(e) => toggleOtherMode(4, e.target.checked)}
                  />
                }
                label="Read"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={[2, 3, 6, 7].includes(otherMode)}
                    onChange={(e) => toggleOtherMode(2, e.target.checked)}
                  />
                }
                label="Write"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={[1, 3, 5, 7].includes(otherMode)}
                    onChange={(e) => toggleOtherMode(1, e.target.checked)}
                  />
                }
                label="Execute"
              />
            </FormGroup>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModeDialog}>Cancel</Button>
        <Button onClick={() => onChange()} disabled={loading}>
          Change
        </Button>
      </DialogActions>
    </Dialog>
  );
};
