import { z } from "zod";

export const iconLibrarySchema = z.enum(["lucide-icons", "remix-icons"]);

export const stylesSchema = z.object({
  button: z.enum(["basic"]),
  "toggle-button": z.enum(["basic"]),
  input: z.enum(["basic"]),
  modal: z.enum(["basic"]),
  popover: z.enum(["basic"]),
  tooltip: z.enum(["basic"]),
  calendar: z.enum(["basic", "cal"]),
});

export const registryThemeSchema = z.object({
  id: z.string(),
  label: z.string(),
  iconLibrary: iconLibrarySchema,
  styles: z.record(z.string(), z.string()),
});

export const registryItemTypeSchema = z.enum([
  "core",
  "component",
  "lib",
  "hook",
  "theme",
]);

export const registryItemFileSchema = z.union([
  z.object({
    path: z.string(),
    content: z.string().optional(),
    type: registryItemTypeSchema,
    target: z.string().optional(),
  }),
  z.string(),
]);

export const registryItemTailwindSchema = z.object({
  config: z.object({
    content: z.array(z.string()).optional(),
    theme: z.record(z.string(), z.any()).optional(),
    plugins: z.array(z.string()).optional(),
  }),
});

export const registryItemCssVarsSchema = z.object({
  light: z.record(z.string(), z.string()).optional(),
  dark: z.record(z.string(), z.string()).optional(),
});

export const registryItemSchema = z.object({
  name: z.string(),
  type: registryItemTypeSchema.optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema).optional(),
  tailwind: registryItemTailwindSchema.optional(),
  cssVars: registryItemCssVarsSchema.optional(),
  docs: z.string().optional(),
  templateUrl: z.string().optional(),
});

export const registrySchema = z.array(registryItemSchema);

export const registryIconLibrarySchema = z.object({
  name: z.string(),
  label: z.string(),
  dependency: z.string(),
  import: z.string(),
});

export const registryIconLibrariesSchema = z.array(registryIconLibrarySchema);

export const registryTemplateSchema = registryItemSchema.extend({
  type: z.literal("registry:template"),
  templateUrl: z.string(),
});

export const registryTemplatesSchema = z.array(registryTemplateSchema);

export const registryResolvedItemsTreeSchema = registryItemSchema.pick({
  dependencies: true,
  devDependencies: true,
  files: true,
  tailwind: true,
  cssVars: true,
  docs: true,
});
