import { spinner } from "@clack/prompts";

interface Config {}

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
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // const tree = await registryResolveItemsTree(primitives, config)
  // if (!tree) {
  //   registrySpinner?.fail()
  //   return handleError(new Error("Failed to fetch primitives from registry."))
  // }

  addPrimitivesSpinner.message("Updating your CSS.");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // await updateCss(tree.cssVars, config, {
  //   cleanupDefaultNextStyles: options.isNewProject,
  //   silent: options.silent,
  // })

  addPrimitivesSpinner.message("Updating dependencies.");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // await updateDependencies(tree.dependencies, config, {
  //   silent: options.silent,
  // })
  // await updateFiles(tree.files, config, {
  //   overwrite: options.overwrite,
  // })

  addPrimitivesSpinner.message("Updating files.");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // await updateFiles(tree.files, config, {
  //   overwrite: options.overwrite,
  // })
  
  addPrimitivesSpinner.stop(options.message);
}
