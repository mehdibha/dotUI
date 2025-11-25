"use client";

import type { Control } from "@dotui/registry/playground";

import { Alert, AlertDescription, AlertTitle } from "../index";

interface AlertPlaygroundProps {
  title?: string;
  description?: string;
  variant?: "neutral" | "success" | "warning" | "danger" | "info";
}

export function AlertPlayground({
  title = "Alert Title",
  description = "This is an alert description.",
  variant = "neutral",
}: AlertPlaygroundProps) {
  return (
    <Alert variant={variant}>
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
  },
  {
    type: "string",
    name: "description",
    label: "Description",
    defaultValue: "This is an alert description.",
  },
  {
    type: "enum",
    name: "variant",
    label: "Variant",
    options: ["neutral", "success", "warning", "danger", "info"],
    defaultValue: "neutral",
  },
];
