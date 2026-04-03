import { ArrowRightCircleIcon } from "@/registry/__generated__/icons";
import { BreadcrumbItem, BreadcrumbLink, Breadcrumbs } from "@/registry/ui/breadcrumbs";

export default function Demo() {
	return (
		<Breadcrumbs>
			<BreadcrumbItem>
				<BreadcrumbLink href="#">Home</BreadcrumbLink>
				<ArrowRightCircleIcon />
			</BreadcrumbItem>
			<BreadcrumbItem>
				<BreadcrumbLink href="#">Components</BreadcrumbLink>
				<ArrowRightCircleIcon />
			</BreadcrumbItem>
			<BreadcrumbItem>
				<BreadcrumbLink>Breadcrumbs</BreadcrumbLink>
			</BreadcrumbItem>
		</Breadcrumbs>
	);
}
