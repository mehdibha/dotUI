import { extractPreviewSource } from "@/modules/docs/demo/source-transforms";
import fs from "node:fs/promises";
import path from "node:path";

export const getFileSource = async (filePath: string) => {
  const fullPath = path.join(
    process.cwd(),
    "..",
    "packages",
    "registry",
    "src",
    filePath,
  );
  const fileName = path.basename(fullPath);
  let fileContent = await fs.readFile(fullPath, "utf-8");

  // Update imports
  fileContent = fileContent.replaceAll(`@dotui/registry/`, "@/");
  // Replace export default with export.
  fileContent = fileContent.replaceAll("export default", "export");
  // Remove final newline.
  fileContent = fileContent.replace(/\n$/, "");

  // preview is same as file content but without imports and without export default function ComponentName() { return()}, we only keep what's inside the return statement
  const preview = extractPreviewSource(fileContent);

  return {
    fileName,
    content: fileContent,
    preview,
  };
};
