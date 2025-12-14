"use client";

import { Breadcrumb, Breadcrumbs } from "@dotui/registry/ui/breadcrumbs";

export function BreadcrumbDemo() {
	return (
		<div className="flex flex-col gap-6">
			<Breadcrumbs>
				<Breadcrumb href="#">Home</Breadcrumb>
				<Breadcrumb href="#">Products</Breadcrumb>
				<Breadcrumb href="#">Electronics</Breadcrumb>
				<Breadcrumb>Laptop</Breadcrumb>
			</Breadcrumbs>
		</div>
	);
}
