"use client";

import { Badge } from "@dotui/registry/ui/badge";

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
