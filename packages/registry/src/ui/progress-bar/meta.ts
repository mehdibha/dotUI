import type { RegistryItem } from "@dotui/registry/types";

const progressBarMeta = {
  name: "progress-bar",
  type: "registry:ui",
  group: "feedback",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/progress-bar/basic.tsx",
          target: "ui/progress-bar.tsx",
        },
      ],
      registryDependencies: ["field"],
    },
  },
} satisfies RegistryItem;

export default progressBarMeta;
export const progressBarVariants = Object.keys(
  progressBarMeta.variants,
) as (keyof typeof progressBarMeta.variants)[];

export type ProgressBarVariant = keyof typeof progressBarMeta.variants;

export const defaultProgressBarVariant = progressBarMeta.defaultVariant;
