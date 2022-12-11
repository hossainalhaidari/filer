export const joinPath = (firstPath: string, secondPath: string) => {
  while (firstPath.endsWith("/")) {
    firstPath = firstPath.slice(0, -1);
  }

  while (secondPath.startsWith("/")) {
    secondPath = secondPath.slice(1);
  }

  return firstPath + "/" + secondPath;
};

export const fileSize = (bytes: number) => {
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  let l = 0;

  while (bytes >= 1024 && ++l) {
    bytes = bytes / 1024;
  }

  return bytes.toFixed(bytes < 10 && l > 0 ? 1 : 0) + " " + units[l];
};

export const modeToNumber = (mode: string) => {
  let owner = 0;
  let group = 0;
  let other = 0;

  if (mode.slice(1, 2) === "r") owner += 4;
  if (mode.slice(2, 3) === "w") owner += 2;
  if (mode.slice(3, 4) === "x") owner += 1;

  if (mode.slice(4, 5) === "r") group += 4;
  if (mode.slice(5, 6) === "w") group += 2;
  if (mode.slice(6, 7) === "x") group += 1;

  if (mode.slice(7, 8) === "r") other += 4;
  if (mode.slice(8, 9) === "w") other += 2;
  if (mode.slice(9, 10) === "x") other += 1;

  return [owner, group, other];
};
