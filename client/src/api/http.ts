import axios, { AxiosProgressEvent, AxiosRequestConfig } from "axios";

import { getServer, getToken } from "~/utils/storage";

export const get = async (
  endpoint: string,
  withToken = true,
  config?: AxiosRequestConfig
) => {
  const res = await axios.get(getServer() + endpoint, {
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
  const res = await axios.post(getServer() + endpoint, data, {
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

  const res = await axios.post(getServer() + endpoint, formData, {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`,
    },
    onUploadProgress,
  });
  return res.data;
};
