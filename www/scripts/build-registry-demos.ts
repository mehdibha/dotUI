import { existsSync, readdirSync, promises as fs } from "node:fs";
import path from "path";
import { rimraf } from "rimraf";

async function buildRegistryDemos() {
  let index = `
type RegistryDemoItem = {
  name: string;
  files: string[];
};

type RegistryDemos =  RegistryDemoItem[];

const buildDemos = (component: string, demos: string[]): RegistryDemos => {
  return demos.map((demo) => {
    return {
      name: \`\${component}-\${demo}\`,
      files: [\`core/\${component}/demos/\${demo}.tsx\`],
    };
  });
};

export const demos: RegistryDemos = [
`;

  const components = readdirSync(
    path.join(process.cwd(), "src/registry/ui/default/core")
  );
  for (const component of components) {
    if (
      !existsSync(
        path.join(
          process.cwd(),
          "src/registry/ui/default/core",
          component,
          "demos"
        )
      )
    ) {
      continue;
    }
    const demos = readdirSync(
      path.join(
        process.cwd(),
        "src/registry/ui/default/core",
        component,
        "demos"
      )
    );
    index += `  ...buildDemos("${component}", [${demos.map(
      (demo) => `"${demo.replace(".tsx", "")}"`
    )}]),\n`;
  }
  index += `]
`;
  rimraf.sync(path.join(process.cwd(), "src/__demos__/registry.ts"));
  await fs.writeFile(
    path.join(process.cwd(), "src/__demos__/registry.ts"),
    index
  );
  console.log("✅ Done!");
}

buildRegistryDemos();
