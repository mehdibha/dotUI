import { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, Breadcrumbs } from "@/registry/ui/breadcrumbs";

export default function Demo() {
	return (
		<Breadcrumbs>
			<BreadcrumbItem>
				<BreadcrumbLink href="#">Home</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbItem>
				<BreadcrumbSeparator />
			</BreadcrumbItem>
			<BreadcrumbItem>
				<BreadcrumbLink href="#">Components</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbItem>
				<BreadcrumbSeparator />
			</BreadcrumbItem>
			<BreadcrumbItem>
				<BreadcrumbLink>Breadcrumbs</BreadcrumbLink>
			</BreadcrumbItem>
		</Breadcrumbs>
	);
}
