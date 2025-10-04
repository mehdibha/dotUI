import type {
  Registry as ShadcnRegistry,
  RegistryItem as ShadcnRegistryItem,
} from "shadcn/schema";

export interface RegistryItem extends ShadcnRegistryItem {
  variants?: Record<string, Partial<ShadcnRegistryItem>>;
}

export interface Registry extends Omit<ShadcnRegistry, "items"> {
  items: RegistryItem[];
}
