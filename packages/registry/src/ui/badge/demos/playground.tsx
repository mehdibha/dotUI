"use client";

import type { Control } from "@dotui/registry/playground";

import { Badge } from "../index";

interface BadgePlaygroundProps {
  children?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function BadgePlayground({
  children = "Badge",
  variant = "default",
}: BadgePlaygroundProps) {
  return <Badge variant={variant}>{children}</Badge>;
}

export const badgeControls: Control[] = [
  {
    type: "string",
    name: "children",
    defaultValue: "Badge",
  },
  {
    type: "enum",
    name: "variant",
    options: ["default", "success", "warning", "danger", "info"],
    defaultValue: "default",
  },
];
