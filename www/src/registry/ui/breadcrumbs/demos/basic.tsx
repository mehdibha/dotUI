import { Breadcrumb, Breadcrumbs } from "@/registry/ui/breadcrumbs";

export default function Demo() {
	return (
		<Breadcrumbs>
			<Breadcrumb href="#">Home</Breadcrumb>
			<Breadcrumb href="#">Components</Breadcrumb>
			<Breadcrumb href="#">Breadcrumbs</Breadcrumb>
		</Breadcrumbs>
	);
}
