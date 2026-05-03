import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Menu, MenuContent, MenuItem, MenuSection, MenuSectionHeader } from "@/registry/ui/menu";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	return (
		<Menu>
			<Button variant="default" className="w-fit">
				Radio Group
			</Button>
			<Popover>
				<MenuContent selectionMode="single" disabledKeys={["right"]}>
					<MenuSection>
						<MenuSectionHeader>Panel Position</MenuSectionHeader>
						<MenuItem id="top">
							<ArrowUpIcon />
							Top
						</MenuItem>
						<MenuItem id="bottom">
							<ArrowDownIcon />
							Bottom
						</MenuItem>
						<MenuItem id="right">
							<ArrowRightIcon />
							Right
						</MenuItem>
					</MenuSection>
				</MenuContent>
			</Popover>
		</Menu>
	);
}
