import type { RegistryItem } from "@dotui/registry/types";

const commandMeta = {
  name: "command",
  type: "registry:ui",
  group: "overlays",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/command/basic.tsx",
          target: "ui/command.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default commandMeta;
export const commandVariants = Object.keys(
  commandMeta.variants,
) as (keyof typeof commandMeta.variants)[];

export type CommandVariant = keyof typeof commandMeta.variants;

export const defaultCommandVariant = commandMeta.defaultVariant;
