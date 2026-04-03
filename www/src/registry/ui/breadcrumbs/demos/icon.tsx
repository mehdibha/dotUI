import { HomeIcon } from "@/registry/__generated__/icons";
import { Breadcrumb, Breadcrumbs } from "@/registry/ui/breadcrumbs";

export default function Demo() {
	return (
		<Breadcrumbs>
			<Breadcrumb href="#">
				<HomeIcon />
				Home
			</Breadcrumb>
			<Breadcrumb href="#">Components</Breadcrumb>
			<Breadcrumb href="#">Breadcrumbs</Breadcrumb>
		</Breadcrumbs>
	);
}
