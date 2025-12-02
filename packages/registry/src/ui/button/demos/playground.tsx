"use client";

import type { ReactNode } from "react";

import { Button } from "@dotui/registry/ui/button";

/**
 * Button playground component.
 * Renders a Button with optional prefix/suffix icons.
 */

interface ButtonPlaygroundProps {
  children?: string;
  variant?: "default" | "primary" | "quiet" | "link" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  isPending?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export function ButtonPlayground({
  children = "Button",
  prefix,
  suffix,
  ...props
}: ButtonPlaygroundProps) {
  return (
    <Button {...props}>
      {prefix}
      {children}
      {suffix}
    </Button>
  );
}
