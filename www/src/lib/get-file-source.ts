import fs from "fs";
import path from "path";

export const getFileSource = (filePath: string) => {
  const fullPath = path.join(process.cwd(), "src", filePath);
  const fileContent = fs.readFileSync(fullPath, "utf-8");

  const fileName = path.basename(fullPath);

  return {
    fileName,
    content: fileContent
  };
};
