import { existsSync, promises as fs } from "node:fs";
import path from "node:path";
import { rimraf } from "rimraf";

const INTERNAL_REGISTRY_PATH = path.join(process.cwd(), "src/__registry__");
const SOURCE_REGISTRY_PATH = path.join(process.cwd(), "src/registry");

// ----------------------------------------------------------------------------
//
// ----------------------------------------------------------------------------
async function buildRegistryDirectory() {
  const targetPath = INTERNAL_REGISTRY_PATH;
  rimraf.sync(targetPath);
  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }
}

// ----------------------------------------------------------------------------
//
// ----------------------------------------------------------------------------
async function buildCoreComponents() {
  const sourcePath = path.join(SOURCE_REGISTRY_PATH, "core");
  const targetPath = path.join(INTERNAL_REGISTRY_PATH, "core");
  rimraf.sync(targetPath);
  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }

  const files = await fs.readdir(sourcePath);
  for (const file of files) {
    const sourceFilePath = path.join(sourcePath, file);
    const targetFilePath = path.join(targetPath, file);

    let content = await fs.readFile(sourceFilePath, "utf-8");

    // transform icons import
    content = content.replace(/lucide-react/g, "@/__registry__/icons");
    // transform registryDependencies import
    content = content.replace(/@\/registry\/core\/([a-zA-Z]+)-\d+/g, '@/__registry__/core/$1');
    await fs.writeFile(targetFilePath, content);
  }
}

async function run() {
  try {
    await buildRegistryDirectory();
    await buildCoreComponents();
    console.log("✅ Done!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
