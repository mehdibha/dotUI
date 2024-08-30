import { existsSync, promises as fs } from "fs"
import path from "path"
import {
  DEFAULT_COMPONENTS,
  DEFAULT_TAILWIND_CONFIG,
  DEFAULT_TAILWIND_CSS,
  DEFAULT_UTILS,
  getConfig,
  rawConfigSchema,
  resolveConfigPaths,
  type Config,
} from "@/src/utils/get-config"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { getProjectConfig, preFlight } from "@/src/utils/get-project-info"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import {
  getRegistryBaseColor,
  getRegistryIconLibraries,
  getRegistryStyles,
} from "@/src/utils/registry"
import * as templates from "@/src/utils/templates"
import chalk from "chalk"
import { Command } from "commander"
import { execa } from "execa"
import template from "lodash.template"
import ora from "ora"
import prompts from "prompts"
import { z } from "zod"
import { applyPrefixesCss } from "../utils/transformers/transform-tw-prefix"

//TODO: add more
const PROJECT_DEPENDENCIES = [
  "tailwindcss-animate",
  "tailwind-variants",
  "clsx",
  "tailwind-merge",
]

const initOptionsSchema = z.object({
  cwd: z.string(),
  yes: z.boolean(),
  defaults: z.boolean(),
})

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-d, --defaults,", "use default configuration.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (opts) => {
    try {
      const options = initOptionsSchema.parse(opts)
      const cwd = path.resolve(options.cwd)

      // Ensure target directory exists.
      if (!existsSync(cwd)) {
        logger.error(`The path ${cwd} does not exist. Please try again.`)
        process.exit(1)
      }

      preFlight(cwd)

      const projectConfig = await getProjectConfig(cwd)
      if (projectConfig) {
        const config = await promptForMinimalConfig(
          cwd,
          projectConfig,
          opts.defaults
        )
        await runInit(cwd, config)
      } else {
        // Read config.
        const existingConfig = await getConfig(cwd)
        const config = await promptForConfig(cwd, existingConfig, options.yes)
        await runInit(cwd, config)
      }

      logger.info("")
      logger.info(
        `${chalk.green(
          "Success!"
        )} Project initialization completed. You may now add components.`
      )
      logger.info("")
    } catch (error) {
      handleError(error)
    }
  })

export async function promptForConfig(
  cwd: string,
  defaultConfig: Config | null = null,
  skip = false
) {
  const highlight = (text: string) => chalk.green(text)

  const styles = await getRegistryStyles()
  const iconsLibraries = await getRegistryIconLibraries()

  const options = await prompts([
    {
      type: "toggle",
      name: "typescript",
      message: `Would you like to use ${highlight(
        "TypeScript"
      )} (recommended)?`,
      initial: defaultConfig?.tsx ?? true,
      active: "yes",
      inactive: "no",
    },
    {
      type: "select",
      name: "style",
      message: `Which ${highlight("style")} would you like to use?`,
      choices: styles.map((style) => ({
        title: style.label,
        value: style.name,
      })),
    },
    {
      type: "select",
      name: "iconLibrary",
      message: `Which ${highlight("icon library")} would you like to use?`,
      choices: iconsLibraries.map((library) => ({
        title: library.label,
        value: library.name,
      })),
    },
    {
      type: "text",
      name: "tailwindCss",
      message: `Where is your ${highlight("global CSS")} file?`,
      initial: defaultConfig?.tailwind.css ?? DEFAULT_TAILWIND_CSS,
    },
    {
      type: "text",
      name: "tailwindPrefix",
      message: `Are you using a custom ${highlight(
        "tailwind prefix eg. tw-"
      )}? (Leave blank if not)`,
      initial: "",
    },
    {
      type: "text",
      name: "tailwindConfig",
      message: `Where is your ${highlight("tailwind.config.js")} located?`,
      initial: defaultConfig?.tailwind.config ?? DEFAULT_TAILWIND_CONFIG,
    },
    {
      type: "text",
      name: "components",
      message: `Configure the import alias for ${highlight("components")}:`,
      initial: defaultConfig?.aliases["components"] ?? DEFAULT_COMPONENTS,
    },
    {
      type: "text",
      name: "utils",
      message: `Configure the import alias for ${highlight("utils")}:`,
      initial: defaultConfig?.aliases["utils"] ?? DEFAULT_UTILS,
    },
    {
      type: "toggle",
      name: "rsc",
      message: `Are you using ${highlight("React Server Components")}?`,
      initial: defaultConfig?.rsc ?? true,
      active: "yes",
      inactive: "no",
    },
  ])

  const config = rawConfigSchema.parse({
    $schema: "http://localhost:3000/schema.json",
    style: options.style,
    tailwind: {
      config: options.tailwindConfig,
      css: options.tailwindCss,
      prefix: options.tailwindPrefix,
    },
    rsc: options.rsc,
    tsx: options.typescript,
    aliases: {
      utils: options.utils,
      components: options.components,
    },
  })

  if (!skip) {
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: `Write configuration to ${highlight(
        "components.json"
      )}. Proceed?`,
      initial: true,
    })

    if (!proceed) {
      process.exit(0)
    }
  }

  // Write to file.
  logger.info("")
  const spinner = ora(`Writing components.json...`).start()
  const targetPath = path.resolve(cwd, "components.json")
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), "utf8")
  spinner.succeed()

  return await resolveConfigPaths(cwd, config)
}

