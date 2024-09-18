import { Config } from "@/helpers/get-config";
import { getPackageManager } from "@/helpers/get-pkg-manager";
import { RegistryItem } from "@/helpers/registry/schema";
import { spinner } from "@/utils";
import { execa } from "execa";

export async function updateDependencies(
  dependencies: RegistryItem["dependencies"],
  config: Config
) {
  dependencies = Array.from(new Set(dependencies));
  if (!dependencies?.length) {
    return;
  }

  const dependenciesSpinner = spinner(`Installing dependencies.`)?.start();
  const packageManager = await getPackageManager(config.resolvedPaths.cwd);
  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...dependencies],
    {
      cwd: config.resolvedPaths.cwd,
    }
  );
  dependenciesSpinner?.succeed();
}
