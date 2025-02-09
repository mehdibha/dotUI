import { spinner } from "@clack/prompts";
import { ExtendedConfig } from "@dotui/schemas";
import { resolvePrimitives } from "@/registry/api";
import { updateDeps, updateFiles } from "@/helpers/updaters";

export async function addPrimitives(
  primitives: string[],
  config: ExtendedConfig,
  options?: {
    overwrite?: boolean;
    message?: string;
  }
) {
  options = {
    overwrite: false,
    message: "Adding primitives.",
    ...options,
  };

  const addPrimitivesSpinner = spinner();

  addPrimitivesSpinner.start(options.message);
  addPrimitivesSpinner.message("Cheking registry");
  const { files, deps } = await resolvePrimitives(primitives, config);

  addPrimitivesSpinner.message("Updating your CSS.");

  addPrimitivesSpinner.message("Updating dependencies.");
  await updateDeps(deps, config);

  addPrimitivesSpinner.message("Updating files.");
  await updateFiles(files ?? [], config, { overwrite: options.overwrite });

  addPrimitivesSpinner.stop(options.message);
}
