import { type Config } from "@/helpers/get-config"
import { handleError } from "@/helpers/handle-error"
import { registryResolveItemsTree } from "@/helpers/registry"
import { spinner } from "@/utils/spinner"
import { updateCssVars } from "@/helpers/updaters/update-css-vars"
import { updateDependencies } from "@/helpers/updaters/update-dependencies"
import { updateFiles } from "@/helpers/updaters/update-files"
import { updateTailwindConfig } from "@/helpers/updaters/update-tailwind-config"

export async function addComponents(
  components: string[],
  config: Config,
  options: {
    overwrite?: boolean
    silent?: boolean
    isNewProject?: boolean
  }
) {
  options = {
    overwrite: false,
    silent: false,
    isNewProject: false,
    ...options,
  }

  const registrySpinner = spinner(`Checking registry.`, {
    silent: options.silent,
  })?.start()
  const tree = await registryResolveItemsTree(components, config)
  if (!tree) {
    registrySpinner?.fail()
    return handleError(new Error("Failed to fetch components from registry."))
  }
  registrySpinner?.succeed()

  await updateTailwindConfig(tree.tailwind?.config, config, {
    silent: options.silent,
  })
  await updateCssVars(tree.cssVars, config, {
    cleanupDefaultNextStyles: options.isNewProject,
    silent: options.silent,
  })
  await updateDependencies(tree.dependencies, config, {
    silent: options.silent,
  })
  await updateFiles(tree.files, config, {
    overwrite: options.overwrite,
    silent: options.silent,
  })
}
