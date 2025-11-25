"use client";

import type { Control } from "@dotui/registry/playground";

import { Avatar } from "../index";

interface AvatarPlaygroundProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

export function AvatarPlayground({
  src = "https://github.com/mehdibha.png",
  alt = "@mehdibha",
  fallback = "MB",
  size = "md",
}: AvatarPlaygroundProps) {
  return (
    <Avatar
      src={src}
      alt={alt}
      fallback={fallback}
      size={size}
    />
  );
}

export const avatarControls: Control[] = [
  {
    type: "string",
    name: "src",
    label: "Image URL",
    defaultValue: "https://github.com/mehdibha.png",
  },
  {
    type: "string",
    name: "alt",
    label: "Alt Text",
    defaultValue: "@mehdibha",
  },
  {
    type: "string",
    name: "fallback",
    label: "Fallback",
    defaultValue: "MB",
  },
  {
    type: "enum",
    name: "size",
    label: "Size",
    options: ["sm", "md", "lg"],
    defaultValue: "md",
  },
];

