import { IconButton, Divider, LinearProgress, TextField } from "@mui/material";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import {
  Archive as ArchiveIcon,
  ChevronLeft as BackIcon,
  ContentCut as CutIcon,
  ContentCopy as CopyIcon,
  ContentPaste as PasteIcon,
  CreateNewFolder as NewFolderIcon,
  Delete as DeleteIcon,
  FileUpload as FileUploadIcon,
  NoteAdd as NewFileIcon,
  Refresh as RefreshIcon,
  Shield as ModeIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { AxiosProgressEvent } from "axios";

import { useColumns } from "./useColumns";

import { copyApi, moveApi, searchApi, uploadApi } from "~/api";
import { File } from "~/utils/types";
import { useAppContext, useDialog } from "~/stores";

export const FileGrid = () => {
  const {
    paths,
    setPaths,
    cwd,
    files,
    setFiles,
    clipboard,
    setClipboard,
    clearClipboard,
    selectedFiles,
    setSelectedFiles,
    loading,
    setLoading,
    search,
    setSearch,
    refresh,
    setError,
  } = useAppContext();
  const {
    openCompressDialog,
    openDeleteDialog,
    openModeDialog,
    openNewFileDialog,
    openNewFolderDialog,
  } = useDialog();
  const [progress, setProgress] = useState(0);

  const columns = useColumns();

  const onPaste = async () => {
    if (clipboard.files.length === 0) return;

    setError(null);
    setLoading(true);

    const res = clipboard.isCut
      ? await moveApi(clipboard.files, cwd())
      : await copyApi(clipboard.files, cwd());

    if (res) {
      clearClipboard();
      refresh();
    } else {
      setError("Cannot paste item(s). Please try again.");
    }

    setLoading(false);
  };

  const onUpload = async (files: FileList | null) => {
    if (!files) return;

    setError(null);
    setLoading(true);

    const res = await uploadApi(files, cwd(), (event: AxiosProgressEvent) => {
      setProgress(Math.round((100 * event.loaded) / (event.total ?? 1)));
    });

    if (res) {
      refresh();
    } else {
      setError("Cannot upload files. Please try again.");
    }

    setLoading(false);
  };

  const onSearch = async (query: string) => {
    setSearch(query);

    if (query.trim() === "") {
      refresh();
      return;
    }

    setError(null);
    setLoading(true);

    const res = await searchApi(cwd(), query.trim());

    if (res) {
      setFiles(res);
    } else {
      setError("Cannot search files. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ height: 600, width: "100%", marginTop: 10 }}>
      <DataGrid
        rows={files}
        columns={columns}
        columnVisibilityModel={{
          date: search === "",
          path: search !== "",
        }}
        loading={loading}
        pageSize={30}
        getRowId={(row: File) => row.name}
        checkboxSelection
        onSelectionModelChange={(selections) => {
          setSelectedFiles(
            selections.map((selection) =>
              files.find((file) => file.name === selection)
            ) as File[]
          );
        }}
        components={{
          LoadingOverlay: () => (
            <LinearProgress variant="determinate" value={progress} />
          ),
          Toolbar: () => (
            <GridToolbarContainer>
              <IconButton
                aria-label="Up"
                disabled={paths.length <= 1}
                onClick={() => setPaths(paths.slice(0, -1))}
              >
                <BackIcon />
              </IconButton>
              <IconButton aria-label="Refresh" onClick={() => refresh()}>
                <RefreshIcon />
              </IconButton>
              <Divider orientation="vertical" flexItem />
              <IconButton aria-label="Upload" component="label">
                <FileUploadIcon />
                <input
                  hidden
                  accept="file/*"
                  multiple
                  type="file"
                  onChange={(e) => onUpload(e.target.files)}
                />
              </IconButton>
              <IconButton
                aria-label="New Folder"
                onClick={() => openNewFolderDialog()}
              >
                <NewFolderIcon />
              </IconButton>
              <IconButton
                aria-label="New File"
                onClick={() => openNewFileDialog()}
              >
                <NewFileIcon />
              </IconButton>
              <Divider orientation="vertical" flexItem />
              <IconButton
                aria-label="Change Mode"
                disabled={selectedFiles.length === 0}
                onClick={openModeDialog}
              >
                <ModeIcon />
              </IconButton>
              <IconButton
                aria-label="Delete"
                disabled={selectedFiles.length === 0}
                onClick={openDeleteDialog}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                aria-label="Copy"
                disabled={selectedFiles.length === 0}
                onClick={() =>
                  setClipboard({ files: selectedFiles, isCut: false })
                }
              >
                <CopyIcon />
              </IconButton>
              <IconButton
                aria-label="Move"
                disabled={selectedFiles.length === 0}
                onClick={() =>
                  setClipboard({ files: selectedFiles, isCut: true })
                }
              >
                <CutIcon />
              </IconButton>
              <IconButton
                aria-label="Compress"
                disabled={selectedFiles.length === 0}
                onClick={openCompressDialog}
              >
                <ArchiveIcon />
              </IconButton>
              <Divider orientation="vertical" flexItem />
              <IconButton
                aria-label="Paste"
                disabled={clipboard.files.length === 0}
                onClick={onPaste}
              >
                <PasteIcon />
              </IconButton>
              <TextField
                label="Search..."
                type="text"
                size="small"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
              />
            </GridToolbarContainer>
          ),
        }}
      />
    </div>
  );
};
