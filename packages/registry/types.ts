import { z } from "zod";
import {
  registrySchema,
  registryThemeSchema,
  registryItemFileSchema,
  registryItemSchema,
  registryItemTypeSchema,
} from "./schema";

export type Registry = z.infer<typeof registrySchema>;

export type RegistryItem = z.infer<typeof registryItemSchema>;

export type RegistryItemType = z.infer<typeof registryItemTypeSchema>;

export type RegistryItemFile = z.infer<typeof registryItemFileSchema>;

export type RegistryTheme = z.infer<typeof registryThemeSchema>;
