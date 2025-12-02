"use client";

import { PinIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { Control } from "@dotui/registry/playground";

import { ToggleButton } from "../index";

interface ToggleButtonPlaygroundProps {
  variant?: "default" | "quiet";
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  children?: ReactNode;
}

export function ToggleButtonPlayground({
  variant = "default",
  size = "md",
  isDisabled = false,
}: ToggleButtonPlaygroundProps) {
  return (
    <ToggleButton
      aria-label="Toggle pin"
      variant={variant}
      size={size}
      isDisabled={isDisabled}
    >
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}

export const toggleButtonControls: Control[] = [
  {
    type: "enum",
    name: "variant",
    options: ["default", "quiet"],
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
];
