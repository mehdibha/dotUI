"use client";

import { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, Breadcrumbs } from "@/registry/ui/breadcrumbs";

interface BreadcrumbsPlaygroundProps {
	isDisabled?: boolean;
}

export function BreadcrumbsPlayground({ isDisabled = false }: BreadcrumbsPlaygroundProps) {
	return (
		<Breadcrumbs isDisabled={isDisabled}>
			<BreadcrumbItem>
				<BreadcrumbLink href="#">Home</BreadcrumbLink>
				<BreadcrumbSeparator />
			</BreadcrumbItem>
			<BreadcrumbItem>
				<BreadcrumbLink href="#">Components</BreadcrumbLink>
				<BreadcrumbSeparator />
			</BreadcrumbItem>
			<BreadcrumbItem>
				<BreadcrumbLink>Breadcrumbs</BreadcrumbLink>
			</BreadcrumbItem>
		</Breadcrumbs>
	);
}
