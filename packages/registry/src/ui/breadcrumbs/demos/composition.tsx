import { ArrowRightCircleIcon } from "@dotui/registry/icons";
import { BreadcrumbItem, BreadcrumbLink, Breadcrumbs } from "@dotui/registry/ui/breadcrumbs";

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
