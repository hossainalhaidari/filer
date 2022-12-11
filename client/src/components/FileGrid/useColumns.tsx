import {
  Avatar,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import {
  DataArray as BinaryIcon,
  Description as DocumentIcon,
  Download as DownloadIcon,
  DriveFileRenameOutline as RenameIcon,
  Folder as FolderIcon,
  FolderZip as ArchiveIcon,
  Image as ImageIcon,
  MusicNote as MusicIcon,
  Shield as ModeIcon,
  Subject as TextIcon,
  Unarchive as UnarchiveIcon,
  Videocam as VideoIcon,
} from "@mui/icons-material";
import { green, orange } from "@mui/material/colors";

import { downloadApi } from "~/api";
import { useAppContext, useDialog } from "~/stores";
import { fileSize } from "~/utils/helpers";
import { File } from "~/utils/types";
import { isArchive, mime, MimeType } from "~/utils/mimeType";

export const useColumns = () => {
  const { paths, setPaths, setSelectedFiles, setLoading } = useAppContext();
  const {
    openExtractDialog,
    openFileDialog,
    openModeDialog,
    openRenameDialog,
  } = useDialog();

  const readFile = (file: File) => {
    if (file.isDir) {
      setPaths([...paths, file.name]);
    } else {
      setSelectedFiles([file]);

      const mimeType = mime(file.mime);
      switch (mimeType) {
        case MimeType.Archive:
          openExtractDialog();
          break;
        case MimeType.Text:
          openFileDialog();
          break;
        case MimeType.Document:
        case MimeType.Image:
        case MimeType.Music:
        case MimeType.Video:
        default:
          break;
      }
    }
  };

  const getFileIcon = (file: File) => {
    const content = () => {
      if (file.isDir) return <FolderIcon />;

      const mimeType = mime(file.mime);
      switch (mimeType) {
        case MimeType.Archive:
          return <ArchiveIcon />;
        case MimeType.Document:
          return <DocumentIcon />;
        case MimeType.Image:
          return <ImageIcon />;
        case MimeType.Music:
          return <MusicIcon />;
        case MimeType.Text:
          return <TextIcon />;
        case MimeType.Video:
          return <VideoIcon />;
        default:
          return <BinaryIcon />;
      }
    };
    return (
      <Avatar sx={{ bgcolor: file.isDir ? orange[500] : green[500] }}>
        {content()}
      </Avatar>
    );
  };

  return [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => {
        const file = params.row;

        return (
          <ListItemButton
            onClick={(e) => {
              e.stopPropagation();
              readFile(file);
            }}
          >
            <ListItemAvatar>{getFileIcon(file)}</ListItemAvatar>
            <ListItemText primary={file.name} />
          </ListItemButton>
        );
      },
    },
    {
      field: "size",
      headerName: "Size",
      valueFormatter: ({ value }) => fileSize(value),
      width: 100,
    },
    { field: "date", headerName: "Last Modified", width: 180 },
    {
      field: "mode",
      headerName: "Mode",
      width: 100,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      width: 180,
      renderCell: (params) => {
        const file = params.row as File;

        return (
          <>
            <IconButton
              aria-label="Change Mode"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFiles([file]);
                openModeDialog();
              }}
            >
              <ModeIcon />
            </IconButton>
            <IconButton
              aria-label="Rename"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFiles([file]);
                openRenameDialog();
              }}
            >
              <RenameIcon />
            </IconButton>
            {!file.isDir && (
              <IconButton
                aria-label="Download"
                onClick={async (e) => {
                  e.stopPropagation();
                  setLoading(true);
                  await downloadApi(file);
                  setLoading(false);
                }}
              >
                <DownloadIcon />
              </IconButton>
            )}
            {isArchive(file.mime) && (
              <IconButton
                aria-label="Extract"
                onClick={async (e) => {
                  e.stopPropagation();
                  setSelectedFiles([file]);
                  openExtractDialog();
                }}
              >
                <UnarchiveIcon />
              </IconButton>
            )}
          </>
        );
      },
    },
  ] as GridColDef[];
};
