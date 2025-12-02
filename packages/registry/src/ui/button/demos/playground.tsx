"use client";

import type { ReactNode } from "react";

import type { Control } from "@dotui/registry/playground";

import { Button } from "../index";

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

/**
 * Controls for the Button playground.
 */
export const buttonControls: Control[] = [
  {
    type: "string",
    name: "children",
    defaultValue: "Button",
  },
  {
    type: "enum",
    name: "variant",
    options: [
      "default",
      "primary",
      "quiet",
      "link",
      "success",
      "warning",
      "danger",
    ],
    defaultValue: "default",
  },
  {
    type: "enum",
    name: "size",
    options: ["sm", "md", "lg"],
    defaultValue: "md",
  },
  {
    type: "boolean",
    name: "isDisabled",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isPending",
    defaultValue: false,
  },
  {
    type: "icon",
    name: "prefix",
  },
  {
    type: "icon",
    name: "suffix",
  },
];
