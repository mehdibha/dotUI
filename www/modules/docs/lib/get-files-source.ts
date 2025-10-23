import { existsSync, promises as fs, lstatSync } from "node:fs";
import path from "node:path";

export const getFilesSource = async (relativePath: string) => {
  const fullPath = getFilePath(relativePath);
  let code: { title: string; code: string }[] = [];

  // if directory, get all files
  if (existsSync(fullPath) && lstatSync(fullPath).isDirectory()) {
    const files = await fs.readdir(fullPath);
    for (const file of files) {
      const filePath = path.join(fullPath, file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      code.push({
        title: file === "index.tsx" ? `${path.basename(fullPath)}.tsx` : file,
        code: fileContent,
      });
    }
    code = code.sort((a) =>
      a.title === `${path.basename(fullPath)}.tsx` ? -1 : 1,
    );
  } else {
    // if file, get file content and name
    if (!existsSync(`${fullPath}.tsx`) && !existsSync(`${fullPath}.ts`)) {
      console.log(`${fullPath}.ts(x) does not exist`);
      return [];
    }
    // get file extension
    const fileExt = existsSync(`${fullPath}.ts`) ? "ts" : "tsx";
    const fileContent = await fs.readFile(`${fullPath}.${fileExt}`, "utf-8");
    const fileName = path.basename(fullPath);
    code = [{ title: `${fileName}.${fileExt}`, code: fileContent }];
  }
  return code;
};

const getFilePath = (relativePath: string) => {
  return path.join(process.cwd(), "src", "registry", relativePath);
};
