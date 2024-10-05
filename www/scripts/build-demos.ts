import { existsSync, promises as fs } from "node:fs";
import path from "path";
import { rimraf } from "rimraf";
import { styles } from "@/registry/styles";
import { demos } from "@/__demos__/registry";

async function buildDemos() {
  let index = `// This file is autogenerated by scripts/build-registry.ts
  // Do not edit this file directly.
  import * as React from "react"
  
  export const Index: Record<string, any> = {
  `;

  // core demos
  index += `  core: {`;
  for (const style of styles) {
    index += `  "${style.name}": {`;

    for (const item of demos) {
      const resolveFiles = item.files?.map(
        (file) => `registry/ui/${style.name}/${file}`
      );
      if (!resolveFiles) {
        continue;
      }
      const type = "core";
      let componentPath = `@/registry/ui/${style.name}/${type}/${item.name}`;
      if (item.files) {
        const files = item.files.map((file) =>
          typeof file === "string"
            ? { type: "registry:page", path: file }
            : file
        );
        if (files?.length) {
          componentPath = `@/registry/ui/${style.name}/${files[0].path}`;
        }
      }
      index += `
    "${item.name}": {
      name: "${item.name}",
      files: [${resolveFiles.map((file) => `"${file}"`)}],
      component: React.lazy(() => import("${componentPath.replace(
        ".tsx",
        ""
      )}")),
    },`;
    }

    index += `
  },`;
  }
  index += `
  },`;

  index += `
}
`;

  const targetPath = path.join(process.cwd(), "src", "__demos__");
  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }
  rimraf.sync(path.join(targetPath, "index.tsx"));
  await fs.writeFile(path.join(targetPath, "index.tsx"), index, "utf8");
}

buildDemos();
