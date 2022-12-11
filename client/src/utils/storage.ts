const TOKEN_STORAGE_KEY = "token";

export const getStorage = (key: string, defaultValue = "") => {
  return localStorage.getItem(key) ?? defaultValue;
};

export const setStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getToken = () => getStorage(TOKEN_STORAGE_KEY);

export const setToken = (value: string) => setStorage(TOKEN_STORAGE_KEY, value);

export const clearToken = () => setStorage(TOKEN_STORAGE_KEY, "");
