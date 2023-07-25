import create from "zustand";

import { readApi } from "~/api";
import { joinPath } from "~/utils/helpers";
import { Clipboard, File } from "~/utils/types";

interface AppContext {
  paths: string[];
  setPaths: (paths: string[]) => void;

  cwd: () => string;
  joinCwd: (path: string) => string;

  files: File[];
  setFiles: (files: File[]) => void;

  clipboard: Clipboard;
  setClipboard: (clipboard: Clipboard) => void;
  clearClipboard: () => void;

  selectedFiles: File[];
  setSelectedFiles: (selectedFiles: File[]) => void;

  getFile: () => File | null;
  getFilePath: () => string;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;
  refresh: () => void;

  search: string;
  setSearch: (error: string) => void;

  newFile: (name?: string) => File;
  newDir: (name?: string) => File;
}

export const useAppContext = create<AppContext>((set, get) => ({
  paths: [""],
  setPaths: (paths: string[]) => set((state) => ({ ...state, paths })),

  cwd: () => get().paths.join("/"),
  joinCwd: (path: string) => joinPath(get().cwd(), path),

  files: [],
  setFiles: (files: File[]) => set((state) => ({ ...state, files })),

  clipboard: { files: [], isCut: false },
  setClipboard: (clipboard: Clipboard) =>
    set((state) => ({ ...state, clipboard })),
  clearClipboard: () =>
    set((state) => ({ ...state, clipboard: { files: [], isCut: false } })),

  selectedFiles: [],
  setSelectedFiles: (selectedFiles: File[]) =>
    set((state) => ({ ...state, selectedFiles })),

  getFile: () =>
    get().selectedFiles.length > 0 ? get().selectedFiles[0] : null,
  getFilePath: () =>
    get().selectedFiles.length > 0
      ? joinPath(get().selectedFiles[0].path, get().selectedFiles[0].name)
      : "",

  loading: false,
  setLoading: (loading: boolean) => set((state) => ({ ...state, loading })),

  search: "",
  setSearch: (search: string) => set((state) => ({ ...state, search })),

  refresh: () => {
    set((state) => ({ ...state, loading: true }));
    readApi(get().newDir()).then((files) => {
      set((state) => ({ ...state, files, loading: false }));
    });
  },
  error: null,
  setError: (error: string | null) => set((state) => ({ ...state, error })),

  newFile: (name = ""): File => ({
    name,
    isDir: false,
    mime: "",
    size: 0,
    date: new Date().toISOString(),
    mode: "644",
    path: get().cwd(),
  }),

  newDir: (name = ""): File => ({
    name,
    isDir: true,
    mime: "",
    size: 0,
    date: new Date().toISOString(),
    mode: "755",
    path: get().cwd(),
  }),
}));
