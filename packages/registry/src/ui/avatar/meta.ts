import type { RegistryItem } from "@dotui/registry/types";

const avatarMeta = {
  name: "avatar",
  type: "registry:ui",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/avatar/basic.tsx",
          target: "ui/avatar.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default avatarMeta;
export const avatarVariants = Object.keys(
  avatarMeta.variants,
) as (keyof typeof avatarMeta.variants)[];

export type AvatarVariant = keyof typeof avatarMeta.variants;

export const defaultAvatarVariant = avatarMeta.defaultVariant;
