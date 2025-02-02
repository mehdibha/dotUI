import { RegistryItem } from "@dotui/registry";
import { execa } from "execa";
import { Config } from "@/helpers/get-config";
import { getPackageManager } from "@/utils";

export async function updateDeps(
  dependencies: RegistryItem["dependencies"],
  config: Config
) {
  dependencies = Array.from(new Set(dependencies));
  if (!dependencies?.length) {
    return;
  }

  const packageManager = await getPackageManager(config.resolvedPaths.cwd);

  console.log(`using ${packageManager}...`);
  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...dependencies],
    {
      cwd: config.resolvedPaths.cwd,
    }
  );
}
