import { Breadcrumb, Breadcrumbs } from "@/registry/ui/breadcrumbs";

export function BreadcrumbsDemo() {
	return (
		<Breadcrumbs>
			<Breadcrumb href="#">Home</Breadcrumb>
			<Breadcrumb href="#">Components</Breadcrumb>
			<Breadcrumb href="#">Breadcrumbs</Breadcrumb>
		</Breadcrumbs>
	);
}
