"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  Breadcrumb as _Breadcrumb,
  BreadcrumbItem as _BreadcrumbItem,
  BreadcrumbLink as _BreadcrumbLink,
  Breadcrumbs as _Breadcrumbs,
} from "./basic";
import type {
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbProps,
  BreadcrumbsProps,
} from "./basic";

export const Breadcrumbs = createDynamicComponent<BreadcrumbsProps<object>>(
  "breadcrumbs",
  "Breadcrumbs",
  _Breadcrumbs,
  {},
);

export const Breadcrumb = createDynamicComponent<BreadcrumbProps>(
  "breadcrumbs",
  "Breadcrumb",
  _Breadcrumb,
  {},
);

export const BreadcrumbItem = createDynamicComponent<BreadcrumbItemProps>(
  "breadcrumbs",
  "BreadcrumbItem",
  _BreadcrumbItem,
  {},
);

export const BreadcrumbLink = createDynamicComponent<BreadcrumbLinkProps>(
  "breadcrumbs",
  "BreadcrumbLink",
  _BreadcrumbLink,
  {},
);

export type {
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbsProps,
};
