export type RegistryType = "registry:core" | "registry:hook" | "registry:lib";

export type RegistryItem = {
  name: string;
  type?: RegistryType;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: {
    path: string;
    type: RegistryType;
    target: string;
  }[];
  variants?: string[];
};

export type Registry = RegistryItem[];
