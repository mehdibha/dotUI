import { z } from "zod";

export const registryItemTypeSchema = z.enum([
  "base",
  "core",
  "component",
  "lib",
  "hook",
  "theme",
  "icon-library",
]);

export const registryItemFileSchema = z.object({
  type: registryItemTypeSchema,
  content: z.string(),
  path: z.string(),
});

export const e = z.object({
  colors: z.object({}),
});

export const registryItemCssSchema = z.object({
  colors: z
    .object({
      light: z.record(z.string(), z.string()),
      dark: z.record(z.string(), z.string()),
    })
    .optional(),
  themeVars: z.record(z.string(), z.string()).optional(),
  keyframes: z.record(z.string(), z.string()).optional(),
});

export const registryItemSchema = z.object({
  name: z.string(),
  type: registryItemTypeSchema.optional(),
  label: z.string().optional(),
  variants: z.array(z.string()).optional(),
  description: z.string().optional(),
  deps: z.array(z.string()).optional(),
  devDeps: z.array(z.string()).optional(),
  registryDeps: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema).optional(),
  css: registryItemCssSchema.optional(),
});

export const registrySchema = z.array(registryItemSchema);

export const registryResolvedItemsTreeSchema = registryItemSchema.pick({
  deps: true,
  devDeps: true,
  files: true,
  css: true,
});

export const registryIndexSchema = z.array(
  z.object({
    name: z.string(),
    type: registryItemTypeSchema,
    deps: z.array(z.string()).optional(),
    registryDeps: z.array(z.string()).optional(),
    variants: z.array(z.string()).optional(),
  })
);

export const registryIconLibrarySchema = z.object({
  name: z.string(),
  label: z.string(),
  dependency: z.string(),
  import: z.string(),
});

export const iconLibrarySchema = z.enum(["lucide-icons", "remix-icons"]);

export const primitivesSchema = z.object({
  button: z.enum(["basic", "ripple", "brutalist"]).optional(),
  "toggle-button": z.enum(["basic"]).optional(),
  input: z.enum(["basic"]).optional(),
  modal: z.enum(["basic"]).optional(),
  popover: z.enum(["basic"]).optional(),
  tooltip: z.enum(["basic"]).optional(),
  calendar: z.enum(["basic", "cal"]).optional(),
});

export const registryThemeSchema = z.object({
  name: z.string(),
  label: z.string(),
  description: z.string().optional(),
  css: registryItemCssSchema,
  iconLibrary: iconLibrarySchema,
  primitives: primitivesSchema.optional(),
});

// ----------------------------------------------
//                   Config
// ----------------------------------------------

// we list all the possible primitives here so we can offer autocomplete in the config file

export const aliasesSchema = z.object({
  core: z.string(),
  components: z.string(),
  hooks: z.string(),
  lib: z.string(),
});

export const rawConfigSchema = z.object({
  $schema: z.string().optional(),
  css: z.string(),
  aliases: z.object({
    components: z.string(),
    core: z.string(),
    hooks: z.string(),
    lib: z.string(),
  }),
  iconLibrary: z.string().optional(),
  primitives: primitivesSchema.optional(),
});

export const extendedConfigSchema = rawConfigSchema.extend({
  resolvedPaths: z.object({
    cwd: z.string(),
    css: z.string(),
    core: z.string(),
    components: z.string(),
    hooks: z.string(),
    lib: z.string(),
    utils: z.string(),
  }),
});

// ------------------------------------------------
//                   Internal
// ------------------------------------------------

export const internalRegistryItemSchema = registryItemSchema
  .omit({
    files: true,
  })
  .extend({
    files: z.array(
      z.object({
        type: registryItemTypeSchema,
        source: z.string(),
        target: z.string(),
      })
    ),
  });

export const internalRegistrySchema = z.array(internalRegistryItemSchema);
