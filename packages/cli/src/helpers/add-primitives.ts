import { spinner } from "@clack/prompts";
import { resolvePrimitives } from "@/registry/api";
import { Config } from "@/helpers/get-config";
import { updateDeps, updateFiles } from "@/helpers/updaters";

export async function addPrimitives(
  primitives: string[],
  config: Config,
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
  const { files, dependencies } = await resolvePrimitives(primitives, config);

  addPrimitivesSpinner.message("Updating your CSS.");

  addPrimitivesSpinner.message("Updating dependencies.");
  await updateDeps(dependencies, config);

  addPrimitivesSpinner.message("Updating files.");
  await updateFiles(files ?? [], config, { overwrite: options.overwrite });

  addPrimitivesSpinner.stop(options.message);
}
