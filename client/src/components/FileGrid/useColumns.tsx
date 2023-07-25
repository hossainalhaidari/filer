import {
  Avatar,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import {
  Brush as GraphicIcon,
  DataArray as BinaryIcon,
  Description as DocumentIcon,
  Download as DownloadIcon,
  DriveFileRenameOutline as RenameIcon,
  Folder as FolderIcon,
  FolderZip as ArchiveIcon,
  Image as ImageIcon,
  MusicNote as AudioIcon,
  Info as DetailsIcon,
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
    openDetailsDialog,
    openExtractDialog,
    openFileDialog,
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
        case MimeType.Audio:
        case MimeType.Document:
        case MimeType.Graphic:
        case MimeType.Image:
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
        case MimeType.Audio:
          return <AudioIcon />;
        case MimeType.Document:
          return <DocumentIcon />;
        case MimeType.Graphic:
          return <GraphicIcon />;
        case MimeType.Image:
          return <ImageIcon />;
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

  const downloadFile = async (file: File) => {
    setLoading(true);
    const res = await downloadApi(file);
    const href = URL.createObjectURL(res);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    setLoading(false);
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
      field: "path",
      headerName: "Path",
      flex: 1,
    },
    {
      field: "size",
      headerName: "Size",
      valueFormatter: ({ value }) => fileSize(value),
      width: 100,
    },
    { field: "date", headerName: "Last Modified", width: 180 },
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
              aria-label="Details"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFiles([file]);
                openDetailsDialog();
              }}
            >
              <DetailsIcon />
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
                  await downloadFile(file);
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
