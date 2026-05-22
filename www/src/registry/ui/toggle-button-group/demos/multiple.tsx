import { BoldIcon, ItalicIcon, UnderlineIcon } from "@/registry/__generated__/icons";
import { ToggleButton } from "@/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group";

export default function Demo() {
	return (
		<ToggleButtonGroup
			selectionMode="multiple"
			defaultSelectedKeys={["bold", "underline"]}
			aria-label="Text formatting"
		>
			<ToggleButton id="bold" isIconOnly aria-label="Bold">
				<BoldIcon />
			</ToggleButton>
			<ToggleButton id="italic" isIconOnly aria-label="Italic">
				<ItalicIcon />
			</ToggleButton>
			<ToggleButton id="underline" isIconOnly aria-label="Underline">
				<UnderlineIcon />
			</ToggleButton>
		</ToggleButtonGroup>
	);
}
