/* The shipped source: examples/origin-next/src/components/ui/button.tsx, lines
   1–46, verbatim — what `shadcn add` writes into a consumer app. */
export const BUTTON_SOURCE = `"use client";

import type * as React from "react";
import * as ButtonPrimitive from "react-aria-components/Button";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as LinkPrimitive from "react-aria-components/Link";
import { type VariantProps, tv } from "tailwind-variants";

import { Loader } from "@/components/ui/loader";

const buttonVariants = tv({
  base: "group/button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-md bg-clip-padding font-medium whitespace-nowrap shadow-(--shadow-control,0_0_#0000) transition-[background-color,border-color,color,box-shadow,filter,scale,translate] select-ui focus-reset focus-visible:focus-ring **:[svg]:pointer-events-none **:[svg]:shrink-0 pending:cursor-pending pending:bg-disabled pending:text-transparent pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0 pending:**:data-[slot=spinner]:text-fg-muted disabled:cursor-disabled text-sm *:[svg]:not-with-[size]:size-4",
  variants: {
    variant: {
      primary:
        "bg-primary text-fg-on-primary disabled:bg-(--color-primary-disabled,var(--color-primary)) disabled:text-(--disabled-fg,var(--color-fg-on-primary)) hover:bg-primary-hover pressed:bg-primary-active",
      secondary:
        "border border-border-control bg-neutral text-fg-on-neutral disabled:border-(--disabled-border,var(--color-border-control)) disabled:bg-(--disabled-bg,var(--color-neutral)) disabled:text-(--disabled-fg,var(--color-fg-on-neutral)) pending:border-border hover:bg-neutral-hover pressed:bg-neutral-active",
      quiet:
        "bg-transparent text-fg disabled:bg-(--disabled-bg,transparent) disabled:text-(--disabled-fg,var(--color-fg)) hover:bg-inverse/10 pressed:bg-inverse/20",
      link: "text-fg underline-offset-4 hover:underline disabled:bg-(--disabled-bg,transparent) disabled:text-(--disabled-fg,var(--color-fg))",
      warning:
        "bg-warning text-fg-on-warning disabled:bg-(--disabled-bg,var(--color-warning)) disabled:text-(--disabled-fg,var(--color-fg-on-warning)) hover:bg-warning-hover pressed:bg-warning-active",
      danger:
        "bg-danger text-fg-on-danger disabled:bg-(--disabled-bg,var(--color-danger)) disabled:text-(--disabled-fg,var(--color-fg-on-danger)) hover:bg-danger-hover pressed:bg-danger-active",
    },
    size: {
      xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 data-icon-only:size-6 **:[svg]:not-with-[size]:size-3",
      sm: "h-7 gap-1 px-2.5 text-[0.8125rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5",
      md: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 data-icon-only:size-8 **:[svg]:not-with-[size]:size-3.5",
      lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 data-icon-only:size-9 **:[svg]:not-with-[size]:size-4",
    },
    isIconOnly: {
      true: "p-0",
    },
  },
  defaultVariants: {
    variant: "secondary",
    size: "md",
  },
});

export { buttonVariants as buttonStyles };

type ButtonVariants = VariantProps<typeof buttonVariants>;

`

/* The components.json `shadcn init` writes (examples/origin-next), with the
   preset token shortened to the one typed in the terminal. */
export const COMPONENTS_JSON = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@dotui": "https://dotui.org/r/{name}?preset=q1YqU7Iy0V"
  }
}`
