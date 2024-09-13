import fs from "fs-extra";
import path from "path";

export const isEmptyProject = (cwd: string) => {
  return (
    !fs.existsSync(cwd) || !fs.existsSync(path.resolve(cwd, "package.json"))
  );
};
