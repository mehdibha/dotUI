"use client";

import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@dotui/registry/ui/alert";
import type { Control } from "@dotui/registry/playground";

interface AlertPlaygroundProps {
  title?: string;
  description?: string;
  variant?: "neutral" | "success" | "warning" | "danger" | "info";
  icon?: ReactNode;
}

export function AlertPlayground({
  title,
  description,
  variant,
  icon,
}: AlertPlaygroundProps) {
  return (
    <Alert variant={variant}>
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
}

export const alertControls: Control[] = [
  {
    type: "string",
    name: "title",
    label: "Title",
    defaultValue: "Alert Title",
    alwaysShow: true,
  },
  {
    type: "string",
    name: "description",
    label: "Description",
    defaultValue: "This is an alert description.",
    alwaysShow: true,
  },
  {
    type: "enum",
    name: "variant",
    label: "Variant",
    options: ["neutral", "success", "warning", "danger", "info"],
    defaultValue: "neutral",
  },
  {
    type: "icon",
    name: "icon",
    label: "Icon",
  },
];
