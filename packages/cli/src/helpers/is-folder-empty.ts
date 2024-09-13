import { readdirSync } from "fs";

export const isFolderEmpty = (folderPath: string): boolean => {
  const files = readdirSync(folderPath);
  return files.length === 0;
};
