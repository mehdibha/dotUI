import type { RegistryItem } from "@dotui/registry/types";

const colorEditorMeta = {
  name: "color-editor",
  type: "registry:ui",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/color-editor/basic.tsx",
          target: "ui/color-editor.tsx",
        },
      ],
      registryDependencies: ["color-area", "color-slider", "select"],
    },
  },
} satisfies RegistryItem;

export default colorEditorMeta;

export const colorEditorVariants = Object.keys(
  colorEditorMeta.variants,
) as (keyof typeof colorEditorMeta.variants)[];

export type ColorEditorVariant = keyof typeof colorEditorMeta.variants;

export const defaultColorEditorVariant = colorEditorMeta.defaultVariant;
