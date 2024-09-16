import { existsSync, readdirSync, promises as fs } from "fs";
import path from "path";
import { rimraf } from "rimraf";

async function buildRegistryDemos() {
  let index = `import { Registry } from "@/registry/schema";

const buildDemos = (component: string, demos: string[]): Registry => {
  return demos.map((demo) => {
    return {
      name: \`\${component}-\${demo}\`,
      type: "registry:demo",
      registryDependencies: [component],
      files: [\`core/\${component}/demos/\${demo}.tsx\`],
    };
  });
};

export const demos: Registry = [
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
    index += `  ...buildDemos("${component}", [${demos.map((demo) => `"${demo.replace(".tsx", "")}"`)}]),\n`;
  }
  index += `]
`;
  rimraf.sync(path.join(process.cwd(), "src/registry/demos.ts"));
  await fs.writeFile(path.join(process.cwd(), "src/registry/demos.ts"), index);
  console.log("✅ Done!");
}

buildRegistryDemos();
