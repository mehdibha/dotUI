import { type Config } from "@/helpers/get-config";
import { handleError } from "@/helpers/handle-error";
import { registryResolveItemsTree } from "@/helpers/registry";
import { spinner } from "@/utils/spinner";
import { updateCssVars } from "@/helpers/updaters/update-css-vars";
import { updateDependencies } from "@/helpers/updaters/update-dependencies";
import { updateFiles } from "@/helpers/updaters/update-files";
import { updateTailwindConfig } from "@/helpers/updaters/update-tailwind-config";

export async function addComponents(
  components: string[],
  config: Config,
  options: {
    overwrite?: boolean;
  }
) {
  options = {
    overwrite: false,
    ...options,
  };

  const registrySpinner = spinner(`Checking registry.`)?.start();
  const tree = await registryResolveItemsTree(components, config);
  if (!tree) {
    registrySpinner?.fail();
    return handleError(new Error("Failed to fetch components from registry."));
  }
  registrySpinner?.succeed();

  await updateTailwindConfig(tree.tailwind?.config, config);
  await updateCssVars(tree.cssVars, config);
  await updateDependencies(tree.dependencies, config);
  await updateFiles(tree.files, config, {
    overwrite: options.overwrite,
  });
}
