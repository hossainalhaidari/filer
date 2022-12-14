import create from "zustand";

interface Dialog {
  compressDialog: boolean;
  openCompressDialog: () => void;
  closeCompressDialog: () => void;

  deleteDialog: boolean;
  openDeleteDialog: () => void;
  closeDeleteDialog: () => void;

  detailsDialog: boolean;
  openDetailsDialog: () => void;
  closeDetailsDialog: () => void;

  extractDialog: boolean;
  openExtractDialog: () => void;
  closeExtractDialog: () => void;

  fileDialog: boolean;
  openFileDialog: () => void;
  closeFileDialog: () => void;

  modeDialog: boolean;
  openModeDialog: () => void;
  closeModeDialog: () => void;

  newFileDialog: boolean;
  openNewFileDialog: () => void;
  closeNewFileDialog: () => void;

  newFolderDialog: boolean;
  openNewFolderDialog: () => void;
  closeNewFolderDialog: () => void;

  renameDialog: boolean;
  openRenameDialog: () => void;
  closeRenameDialog: () => void;
}

export const useDialog = create<Dialog>((set) => ({
  compressDialog: false,
  openCompressDialog: () =>
    set((state) => ({ ...state, compressDialog: true })),
  closeCompressDialog: () =>
    set((state) => ({ ...state, compressDialog: false })),

  deleteDialog: false,
  openDeleteDialog: () => set((state) => ({ ...state, deleteDialog: true })),
  closeDeleteDialog: () => set((state) => ({ ...state, deleteDialog: false })),

  detailsDialog: false,
  openDetailsDialog: () => set((state) => ({ ...state, detailsDialog: true })),
  closeDetailsDialog: () =>
    set((state) => ({ ...state, detailsDialog: false })),

  extractDialog: false,
  openExtractDialog: () => set((state) => ({ ...state, extractDialog: true })),
  closeExtractDialog: () =>
    set((state) => ({ ...state, extractDialog: false })),

  fileDialog: false,
  openFileDialog: () => set((state) => ({ ...state, fileDialog: true })),
  closeFileDialog: () => set((state) => ({ ...state, fileDialog: false })),

  modeDialog: false,
  openModeDialog: () => set((state) => ({ ...state, modeDialog: true })),
  closeModeDialog: () => set((state) => ({ ...state, modeDialog: false })),

  newFileDialog: false,
  openNewFileDialog: () => set((state) => ({ ...state, newFileDialog: true })),
  closeNewFileDialog: () =>
    set((state) => ({ ...state, newFileDialog: false })),

  newFolderDialog: false,
  openNewFolderDialog: () =>
    set((state) => ({ ...state, newFolderDialog: true })),
  closeNewFolderDialog: () =>
    set((state) => ({ ...state, newFolderDialog: false })),

  renameDialog: false,
  openRenameDialog: () => set((state) => ({ ...state, renameDialog: true })),
  closeRenameDialog: () => set((state) => ({ ...state, renameDialog: false })),
}));
