"use client";

import { Link } from "@tanstack/react-router";

import { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, Breadcrumbs } from "@/registry/ui/breadcrumbs";

export default function Demo() {
	return (
		<Breadcrumbs>
			<BreadcrumbItem>
				<BreadcrumbLink render={() => <Link to="/">Home</Link>}>Home</BreadcrumbLink>
				<BreadcrumbSeparator />
			</BreadcrumbItem>
			<BreadcrumbItem>
				<BreadcrumbLink render={() => <Link to="/components">Components</Link>}>Components</BreadcrumbLink>
				<BreadcrumbSeparator />
			</BreadcrumbItem>
			<BreadcrumbItem>
				<BreadcrumbLink
					render={() => (
						<Link to="/docs/$" params={{ _splat: "components/breadcrumbs" }}>
							Breadcrumbs
						</Link>
					)}
				>
					Breadcrumbs
				</BreadcrumbLink>
			</BreadcrumbItem>
		</Breadcrumbs>
	);
}
