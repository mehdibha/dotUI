"use client";

import { createDynamicComponent } from "@/lib/create-dynamic-component";
import {
  Breadcrumbs as _Breadcrumbs,
  Breadcrumb as _Breadcrumb,
  BreadcrumbItem as _BreadcrumbItem,
  BreadcrumbLink as _BreadcrumbLink,
} from "@/registry/core/breadcrumbs_basic";
import type {
  BreadcrumbsProps,
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
} from "@/registry/core/breadcrumbs_basic";

export const Breadcrumbs = createDynamicComponent<BreadcrumbsProps<object>>(
  "breadcrumbs",
  "Breadcrumbs",
  _Breadcrumbs,
  {}
);

export const Breadcrumb = createDynamicComponent<BreadcrumbProps>(
  "breadcrumbs",
  "Breadcrumb",
  _Breadcrumb,
  {}
);

export const BreadcrumbItem = createDynamicComponent<BreadcrumbItemProps>(
  "breadcrumbs",
  "BreadcrumbItem",
  _BreadcrumbItem,
  {}
);

export const BreadcrumbLink = createDynamicComponent<BreadcrumbLinkProps>(
  "breadcrumbs",
  "BreadcrumbLink",
  _BreadcrumbLink,
  {}
);
