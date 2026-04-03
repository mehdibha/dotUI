import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";

import { ToggleButton } from "@/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group";

export function ToggleButtonGroupDemo() {
	return (
		<ToggleButtonGroup orientation="horizontal" selectionMode="single" defaultSelectedKeys={["left"]}>
			<ToggleButton id="left" aria-label="Align left">
				<AlignLeftIcon />
			</ToggleButton>
			<ToggleButton id="center" aria-label="Align center">
				<AlignCenterIcon />
			</ToggleButton>
			<ToggleButton id="right" aria-label="Align right">
				<AlignRightIcon />
			</ToggleButton>
		</ToggleButtonGroup>
	);
}
