export type File = {
  name: string;
  isDir: boolean;
  mime: string;
  size: number;
  date: string;
  mode: string;
  path: string;
};

export type Clipboard = {
  files: File[];
  isCut: boolean;
};

export enum AuthStatus {
  UNAUTHORIZED,
  AUTHORIZED,
  AUTHORIZING,
}
