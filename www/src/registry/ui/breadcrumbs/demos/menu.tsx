import { MoreHorizontalIcon } from "@/registry/__generated__/icons";
import {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	Breadcrumbs,
} from "@/registry/ui/breadcrumbs";
import { Button } from "@/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	return (
		<Breadcrumbs>
			<BreadcrumbItem>
				<BreadcrumbLink href="#">Home</BreadcrumbLink>
				<BreadcrumbSeparator />
			</BreadcrumbItem>
			<BreadcrumbItem>
				<Menu>
					<Button variant="quiet" size="xs" aria-label="More pages">
						<MoreHorizontalIcon />
					</Button>
					<Popover placement="bottom">
						<MenuContent>
							<MenuItem href="#">Documentation</MenuItem>
							<MenuItem href="#">Components</MenuItem>
						</MenuContent>
					</Popover>
				</Menu>
				<BreadcrumbSeparator />
			</BreadcrumbItem>
			<BreadcrumbItem>
				<BreadcrumbLink>Breadcrumbs</BreadcrumbLink>
			</BreadcrumbItem>
		</Breadcrumbs>
	);
}
