import { RegistryItemType } from "@dotui/registry";

export type RegistryItem = {
  name: string;
  type?: RegistryItemType;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: {
    path: string;
    type: RegistryItemType;
    target: string;
  }[];
  variants?: string[];
};

export type Registry = RegistryItem[];
