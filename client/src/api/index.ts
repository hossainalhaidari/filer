import { AxiosProgressEvent } from "axios";

import { get, post, upload } from "./http";

import { File } from "~/utils/types";

export const loginApi = async (username: string, password: string) =>
  await post("/login", { username, password }, false);

export const validateApi = async () => await get("/validate");

export const readApi = async (file: File) => await post("/read", { file });

export const createApi = async (file: File) => await post("/create", { file });

export const updateApi = async (file: File, content: string) =>
  await post("/update", { file, content });

export const deleteApi = async (files: File[]) =>
  await post("/delete", { files });

export const renameApi = async (file: File, newName: string) =>
  await post("/rename", { file, newName });

export const copyApi = async (files: File[], toPath: string) =>
  await post("/copy", { files, toPath });

export const moveApi = async (files: File[], toPath: string) =>
  await post("/move", { files, toPath });

export const chmodApi = async (files: File[], mode: string) =>
  await post("/chmod", { files, mode });

export const downloadApi = async (file: File) =>
  await post("/download", { file }, true, {
    responseType: "blob",
  });

export const uploadApi = async (
  files: FileList,
  outputPath: string,
  onUploadProgress?: (event: AxiosProgressEvent) => void
) => await upload("/upload", files, outputPath, onUploadProgress);

export const compressApi = async (files: File[], outputPath: string) =>
  await post("/compress", { files, outputPath });

export const extractApi = async (file: File, outputPath: string) =>
  await post("/extract", { file, outputPath });
