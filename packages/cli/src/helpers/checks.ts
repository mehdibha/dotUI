import fs from "fs-extra";
import path from "path";

export const checkEmptyProject = (cwd: string) => {
  return (
    !fs.existsSync(cwd) || !fs.existsSync(path.resolve(cwd, "package.json"))
  );
};
