"use client";

import { createDynamicComponent } from "@dotui/core/components/create-dynamic-component";

import * as Default from "./basic";
import type { BreadcrumbItemProps, BreadcrumbLinkProps, BreadcrumbProps, BreadcrumbsProps } from "./types";

export const Breadcrumbs = createDynamicComponent<BreadcrumbsProps<object>>(
	"breadcrumbs",
	"Breadcrumbs",
	Default.Breadcrumbs,
	{},
);

export const Breadcrumb = createDynamicComponent<BreadcrumbProps>("breadcrumbs", "Breadcrumb", Default.Breadcrumb, {});

export const BreadcrumbItem = createDynamicComponent<BreadcrumbItemProps>(
	"breadcrumbs",
	"BreadcrumbItem",
	Default.BreadcrumbItem,
	{},
);

export const BreadcrumbLink = createDynamicComponent<BreadcrumbLinkProps>(
	"breadcrumbs",
	"BreadcrumbLink",
	Default.BreadcrumbLink,
	{},
);

export type { BreadcrumbProps, BreadcrumbItemProps, BreadcrumbLinkProps, BreadcrumbsProps };