export async function promptForMinimalConfig(
  cwd: string,
  defaultConfig: Config,
  defaults = false
) {
  const highlight = (text: string) => chalk.cyan(text)
  let style = defaultConfig.style
  let iconLibrary = defaultConfig.iconLibrary

  if (!defaults) {
    const styles = await getRegistryStyles()
    const iconLibraries = await getRegistryIconLibraries()

    const options = await prompts([
      {
        type: "select",
        name: "style",
        message: `Which ${highlight("style")} would you like to use?`,
        choices: styles.map((style) => ({
          title: style.label,
          value: style.name,
        })),
      },
      {
        type: "select",
        name: "iconLibrary",
        message: `Which ${highlight("icon library")} would you like to use?`,
        choices: iconLibraries.map((library) => ({
          title: library.label,
          value: library.name,
        })),
      },
    ])
    style = options.style
    iconLibrary = options.iconLibrary
  }

  const config = rawConfigSchema.parse({
    $schema: defaultConfig?.$schema,
    style,
    iconLibrary,
    tailwind: {
      ...defaultConfig?.tailwind,
    },
    rsc: defaultConfig?.rsc,
    tsx: defaultConfig?.tsx,
    aliases: defaultConfig?.aliases,
  })

  // Write to file.
  logger.info("")
  const spinner = ora(`Writing components.json...`).start()
  const targetPath = path.resolve(cwd, "components.json")
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), "utf8")
  spinner.succeed()

  return await resolveConfigPaths(cwd, config)
}

export async function runInit(cwd: string, config: Config) {
  const spinner = ora(`Initializing project...`)?.start()

  // Ensure all resolved paths directories exist.
  for (const [key, resolvedPath] of Object.entries(config.resolvedPaths)) {
    // Determine if the path is a file or directory.
    // TODO: is there a better way to do this?
    let dirname = path.extname(resolvedPath)
      ? path.dirname(resolvedPath)
      : resolvedPath

    // If the utils alias is set to something like "@/lib/utils",
    // assume this is a file and remove the "utils" file name.
    // TODO: In future releases we should add support for individual utils.
    // if (key === "utils" && resolvedPath.endsWith("/utils")) {
    //   // Remove /utils at the end.
    //   dirname = dirname.replace(/\/utils$/, "")
    // }

    if (!existsSync(dirname)) {
      await fs.mkdir(dirname, { recursive: true })
    }
  }

  const extension = config.tsx ? "ts" : "js"

  const tailwindConfigExtension = path.extname(
    config.resolvedPaths.tailwindConfig
  )

  let tailwindConfigTemplate: string
  if (tailwindConfigExtension === ".ts") {
    tailwindConfigTemplate = templates.TAILWIND_CONFIG_TS_WITH_VARIABLES
  } else {
    tailwindConfigTemplate = templates.TAILWIND_CONFIG_WITH_VARIABLES
  }

  // Write tailwind config.
  await fs.writeFile(
    config.resolvedPaths.tailwindConfig,
    template(tailwindConfigTemplate)({
      extension,
      prefix: config.tailwind.prefix,
    }),
    "utf8"
  )

  // write css file
  const baseColor = await getRegistryBaseColor("default")
    await fs.writeFile(
      config.resolvedPaths.tailwindCss,
       config.tailwind.prefix
          ?  applyPrefixesCss(baseColor.cssVarsTemplate, config.tailwind.prefix)
          : baseColor.cssVarsTemplate,
      "utf8"
    )

  // Write cn file.
  await fs.writeFile(
    `${config.resolvedPaths.utils}/cn.${extension}`,
    extension === "ts" ? templates.UTILS_CN : templates.UTILS_CN_JS,
    "utf8"
  )

  // Write styles file.
  await fs.writeFile(
    `${config.resolvedPaths.utils}/styles.${extension}`,
    templates.UTILS_STYLES,
    "utf8"
  )

  spinner?.succeed()

  // Install dependencies.
  const dependenciesSpinner = ora(`Installing dependencies...`)?.start()
  const packageManager = await getPackageManager(cwd)

  const iconLibraries = await getRegistryIconLibraries()
  const selectedIconLibrary = iconLibraries.find(
    (library) => library.name === config.iconLibrary
  )
  const iconLibraryDep = selectedIconLibrary?.dep ?? "lucide-react"

  // TODO: add support for other icon libraries.
  const deps = [
    ...PROJECT_DEPENDENCIES,
    iconLibraryDep
  ]

  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...deps],
    {
      cwd,
    }
  )
  dependenciesSpinner?.succeed()
}
