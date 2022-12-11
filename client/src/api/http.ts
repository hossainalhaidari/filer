import axios, { AxiosProgressEvent, AxiosRequestConfig } from "axios";

import { getToken } from "~/utils/storage";

const API_HOST = import.meta.env.VITE_API_HOST;

export const get = async (
  endpoint: string,
  withToken = true,
  config?: AxiosRequestConfig
) => {
  const res = await axios.get(API_HOST + endpoint, {
    ...config,
    headers: {
      "Content-Type": "application/json",
      Authorization: withToken ? `Bearer ${getToken()}` : "",
    },
  });
  return res.data;
};

export const post = async (
  endpoint: string,
  data?: unknown,
  withToken = true,
  config?: AxiosRequestConfig
) => {
  const res = await axios.post(API_HOST + endpoint, data, {
    ...config,
    headers: {
      "Content-Type": "application/json",
      Authorization: withToken ? `Bearer ${getToken()}` : "",
    },
  });
  return res.data;
};

export const upload = async (
  endpoint: string,
  files: FileList,
  outputPath: string,
  onUploadProgress?: (event: AxiosProgressEvent) => void,
  config?: AxiosRequestConfig
) => {
  const formData = new FormData();
  formData.append("outputPath", outputPath);
  [...files].forEach((file) => formData.append("files", file));

  const res = await axios.post(API_HOST + endpoint, formData, {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: getToken(),
    },
    onUploadProgress,
  });
  return res.data;
};
