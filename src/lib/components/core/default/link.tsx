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
    type: {
      default: "text-fg-link",
      primary: "",
    },
  },
  defaultVariants: {
    type: "default",
  },
});

export interface LinkProps extends AriaLinkProps, VariantProps<typeof linkVariants> {}

const Link = ({ type, ...props }: LinkProps) => {
  return (
    <AriaLink
      {...props}
      className={composeRenderProps(props.className, (className) =>
        linkVariants({ type, className })
      )}
    />
  );
};

export { Link, linkVariants };
