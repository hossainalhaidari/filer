import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Logout as LogoutIcon, Menu as MenuIcon } from "@mui/icons-material";
import { useEffect } from "react";

import {
  CompressDialog,
  DeleteDialog,
  ExtractDialog,
  FileDialog,
  ModeDialog,
  NewFileDialog,
  NewFolderDialog,
  RenameDialog,
} from "~/components/Dialog";
import { useAppContext, useAuthContext } from "~/stores";
import { FileGrid, PathBar } from "~/components";
import { clearToken, getServer, getUser } from "~/utils/storage";
import { AuthStatus } from "~/utils/types";
import { grey } from "@mui/material/colors";

export const FilesPage = () => {
  const { setAuthStatus } = useAuthContext();
  const { paths, refresh } = useAppContext();

  const onLogout = () => {
    clearToken();
    setAuthStatus(AuthStatus.UNAUTHORIZED);
  };

  useEffect(() => refresh(), [paths]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="Open Drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Filer
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography
            variant="body2"
            noWrap
            component="div"
            color={grey[400]}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {`${getUser()} @ ${getServer()}`}
          </Typography>
          <Box sx={{ marginLeft: 2, display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="Logout"
              color="inherit"
              onClick={onLogout}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: "1em" }}>
        <PathBar />
        <FileGrid />

        <CompressDialog />
        <DeleteDialog />
        <ExtractDialog />
        <FileDialog />
        <ModeDialog />
        <NewFileDialog />
        <NewFolderDialog />
        <RenameDialog />
      </Container>
    </Box>
  );
};
