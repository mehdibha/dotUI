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
  return <Avatar src={src} alt={alt} fallback={fallback} size={size} />;
}

export const avatarControls: Control[] = [
  {
    type: "string",
    name: "src",
    defaultValue: "https://github.com/mehdibha.png",
  },
  {
    type: "string",
    name: "alt",
    defaultValue: "@mehdibha",
  },
  {
    type: "string",
    name: "fallback",
    defaultValue: "MB",
  },
  {
    type: "enum",
    name: "size",
    options: ["sm", "md", "lg"],
    defaultValue: "md",
  },
];
