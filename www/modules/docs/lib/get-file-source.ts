import fs from "node:fs";
import path from "path";

export const getFileSource = (filePath: string) => {
  const fullPath = path.join(
    process.cwd(),
    "..",
    "packages",
    "ui",
    "src",
    filePath,
  );

  // console.log("filePath", filePath);
  // console.log("fullPath", fullPath);

  // return { fileName: "test", content: "test" };
  const fileContent = fs.readFileSync(fullPath, "utf-8");

  const fileName = path.basename(fullPath);

  return {
    fileName,
    content: fileContent,
  };
};
