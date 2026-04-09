"use client";

import { Link } from "@tanstack/react-router";

import { Breadcrumb, Breadcrumbs } from "@/registry/ui/breadcrumbs";

export default function Demo() {
	return (
		<Breadcrumbs>
			<Breadcrumb render={() => <Link to="/">Home</Link>}>Home</Breadcrumb>
			<Breadcrumb render={() => <Link to="/components">Components</Link>}>Components</Breadcrumb>
			<Breadcrumb
				render={() => (
					<Link to="/docs/$" params={{ _splat: "components/breadcrumbs" }}>
						Breadcrumbs
					</Link>
				)}
			>
				Breadcrumbs
			</Breadcrumb>
		</Breadcrumbs>
	);
}
