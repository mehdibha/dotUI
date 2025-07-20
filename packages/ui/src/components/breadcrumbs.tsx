"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Breadcrumb as _Breadcrumb,
  BreadcrumbItem as _BreadcrumbItem,
  BreadcrumbLink as _BreadcrumbLink,
  Breadcrumbs as _Breadcrumbs,
} from "../registry/components/breadcrumbs/basic";
import type {
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbProps,
  BreadcrumbsProps,
} from "../registry/components/breadcrumbs/basic";

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
