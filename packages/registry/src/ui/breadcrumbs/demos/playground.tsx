"use client";

import { Breadcrumb, Breadcrumbs } from "@dotui/registry/ui/breadcrumbs";

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
