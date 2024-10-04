import { readdirSync } from "node:fs";

export const isFolderEmpty = (folderPath: string): boolean => {
  const files = readdirSync(folderPath);
  return files.length === 0;
};
