import type { RegistryItem } from "@dotui/registry/types";

const loaderMeta = {
  name: "loader",
  type: "registry:ui",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/loader/basic.tsx",
          target: "ui/loader.tsx",
        },
      ],
    },
    dots: {
      files: [
        {
          type: "registry:ui",
          path: "ui/loader/dots.tsx",
          target: "ui/loader.tsx",
        },
      ],
    },
    line: {
      files: [
        {
          type: "registry:ui",
          path: "ui/loader/line.tsx",
          target: "ui/loader.tsx",
        },
      ],
    },
    ring: {
      files: [
        {
          type: "registry:ui",
          path: "ui/loader/ring.tsx",
          target: "ui/loader.tsx",
        },
      ],
    },
    "ring-2": {
      files: [
        {
          type: "registry:ui",
          path: "ui/loader/ring-2.tsx",
          target: "ui/loader.tsx",
        },
      ],
    },
    tailspin: {
      files: [
        {
          type: "registry:ui",
          path: "ui/loader/tailspin.tsx",
          target: "ui/loader.tsx",
        },
      ],
    },
    wave: {
      files: [
        {
          type: "registry:ui",
          path: "ui/loader/wave.tsx",
          target: "ui/loader.tsx",
        },
      ],
      dependencies: ["motion"],
    },
  },
} satisfies RegistryItem;

export default loaderMeta;
export const loaderVariants = Object.keys(
  loaderMeta.variants,
) as (keyof typeof loaderMeta.variants)[];

export type LoaderVariant = keyof typeof loaderMeta.variants;

export const defaultLoaderVariant = loaderMeta.defaultVariant;
