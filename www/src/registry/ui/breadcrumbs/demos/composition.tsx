import { ArrowRightCircleIcon } from "@/registry/__generated__/icons";
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, Breadcrumbs } from "@/registry/ui/breadcrumbs";

export default function Demo() {
	return (
		<Breadcrumbs>
			<BreadcrumbItem>
				<BreadcrumbLink href="#">Home</BreadcrumbLink>
				<BreadcrumbSeparator>
					<ArrowRightCircleIcon />
				</BreadcrumbSeparator>
			</BreadcrumbItem>
			<BreadcrumbItem>
				<BreadcrumbLink href="#">Components</BreadcrumbLink>
				<BreadcrumbSeparator>
					<ArrowRightCircleIcon />
				</BreadcrumbSeparator>
			</BreadcrumbItem>
			<BreadcrumbItem>
				<BreadcrumbLink>Breadcrumbs</BreadcrumbLink>
			</BreadcrumbItem>
		</Breadcrumbs>
	);
}
