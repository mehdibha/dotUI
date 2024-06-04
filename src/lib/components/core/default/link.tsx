"use client";

import * as React from "react";
import {
  Link as AriaLink,
  composeRenderProps,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "@/lib/utils/styles";

const linkVariants = tv({
  extend: focusRing,
  base: "hover:underline underline-offset-4",
  variants: {
    variant: {
      default: "text-fg-link",
      primary: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface LinkProps extends AriaLinkProps, VariantProps<typeof linkVariants> {}

const Link = ({ variant, ...props }: LinkProps) => {
  return (
    <AriaLink
      {...props}
      className={composeRenderProps(props.className, (className) =>
        linkVariants({ variant, className })
      )}
    />
  );
};

export type { LinkProps };
export { Link, linkVariants };
