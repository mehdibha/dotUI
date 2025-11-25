"use client";

import type { Control } from "@dotui/registry/playground";

import { Breadcrumb, Breadcrumbs } from "../index";

interface BreadcrumbsPlaygroundProps {
  isDisabled?: boolean;
}

export function BreadcrumbsPlayground({
  isDisabled = false,
}: BreadcrumbsPlaygroundProps) {
  return (
    <Breadcrumbs isDisabled={isDisabled}>
      <Breadcrumb href="#">Home</Breadcrumb>
      <Breadcrumb href="#">Components</Breadcrumb>
      <Breadcrumb href="#">Breadcrumbs</Breadcrumb>
    </Breadcrumbs>
  );
}

export const breadcrumbsControls: Control[] = [
  {
    type: "boolean",
    name: "isDisabled",
    label: "Disabled",
    defaultValue: false,
  },
];
