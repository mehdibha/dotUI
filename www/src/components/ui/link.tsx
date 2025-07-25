"use client";

import type { LinkProps as AriaLinkProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import * as React from "react";
import { focusRing } from "@/registry/lib/focus-styles";
import { Link as AriaLink, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";

const linkVariants = tv({
  extend: focusRing,
  base: "disabled:text-fg-disabled inline-flex items-center gap-1 transition-colors",
  variants: {
    variant: {
      accent: "text-fg-accent hover:text-[#5e9fe0]",
      quiet: "underline underline-offset-2",
      unstyled: "",
    },
  },
  defaultVariants: {
    variant: "accent",
  },
});

interface LinkProps extends AriaLinkProps, VariantProps<typeof linkVariants> {}

const Link = ({ variant, ...props }: LinkProps) => {
  return (
    <AriaLink
      {...props}
      className={composeRenderProps(props.className, (className) =>
        linkVariants({ variant, className }),
      )}
    />
  );
};

export type { LinkProps };
export { Link, linkVariants };
