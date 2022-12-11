const MIME_ARCHIVE = [
  "application/zip",
  "application/x-zip-compressed",
  "application/x-7z-compressed",
  "application/x-installshield",
  "application/lzip",
  "application/x-lzip",
  "application/x-xz",
  "application/x-rar",
  "application/x-rar-compressed",
  "application/gzip",
  "application/x-gzip",
  "application/x-gunzip",
  "application/gzipped",
  "application/gzip-compressed",
  "application/x-gzip-compressed",
  "gzip/document",
  "application/x-bzip2",
  "application/x-tar",
];
const MIME_BINARY = ["application/octet-stream"];
const MIME_DOCUMENT = [
  "application/pdf",
  "application/x-pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/epub+zip",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.text-template",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.spreadsheet-template",
  "application/vnd.oasis.opendocument.presentation",
  "application/vnd.oasis.opendocument.presentation-template",
  "application/vnd.oasis.opendocument.graphics",
  "application/vnd.oasis.opendocument.graphics-template",
  "application/vnd.oasis.opendocument.formula",
  "application/vnd.oasis.opendocument.chart",
  "application/vnd.sun.xml.calc",
];
const MIME_IMAGE = ["image/gif", "image/png", "image/jpeg"];
const MIME_MUSIC = ["application/ogg", "audio/aac", "audio/ogg", "audio/wav"];
const MIME_TEXT = [
  "text/plain",
  "application/json",
  "text/csv",
  "application/javascript",
  "application/x-javascript",
  "text/javascript",
  "text/x-php",
  "text/rss",
  "application/rss+xml",
  "text/xml",
  "text/html",
  "text/x-python",
  "text/x-script.python",
  "application/x-python",
];
const MIME_VIDEO = [
  "audio/mp4",
  "audio/x-m4a",
  "audio/x-mp4a",
  "video/x-matroska",
  "video/ogg",
];

export enum MimeType {
  Archive,
  Binary,
  Document,
  Image,
  Music,
  Text,
  Video,
}

const stripMime = (mime: string) => mime.split(";")[0];

export const mime = (mime: string) => {
  mime = stripMime(mime);

  if (isArchive(mime)) return MimeType.Archive;
  if (isDocument(mime)) return MimeType.Document;
  if (isImage(mime)) return MimeType.Image;
  if (isMusic(mime)) return MimeType.Music;
  if (isText(mime)) return MimeType.Text;
  if (isVideo(mime)) return MimeType.Video;

  return MimeType.Binary;
};

export const isArchive = (mime: string) =>
  MIME_ARCHIVE.includes(stripMime(mime));
export const isBinary = (mime: string) => MIME_BINARY.includes(stripMime(mime));
export const isDocument = (mime: string) =>
  MIME_DOCUMENT.includes(stripMime(mime));
export const isImage = (mime: string) => MIME_IMAGE.includes(stripMime(mime));
export const isMusic = (mime: string) => MIME_MUSIC.includes(stripMime(mime));
export const isText = (mime: string) => MIME_TEXT.includes(stripMime(mime));
export const isVideo = (mime: string) => MIME_VIDEO.includes(stripMime(mime));
