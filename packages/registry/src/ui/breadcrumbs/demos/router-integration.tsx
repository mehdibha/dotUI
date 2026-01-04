"use client";

import { Breadcrumb, Breadcrumbs } from "@dotui/registry/ui/breadcrumbs";

export default function Demo() {
	// In a real app, use your router's hook (e.g., useLocation from TanStack Router)
	const pathname = "/docs/components/breadcrumbs";
	const pathnames = pathname.split("/").filter((x) => x);

	return (
		<Breadcrumbs>
			{pathnames.map((elem, index) => {
				const href = `/${pathnames.slice(0, index + 1).join("/")}`;
				return (
					<Breadcrumb key={elem} href={href} className="capitalize">
						{elem}
					</Breadcrumb>
				);
			})}
		</Breadcrumbs>
	);
}
