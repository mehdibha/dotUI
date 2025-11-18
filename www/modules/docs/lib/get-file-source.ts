import fs from "node:fs/promises"
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
  let fileContent = await fs.readFile(fullPath, "utf-8");
  fileContent = fileContent.replaceAll(
    `@dotui/registry/`,
    "@/",
  );

  const fileName = path.basename(fullPath);

  return {
    fileName,
    content: fileContent,
  };
};
