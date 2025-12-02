"use client";

import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@dotui/registry/ui/alert";

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
