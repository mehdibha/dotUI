export type RegistryItemType =
  | "registry:style"
  | "registry:ui"
  | "registry:hook"
  | "registry:lib"
  | "registry:block"
  | "registry:page"
  | "registry:component";

export type RegistryFile = {
  type: RegistryItemType;
  path: string;
  target: string;
};

export type RegistryItemProps = {
  name: string;
  title?: string;
  extends?: string;
  type: RegistryItemType;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
};

export type RegistryItem =
  | RegistryItemProps
  | {
      name: string;
      type: RegistryItemType;
      styles: RegistryItemProps[];
    };

export type Registry = RegistryItem[];

export function hasStyles(
  item: RegistryItem
): item is Extract<RegistryItem, { styles: RegistryItemProps[] }> {
  return "styles" in item;
}
