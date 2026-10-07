import { createStyles } from "@/lib/styles"

import avatarMeta from "./meta"

const { useStyles, styles } = createStyles(avatarMeta, {
  base: {
    slots: {
      root: "group/avatar relative inline-flex size-8 shrink-0 bg-muted align-middle *:data-badge:absolute *:data-badge:not-with-[right]:not-with-[left]:right-0 *:data-badge:not-with-[bottom]:not-with-[top]:bottom-0",
      image: "aspect-square size-full rounded-[inherit] object-cover",
      fallback: [
        "flex size-full items-center justify-center rounded-[inherit] text-sm select-ui group-data-[size=sm]/avatar:text-xs",
        "group-data-[size=md]/avatar-group:text-xs group-data-[size=sm]/avatar-group:text-[0.625rem]",
      ],
      badge: [
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-fg-on-primary bg-blend-color ring-2 ring-(--surface-bg,var(--color-bg)) select-ui with-[left]:right-auto with-[top]:bottom-auto",
        "not-with-[size]:group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "not-with-[size]:group-data-[size=md]/avatar:size-2.5 group-data-[size=md]/avatar:[&>svg]:size-2",
        "not-with-[size]:group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
      ],
      group:
        "group/avatar-group flex -space-x-2 *:data-avatar:ring-2 *:data-avatar:ring-(--surface-bg,var(--color-bg))",
      groupCount: [
        "relative flex shrink-0 items-center justify-center bg-muted text-fg-muted ring-2 ring-(--surface-bg,var(--color-bg))",
        "size-8 text-sm [&>svg]:size-4",
        "group-data-[size=sm]/avatar-group:size-6 group-data-[size=sm]/avatar-group:text-[0.625rem] group-data-[size=sm]/avatar-group:[&>svg]:size-3",
        "group-data-[size=lg]/avatar-group:size-10 group-data-[size=lg]/avatar-group:text-base group-data-[size=lg]/avatar-group:[&>svg]:size-5",
      ],
    },
    // In a group the next avatar and its ring cover each one's end, so its
    // initials center on what stays visible (overlap + 2px ring).
    variants: {
      size: {
        sm: {
          group:
            "-space-x-1 *:data-avatar:size-6 *:data-avatar:not-last:*:data-avatar-fallback:pr-1.5",
          root: "size-6",
        },
        md: {
          group:
            "-space-x-1.5 *:data-avatar:size-8 *:data-avatar:not-last:*:data-avatar-fallback:pr-2",
          root: "size-8",
        },
        lg: {
          group:
            "*:data-avatar:size-10 *:data-avatar:not-last:*:data-avatar-fallback:pr-2.5",
          root: "size-10",
        },
      },
    },
  },
  params: {
    shape: {
      circle: {
        slots: { root: "rounded-full", groupCount: "rounded-full" },
      },
      // Each size takes a rung: sm the small control's, md the item's, lg
      // the control's; a group sizes (and rounds) its avatars itself.
      rounded: {
        slots: {
          groupCount: [
            "rounded-(--studio-radius-item)",
            "group-data-[size=lg]/avatar-group:rounded-(--studio-radius-control) group-data-[size=sm]/avatar-group:rounded-(--studio-radius-control-sm)",
          ],
        },
        variants: {
          size: {
            sm: {
              root: "rounded-(--studio-radius-control-sm)",
              group: "*:data-avatar:rounded-(--studio-radius-control-sm)",
            },
            md: {
              root: "rounded-(--studio-radius-item)",
              group: "*:data-avatar:rounded-(--studio-radius-item)",
            },
            lg: {
              root: "rounded-(--studio-radius-control)",
              group: "*:data-avatar:rounded-(--studio-radius-control)",
            },
          },
        },
      },
    },
    fallback: {
      neutral: { slots: { fallback: "bg-muted" } },
      // Radix Themes soft: the accent's muted fill and ink.
      accent: { slots: { fallback: "bg-accent-muted text-fg-accent" } },
    },
  },
})

export type AvatarStyles = typeof styles

export { useStyles }
