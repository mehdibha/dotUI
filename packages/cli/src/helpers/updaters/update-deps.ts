import { ExtendedConfig, RegistryItem } from "@dotui/schemas";
import { execa } from "execa";
import { getPackageManager } from "@/utils";

export async function updateDeps(
  dependencies: RegistryItem["deps"],
  config: ExtendedConfig
) {
  dependencies = Array.from(new Set(dependencies));
  if (!dependencies?.length) {
    return;
  }

  const packageManager = await getPackageManager(config.resolvedPaths.cwd);

  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...dependencies],
    {
      cwd: config.resolvedPaths.cwd,
    }
  );
}
