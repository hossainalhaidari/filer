import {
  AppBar,
  Box,
  Button,
  CardContent,
  Dialog,
  IconButton,
  LinearProgress,
  TextareaAutosize,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";

import { useAppContext, useDialog } from "~/stores";
import { readApi, updateApi } from "~/api";

export const FileDialog = () => {
  const { getFile, loading, setLoading, refresh } = useAppContext();
  const { fileDialog, closeFileDialog } = useDialog();
  const file = getFile();
  const [content, setContent] = useState("");

  const onSave = async () => {
    if (file == null) return;

    setLoading(true);

    const res = await updateApi(file, content);

    if (res) {
      refresh();
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!fileDialog || file == null || file.isDir) return;

    setLoading(true);

    readApi(file).then((res) => {
      setContent(res);
      setLoading(false);
    });
  }, [file, fileDialog]);

  return (
    <Dialog fullScreen open={fileDialog}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={closeFileDialog}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {file?.name}
          </Typography>
          <Button color="inherit" onClick={onSave}>
            Save
          </Button>
          <Button color="inherit" onClick={closeFileDialog}>
            Cancel
          </Button>
        </Toolbar>
      </AppBar>
      <CardContent>
        {loading ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
          <TextareaAutosize
            aria-label="Content"
            style={{ width: "100%", height: "85vh" }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        )}
      </CardContent>
    </Dialog>
  );
};
