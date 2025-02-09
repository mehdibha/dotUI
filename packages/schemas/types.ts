import { z } from "zod";
import * as schemas from "./schema";

export type RegistryItemType = z.infer<typeof schemas.registryItemTypeSchema>;
export type RegistryItemFile = z.infer<typeof schemas.registryItemFileSchema>;
export type RegistryItemCss = z.infer<typeof schemas.registryItemCssSchema>;
export type RegistryItem = z.infer<typeof schemas.registryItemSchema>;
export type Registry = z.infer<typeof schemas.registrySchema>;
export type RegistryResolvedItemsTree = z.infer<
  typeof schemas.registryResolvedItemsTreeSchema
>;
export type RegistryIndex = z.infer<typeof schemas.registryIndexSchema>;
export type IconLibrary = z.infer<typeof schemas.iconLibrarySchema>;
export type Primitives = z.infer<typeof schemas.primitivesSchema>;
export type RegistryTheme = z.infer<typeof schemas.registryThemeSchema>;
export type Aliases = z.infer<typeof schemas.aliasesSchema>;
export type RawConfig = z.infer<typeof schemas.rawConfigSchema>;
export type ExtendedConfig = z.infer<typeof schemas.extendedConfigSchema>;

export type InternalRegistryItem = z.infer<
  typeof schemas.internalRegistryItemSchema
>;
export type InternalRegistry = z.infer<typeof schemas.internalRegistrySchema>;
