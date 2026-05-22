import { ToggleButton } from "@/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group";

export default function Demo() {
	return (
		<ToggleButtonGroup aria-label="Text alignment" defaultSelectedKeys={["left"]}>
			<ToggleButton id="left">Left</ToggleButton>
			<ToggleButton id="center">Center</ToggleButton>
			<ToggleButton id="right">Right</ToggleButton>
		</ToggleButtonGroup>
	);
}
