import { ToggleButton } from "@/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group";

export default function Demo() {
	return (
		<ToggleButtonGroup>
			<ToggleButton>A</ToggleButton>
			<ToggleButton>B</ToggleButton>
			<ToggleButton>C</ToggleButton>
		</ToggleButtonGroup>
	);
}
