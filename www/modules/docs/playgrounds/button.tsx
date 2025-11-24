"use client";

import type { ReactNode } from "react";

import { Button } from "@dotui/registry/ui/button";

import type { Control } from "../interactive-demo/types";

/**
 * Button playground component.
 * Renders a Button with optional prefix/suffix icons.
 */

interface ButtonPlaygroundProps {
  children?: string;
  variant?: "default" | "primary" | "quiet" | "link" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  isPending?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

// Add import path metadata for the code serializer
Button.__importPath = "@dotui/registry/ui/button";

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

/**
 * Controls for the Button playground.
 */
export const buttonControls: Control[] = [
  {
    type: "string",
    name: "children",
    label: "Text",
    defaultValue: "Button",
  },
  {
    type: "enum",
    name: "variant",
    label: "Variant",
    options: ["default", "primary", "quiet", "link", "success", "warning", "danger"],
    defaultValue: "default",
  },
  {
    type: "enum",
    name: "size",
    label: "Size",
    options: ["sm", "md", "lg"],
    defaultValue: "md",
  },
  {
    type: "boolean",
    name: "isDisabled",
    label: "Disabled",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isPending",
    label: "Pending",
    defaultValue: false,
  },
  {
    type: "icon",
    name: "prefix",
    label: "Prefix Icon",
  },
  {
    type: "icon",
    name: "suffix",
    label: "Suffix Icon",
  },
];

