import type { RegistryItem } from "@dotui/registry/types";

const fileTriggerMeta = {
  name: "file-trigger",
  type: "registry:ui",
  group: "buttons",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/file-trigger/basic.tsx",
          target: "ui/file-trigger.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default fileTriggerMeta;
export const fileTriggerVariants = Object.keys(
  fileTriggerMeta.variants,
) as (keyof typeof fileTriggerMeta.variants)[];

export type FileTriggerVariant = keyof typeof fileTriggerMeta.variants;

export const defaultFileTriggerVariant = fileTriggerMeta.defaultVariant;
