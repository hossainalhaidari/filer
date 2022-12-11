const TOKEN_STORAGE_KEY = "token";
const SERVER_STORAGE_KEY = "server";
const USER_STORAGE_KEY = "user";

export const getStorage = (key: string, defaultValue = "") => {
  return localStorage.getItem(key) ?? defaultValue;
};

export const setStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getToken = () => getStorage(TOKEN_STORAGE_KEY);

export const setToken = (value: string) => setStorage(TOKEN_STORAGE_KEY, value);

export const clearToken = () => setStorage(TOKEN_STORAGE_KEY, "");

export const getServer = () => getStorage(SERVER_STORAGE_KEY);

export const setServer = (value: string) =>
  setStorage(SERVER_STORAGE_KEY, value);

export const getUser = () => getStorage(USER_STORAGE_KEY);

export const setUser = (value: string) => setStorage(USER_STORAGE_KEY, value);
